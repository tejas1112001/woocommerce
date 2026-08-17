import { NextResponse } from 'next/server'
import { getRegion } from '@lib/data/regions'
import { getProductByHandle, getProductsListByCollectionId } from '@lib/data/products'
import { retrieveCart } from '@lib/data/cart'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('countryCode') || 'in'
  const handle = searchParams.get('handle') || 't-shirt'

  let regionResult: any = null
  let productResult: any = null
  let buildColorsResult: any = null
  let collectionProductsResult: any = null
  let cartResult: any = null
  let errorMsg: string | null = null

  try {
    // 1. Get region
    regionResult = await getRegion(countryCode)
    
    if (regionResult) {
      // 2. Get product
      productResult = await getProductByHandle(handle, regionResult.id)
      
      if (productResult) {
        // 3. Test buildVariantColors
        try {
          buildColorsResult = buildVariantColors(productResult)
        } catch (e: any) {
          buildColorsResult = { error: e.message, stack: e.stack }
        }

        // 4. Test getProductsListByCollectionId
        try {
          collectionProductsResult = await getProductsListByCollectionId({
            collectionId: productResult.collection_id,
            countryCode,
            excludeProductId: productResult.id,
          })
        } catch (e: any) {
          collectionProductsResult = { error: e.message, stack: e.stack }
        }
      }
    }

    // 5. Test retrieveCart
    try {
      cartResult = await retrieveCart()
    } catch (e: any) {
      cartResult = { error: e.message, stack: e.stack }
    }

  } catch (error: any) {
    errorMsg = error.message + '\n' + error.stack
  }

  return NextResponse.json({
    countryCode,
    handle,
    region: regionResult,
    product: productResult,
    buildColors: buildColorsResult,
    collectionProducts: collectionProductsResult,
    cart: cartResult,
    error: errorMsg
  })
}

// Extracted from templates/index.tsx
function buildVariantColors(product: any) {
  if (!product.options || !product.variants) return []

  const colorOption = product.options.find(
    (o: any) => o.title?.toLowerCase() === 'color'
  )
  if (!colorOption) return []

  const colorValues = colorOption.values?.map((v: any) => v.value) ?? []

  return colorValues.map((colorName: string) => {
    const variant = product.variants?.find((v: any) =>
      v.options?.some(
        (o: any) =>
          o.option_id === colorOption.id && o.value === colorName
      )
    )

    const meta = variant?.metadata as Record<string, unknown> | null | undefined
    const colorHex = meta?.color_hex as string | undefined
    const colorImageUrl = meta?.color_image_url as string | undefined

    return {
      Name: colorName,
      Type: [
        {
          ...(colorImageUrl
            ? { Image: { url: colorImageUrl, alternativeText: colorName } }
            : {}),
          ...(colorHex ? { Color: colorHex } : {}),
        },
      ],
    }
  })
}
