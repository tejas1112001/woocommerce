'use client'

import { useParams } from 'next/navigation'

import { HttpTypes } from '@medusajs/types'
import DiscountCode from '@modules/checkout/components/discount-code'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import CartTotals from '@modules/common/components/cart-totals'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  /**
   * The currently authenticated customer (null = guest).
   * Used to enforce that only logged-in customers can proceed to checkout.
   * Guest checkout is intentionally disabled.
   */
  customer: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return 'address'
  } else if (cart?.shipping_methods?.length === 0) {
    return 'delivery'
  } else {
    return 'payment'
  }
}

const Summary = ({ cart, customer }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const { countryCode } = useParams()

  // The full checkout URL the user is trying to reach.
  const checkoutHref = `/checkout?step=${step}`

  // When a guest clicks "Proceed to checkout", redirect them to the login page
  // with a `redirectTo` param. After successful auth the login/signup server
  // actions will send the customer back to the checkout URL automatically.
  const loginHref = `/account?redirectTo=${encodeURIComponent(
    `/${countryCode}${checkoutHref}`
  )}`

  return (
    <Box className="flex w-full flex-col gap-2 large:w-[326px] xl:w-[437px]">
      <DiscountCode cart={cart} />
      <Box className="flex flex-col gap-5 bg-primary p-5">
        <CartTotals totals={cart} />

        {customer ? (
          // ── Authenticated customer: go straight to checkout ────────────────
          <LocalizedClientLink
            href={checkoutHref}
            data-testid="checkout-button"
          >
            <Button className="w-full">Proceed to checkout</Button>
          </LocalizedClientLink>
        ) : (
          // ── Guest: redirect to login with the checkout URL as return target ─
          // Guest checkout is disabled. The proxy (proxy.ts) also enforces this
          // at the route level, so this is a second layer of defence that gives
          // the user a smooth UX rather than a mid-flight redirect.
          <LocalizedClientLink
            href={loginHref}
            data-testid="checkout-button"
          >
            <Button className="w-full">Proceed to checkout</Button>
          </LocalizedClientLink>
        )}
      </Box>
    </Box>
  )
}

export default Summary
