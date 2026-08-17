import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { Box } from '@modules/common/components/box'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
import { WishlistButton } from '@modules/common/components/wishlist-button'

import { ProductActions } from './action'
import { LoadingImage } from './loading-image'
import ProductPrice from './price'

export function ProductTile({
  product,
  regionId,
}: {
  product: {
    id: string
    created_at: string
    title: string
    handle: string
    thumbnail: string
    calculatedPrice: string
    salePrice: string
    variantCount?: number
  }
  regionId: string
}) {
  return (
    <Box
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-white border border-gray-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300"
      data-testid={formatNameForTestId(`${product.title}-product-tile`)}
    >
      {/* Image area — Square 1:1 ratio, clean and compact */}
      <Box className="relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-50">
        {/* Wishlist button */}
        <Box className="absolute right-2 top-2 z-10">
          <WishlistButton
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              thumbnail: product.thumbnail ?? null,
              price: product.calculatedPrice,
            }}
            size="sm"
            className="shadow-sm backdrop-blur-md bg-white/90 border-white/60 hover:bg-white transition-all duration-200 !h-7 !w-7"
          />
        </Box>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block h-full w-full"
        >
          <LoadingImage
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </LocalizedClientLink>
      </Box>

      {/* Info + CTA — Compact spacing and fixed bottom button */}
      <ProductInfo
        productHandle={product.handle}
        productTitle={product.title}
        calculatedPrice={product.calculatedPrice}
        salePrice={product.salePrice}
        regionId={regionId}
        variantCount={product.variantCount ?? 1}
      />
    </Box>
  )
}

function ProductInfo({
  productHandle,
  productTitle,
  calculatedPrice,
  salePrice,
  regionId,
  variantCount,
}: {
  productHandle: string
  productTitle: string
  calculatedPrice: string
  salePrice: string
  regionId: string
  variantCount: number
}) {
  return (
    <Box className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 gap-2">
      {/* Top section: Title and Price */}
      <div className="flex flex-col gap-1.5">
        {/* Product name with reserved 2-line height for row alignment */}
        <LocalizedClientLink href={`/products/${productHandle}`}>
          <Text
            title={productTitle}
            as="span"
            className="line-clamp-2 min-h-[2.1rem] sm:min-h-[2.5rem] text-xs sm:text-[15px] font-semibold leading-snug tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-action-primary"
          >
            {productTitle}
          </Text>
        </LocalizedClientLink>

        {/* Price row */}
        <ProductPrice calculatedPrice={calculatedPrice} salePrice={salePrice} />
      </div>

      {/* Add to cart / View Options — fixed to bottom */}
      <div className="mt-auto pt-1">
        <ProductActions
          productHandle={productHandle}
          regionId={regionId}
          variantCount={variantCount}
        />
      </div>
    </Box>
  )
}
