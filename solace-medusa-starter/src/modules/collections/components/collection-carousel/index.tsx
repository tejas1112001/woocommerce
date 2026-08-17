'use client'

import { Box } from '@modules/common/components/box'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ProductTile } from '@modules/products/components/product-tile'

interface CollectionProduct {
  id: string
  created_at: string
  title: string
  handle: string
  thumbnail: string
  calculatedPrice: string
  salePrice: string
}

interface CollectionCarouselProps {
  collection: {
    id: string
    title: string
    handle: string
    description: string | null
  }
  products: CollectionProduct[]
  regionId: string
}

export default function CollectionCarousel({
  collection,
  products,
  regionId,
}: CollectionCarouselProps) {
  const isEmpty = products.length === 0

  return (
    <div className="bg-white py-10 small:py-14">
      <div className="mx-auto box-content max-w-[1328px] px-4 small:px-14">

        {/* ── Header row ─────────────────────────────── */}
        <div className="mb-6 flex items-start justify-between gap-4 small:mb-8">

          {/* Left: eyebrow + title + description */}
          <Box className="flex flex-col gap-1">
            <Text
              size="sm"
              className="font-semibold uppercase tracking-widest text-action-primary"
            >
              Collection
            </Text>
            <Heading
              as="h2"
              className="text-2xl font-semibold text-basic-primary small:text-3xl"
            >
              {collection.title}
            </Heading>
            {collection.description && (
              <Text size="md" className="mt-1 text-secondary">
                {collection.description}
              </Text>
            )}
          </Box>

          {/* Right: view-all link */}
          <Box className="flex shrink-0 items-start">
            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="rounded-3xl border border-basic-primary px-4 py-2 text-sm font-medium text-basic-primary transition-colors hover:bg-fg-secondary"
            >
              View all →
            </LocalizedClientLink>
          </Box>
        </div>

        {/* ── Products Grid ───────────────────────────────── */}
        {isEmpty ? (
          <Text size="md" className="py-8 text-center text-secondary">
            No products in this collection yet.
          </Text>
        ) : (
          /* Static responsive grid matching shop and collection pages */
          <ul className="grid w-full grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {products.slice(0, 10).map((product) => (
              <li key={product.id} className="flex flex-col h-full">
                <ProductTile product={product} regionId={regionId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
