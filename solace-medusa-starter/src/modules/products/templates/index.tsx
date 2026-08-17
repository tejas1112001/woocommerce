import { Suspense } from 'react'

import { retrieveCart } from '@lib/data/cart'
import { ProductVariantProvider } from '@lib/context/product-variant-context'
import { getProductsListByCollectionId } from '@lib/data/products'
import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductTabs from '@modules/products/components/product-tabs'
import ProductInfo from '@modules/products/templates/product-info'
import SkeletonProductActions from '@modules/skeletons/components/skeleton-product-actions'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'

import { ProductCarousel } from '../components/product-carousel'
import ProductBreadcrumbs from './breadcrumbs'
import ProductActionsWrapper from './product-actions-wrapper'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

/**
 * A map of common color names (lowercase) to their hex values.
 * Used as a fallback when no `color_hex` metadata is set on a variant.
 * Add entries here to support additional color names used in your catalog.
 */
const COLOR_NAME_TO_HEX: Record<string, string> = {
  // Neutrals
  black: '#000000',
  white: '#ffffff',
  grey: '#808080',
  gray: '#808080',
  'light gray': '#d3d3d3',
  'light grey': '#d3d3d3',
  'dark gray': '#404040',
  'dark grey': '#404040',
  silver: '#c0c0c0',
  charcoal: '#36454f',
  offwhite: '#faf9f6',
  'off white': '#faf9f6',
  cream: '#fffdd0',
  ivory: '#fffff0',
  beige: '#f5f5dc',
  taupe: '#483c32',

  // Blues
  navy: '#001f5b',
  'navy blue': '#001f5b',
  blue: '#0000ff',
  'royal blue': '#4169e1',
  'sky blue': '#87ceeb',
  'baby blue': '#89cff0',
  'midnight blue': '#191970',
  cobalt: '#0047ab',
  teal: '#008080',
  turquoise: '#40e0d0',
  aqua: '#00ffff',
  denim: '#1560bd',

  // Reds & Pinks
  red: '#ff0000',
  crimson: '#dc143c',
  burgundy: '#800020',
  maroon: '#800000',
  rose: '#ff007f',
  pink: '#ffc0cb',
  'hot pink': '#ff69b4',
  blush: '#de5d83',
  coral: '#ff6b6b',
  salmon: '#fa8072',

  // Greens
  green: '#008000',
  olive: '#808000',
  'forest green': '#228b22',
  'forest': '#228b22',
  lime: '#00ff00',
  mint: '#98ff98',
  sage: '#b2ac88',
  emerald: '#50c878',
  hunter: '#355e3b',
  khaki: '#c3b091',

  // Yellows & Oranges
  yellow: '#ffff00',
  gold: '#ffd700',
  mustard: '#ffdb58',
  orange: '#ff8c00',
  amber: '#ffbf00',
  peach: '#ffcba4',

  // Purples
  purple: '#800080',
  violet: '#ee82ee',
  lavender: '#e6e6fa',
  lilac: '#c8a2c8',
  plum: '#dda0dd',
  indigo: '#4b0082',
  mauve: '#e0b0ff',

  // Browns
  brown: '#a52a2a',
  tan: '#d2b48c',
  caramel: '#c68642',
  chocolate: '#7b3f00',
  mocha: '#967969',
  rust: '#b7410e',
  terracotta: '#e2725b',
  'terra cotta': '#e2725b',

  // Specialty
  camel: '#c19a6b',
  sand: '#c2b280',
  stone: '#928e85',
  slate: '#708090',
  'rose gold': '#b76e79',
  copper: '#b87333',
  bronze: '#cd7f32',
  champagne: '#f7e7ce',
  wine: '#722f37',
}

/**
 * Resolve a color name to a hex string.
 * Returns undefined if the name is not in the map.
 */
function colorNameToHex(name: string): string | undefined {
  return COLOR_NAME_TO_HEX[name.toLowerCase().trim()]
}

/**
 * Build variant color data from product variant metadata.
 * Each variant can carry a `color_hex` or `color_image_url` key in its metadata
 * to power the color swatch UI. If no metadata is found, the color name is
 * matched against a built-in name→hex map so common colors (Black, Navy, White,
 * etc.) automatically render as visual swatches without any manual configuration.
 */
function buildVariantColors(product: HttpTypes.StoreProduct) {
  if (!product.options || !product.variants) return []

  const colorOption = product.options.find(
    (o) => o.title?.toLowerCase() === 'color'
  )
  if (!colorOption) return []

  const colorValues = colorOption.values?.map((v) => v.value) ?? []

  return colorValues.map((colorName) => {
    // Find any variant that has this color option value and has metadata
    const variant = product.variants?.find((v) =>
      v.options?.some(
        (o) =>
          o.option_id === colorOption.id && o.value === colorName
      )
    )

    const meta = variant?.metadata as Record<string, unknown> | null | undefined
    const colorHex =
      (meta?.color_hex as string | undefined) ??
      colorNameToHex(colorName)
    const colorImageUrl =
      (meta?.color_image_url as string | undefined) ?? undefined

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

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  // Build color swatch data from variant metadata (no external CMS needed)
  const variantsColors = buildVariantColors(product)

  const { response: productsList } = await getProductsListByCollectionId({
    collectionId: product.collection_id,
    countryCode,
    excludeProductId: product.id,
  })

  const cart = await retrieveCart()

  return (
    // ProductVariantProvider enables ImageGallery and ProductActions to share selected variant state
    <ProductVariantProvider>
      <Container
        className="relative flex flex-col gap-y-6 !py-8 small:gap-y-12"
        data-testid="product-container"
      >
        <ProductBreadcrumbs product={product} countryCode={countryCode} />
        <Box className="relative flex flex-col gap-y-6 large:flex-row large:items-start large:gap-x-10 xl:gap-x-14 max-w-[1200px] mx-auto w-full">
          <Box className="relative block w-full large:max-w-[540px] xl:max-w-[580px]">
            <ImageGallery
              title={product.title}
              images={product?.images || []}
            />
          </Box>
          <Box className="flex w-full flex-col gap-y-8 py-8 large:sticky large:top-24 large:max-w-[460px] large:py-0">
            <div className="flex flex-col gap-y-1">
              <ProductInfo product={product} />
            </div>
            <Suspense fallback={<SkeletonProductActions />}>
              <ProductActionsWrapper
                id={product.id}
                region={region}
                cartItems={cart?.items}
                colors={variantsColors}
              />
            </Suspense>
            <div className="border-t border-gray-100 pt-2">
              <ProductTabs product={product} />
            </div>
          </Box>
        </Box>
      </Container>

      {productsList.products.length > 0 && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={productsList.products}
            regionId={region.id}
            title="You May Also Like"
          />
        </Suspense>
      )}
    </ProductVariantProvider>
  )
}

export default ProductTemplate
