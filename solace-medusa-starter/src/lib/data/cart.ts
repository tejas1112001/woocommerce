'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import { getLocalizedPath } from '@lib/util/urls'
import { HttpTypes } from '@medusajs/types'
import { omit } from 'lodash'

import { getAuthHeaders, getCartId, removeCartId, setCartId } from './cookies'
import { getProductByHandle, getProductsById } from './products'
import { getRegion } from './regions'
import { getCustomer } from './customer'

export async function retrieveCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return null
  }

  const authHeaders = await getAuthHeaders()

  const cart = await sdk.store.cart
    .retrieve(cartId, {}, { next: { tags: ['cart'] }, ...authHeaders })
    .then(({ cart }) => cart)
    .catch(() => {
      return null
    })

  if (cart) {
    const customer = await getCustomer().catch(() => null)
    if (cart.customer_id && customer && cart.customer_id !== customer.id) {
      try {
        await removeCartId()
      } catch {
        // Cookie mutation is not allowed during SSR rendering (only in Server
        // Actions / Route Handlers). Silently swallow the error here; the stale
        // cart ID will be cleaned up the next time this path is hit from an
        // action context.
      }
      return null
    }
  }

  return cart
}

export async function getOrSetCart(countryCode: string) {
  let cart = await retrieveCart()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  const authHeaders = await getAuthHeaders()

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      authHeaders
    )
    cart = cartResp.cart
    setCartId(cart.id)
    revalidateTag('cart', 'max')
  }

  if (cart && cart?.region_id !== region.id) {
    const authHeaders = await getAuthHeaders()

    await sdk.store.cart.update(
      cart.id,
      { region_id: region.id },
      {},
      authHeaders
    )
    revalidateTag('cart', 'max')
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('No existing cart found, please create one before updating')
  }

  const authHeaders = await getAuthHeaders()

  return sdk.store.cart
    .update(cartId, data, {}, authHeaders)
    .then(({ cart }) => {
      revalidateTag('cart', 'max')
      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    console.error('[addToCart] Missing variant ID')
    throw new Error('Missing variant ID when adding to cart')
  }

  console.log('[addToCart] Starting with:', { variantId, quantity, countryCode })

  const cart = await getOrSetCart(countryCode)
  if (!cart) {
    console.error('[addToCart] Failed to retrieve or create cart')
    throw new Error('Error retrieving or creating cart')
  }

  console.log('[addToCart] Cart retrieved:', cart.id)

  const authHeaders = await getAuthHeaders()
  console.log('[addToCart] Auth headers prepared:', Object.keys(authHeaders))

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      authHeaders
    )
    .then(() => {
      console.log('[addToCart] Successfully added item to cart')
      revalidateTag('cart', 'max')
    })
    .catch((error) => {
      console.error('[addToCart] Error adding to cart:', error)
      medusaError(error)
    })
}

export async function addToCartCheapestVariant({
  productHandle,
  regionId,
  countryCode,
}: {
  productHandle: string
  regionId: string
  countryCode: string
}) {
  if (!productHandle || !regionId || !countryCode) {
    return {
      success: false,
      error: 'Missing required parameters',
    }
  }

  try {
    const detailedProduct = await getProductByHandle(productHandle, regionId)

    if (!detailedProduct) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    const variants = detailedProduct.variants
    if (!variants?.length) {
      return {
        success: false,
        error: 'Product has no variants',
      }
    }

    const pricedVariants = variants.filter(
      (v) => v.calculated_price?.original_amount != null
    )

    const cheapestVariant =
      pricedVariants.length > 0
        ? pricedVariants.reduce((cheapest, current) =>
            cheapest.calculated_price!.original_amount <
            current.calculated_price!.original_amount
              ? cheapest
              : current
          )
        : variants[0]

    const canAdd =
      !cheapestVariant.manage_inventory ||
      cheapestVariant.allow_backorder ||
      (cheapestVariant.inventory_quantity ?? 0) > 0

    if (!canAdd) {
      return {
        success: false,
        error: 'Product is out of stock',
      }
    }

    await addToCart({
      variantId: cheapestVariant.id, // Add the cheapest variant to the cart
      quantity: 1,
      countryCode,
    })

    return {
      success: true,
      message: 'Product added to cart',
    }
  } catch (error) {
    console.error('Error adding product to cart:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when updating line item')
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('Missing cart ID when updating line item')
  }

  const authHeaders = await getAuthHeaders()

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, authHeaders)
    .then(() => {
      revalidateTag('cart', 'max')
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when deleting line item')
  }

  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('Missing cart ID when deleting line item')
  }

  const authHeaders = await getAuthHeaders()

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, authHeaders)
    .then(() => {
      revalidateTag('cart', 'max')
    })
    .catch(medusaError)

  revalidateTag('cart', 'max')
}

export async function enrichLineItems(
  lineItems:
    | HttpTypes.StoreCartLineItem[]
    | HttpTypes.StoreOrderLineItem[]
    | null,
  regionId: string
) {
  if (!lineItems) return []

  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id!),
    regionId: regionId,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)
  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information
  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p: any) => p.id === item.product_id)
    const variant = product?.variants?.find(
      (v: any) => v.id === item.variant_id
    )

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, 'variants'),
      },
    }
  }) as HttpTypes.StoreCartLineItem[]

  return enrichedItems
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const authHeaders = await getAuthHeaders()

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, authHeaders)
    .then(() => {
      revalidateTag('cart', 'max')
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: {
    provider_id: string
    context?: Record<string, unknown>
  }
) {
  const authHeaders = await getAuthHeaders()

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, authHeaders)
    .then((resp) => {
      revalidateTag('cart', 'max')
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('No existing cart found')
  }

  await updateCart({ promo_codes: codes })
    .then(() => {
      revalidateTag('cart', 'max')
    })
    .catch(medusaError)
}

// export async function applyGiftCard(code: string) {
//   //   const cartId = getCartId()
//   //   if (!cartId) return "No cartId cookie found"
//   //   try {
//   //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
//   //       revalidateTag("cart")
//   //     })
//   //   } catch (error: any) {
//   //     throw error
//   //   }
// }

// export async function removeDiscount(code: string) {
//   // const cartId = getCartId()
//   // if (!cartId) return "No cartId cookie found"
//   // try {
//   //   await deleteDiscount(cartId, code)
//   //   revalidateTag("cart")
//   // } catch (error: any) {
//   //   throw error
//   // }
// }

// export async function removeGiftCard(
//   codeToRemove: string,
//   giftCards: any[]
//   // giftCards: GiftCard[]
// ) {
//   //   const cartId = getCartId()
//   //   if (!cartId) return "No cartId cookie found"
//   //   try {
//   //     await updateCart(cartId, {
//   //       gift_cards: [...giftCards]
//   //         .filter((gc) => gc.code !== codeToRemove)
//   //         .map((gc) => ({ code: gc.code })),
//   //     }).then(() => {
//   //       revalidateTag("cart")
//   //     })
//   //   } catch (error: any) {
//   //     throw error
//   //   }
// }

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get('code') as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error('No form data found when setting addresses')
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error('No existing cart found when setting addresses')
    }

    const data = {
      shipping_address: {
        first_name: formData.get('shipping_address.first_name'),
        last_name: formData.get('shipping_address.last_name'),
        address_1: formData.get('shipping_address.address_1'),
        address_2: '',
        company: formData.get('shipping_address.company'),
        postal_code: formData.get('shipping_address.postal_code'),
        city: formData.get('shipping_address.city'),
        country_code: formData.get('shipping_address.country_code'),
        province: formData.get('shipping_address.province'),
        phone: formData.get('shipping_address.phone'),
      },
      email: formData.get('email'),
    } as any

    const sameAsShipping = formData.get('same_as_shipping')
    if (sameAsShipping === 'on') data.billing_address = data.shipping_address

    if (sameAsShipping !== 'on')
      data.billing_address = {
        first_name: formData.get('billing_address.first_name'),
        last_name: formData.get('billing_address.last_name'),
        address_1: formData.get('billing_address.address_1'),
        address_2: '',
        company: formData.get('billing_address.company'),
        postal_code: formData.get('billing_address.postal_code'),
        city: formData.get('billing_address.city'),
        country_code: formData.get('billing_address.country_code'),
        province: formData.get('billing_address.province'),
        phone: formData.get('billing_address.phone'),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  const rawCountryCode = (formData.get('shipping_address.country_code') as string) || ''
  const countryCode = rawCountryCode.toLowerCase()

  redirect(getLocalizedPath('/checkout?step=delivery', countryCode))
}

export async function placeOrder() {
  const cartId = await getCartId()
  if (!cartId) {
    throw new Error('No existing cart found when placing an order')
  }

  const authHeaders = await getAuthHeaders()

  /**
   * WHY RETRY LOGIC EXISTS:
   *
   * After a Razorpay payment succeeds, there is a short window (< 2 seconds)
   * where Medusa's payment session is transitioning from REQUIRES_MORE →
   * AUTHORIZED. If placeOrder() is called during this window, cart.complete()
   * returns { type: 'cart' } instead of { type: 'order' } because the
   * payment hasn't been fully authorized yet.
   *
   * We retry up to MAX_RETRIES times with exponential back-off to ride out
   * this window. If the order still hasn't completed after all retries, we
   * throw a descriptive error so the caller can show the right message.
   */
  const MAX_RETRIES = 4
  const BASE_DELAY_MS = 1500 // 1.5 s between retries

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const cartRes = await sdk.store.cart
      .complete(cartId, {}, authHeaders)
      .then((cartRes) => {
        revalidateTag('cart', 'max')
        return cartRes
      })
      .catch(medusaError)

    if (cartRes?.type === 'order') {
      // ── Success path ──────────────────────────────────────────────────────
      // removeCartId() clears the _medusa_cart_id cookie so the cart header
      // shows 0 items immediately after the redirect to /order/confirmed/[id].
      await removeCartId()
      return JSON.parse(JSON.stringify(cartRes.order))
    }

    // Cart is still in a non-order state; wait before retrying
    if (attempt < MAX_RETRIES) {
      console.log(
        `[placeOrder] cart.complete returned type='${cartRes?.type}' on attempt ${attempt}/${MAX_RETRIES}. Retrying in ${BASE_DELAY_MS}ms…`
      )
      await new Promise((resolve) => setTimeout(resolve, BASE_DELAY_MS))
    }
  }

  // All retries exhausted — payment was verified but Medusa never transitioned
  // the cart to an order. This usually means a configuration issue on the
  // backend (e.g., the payment provider did not return AUTHORIZED status).
  throw new Error(
    'Unable to complete your order. Your payment was received but the order ' +
      'could not be created. Please contact support with your payment details.'
  )
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    revalidateTag('cart', 'max')
  }

  revalidateTag('regions', 'max')
  revalidateTag('products', 'max')

  redirect(getLocalizedPath(currentPath, countryCode))
}
