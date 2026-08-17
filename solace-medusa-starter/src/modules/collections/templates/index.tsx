import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getCollectionByHandle } from '@lib/data/collections'
import { getStoreFilters } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { StoreCollection } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Text } from '@modules/common/components/text'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import ActiveProductFilters from '@modules/store/components/filters/active-filters'
import HorizontalFilterBar from '@modules/store/components/horizontal-filter-bar'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export const runtime = 'edge'

export default async function CollectionTemplate({
  searchParams,
  params,
}: {
  searchParams: Promise<Record<string, string | undefined>>
  params: Promise<{ countryCode: string; handle: string }>
}) {
  const { sortBy, page, type, material, price, q } = await searchParams
  const { countryCode, handle } = await params

  const region = await getRegion(countryCode)
  if (!region) notFound()

  const currentCollection = await getCollectionByHandle(handle).then(
    (collection: StoreCollection) => collection
  )
  if (!currentCollection) notFound()

  const pageNumber = page ? parseInt(page) : 1
  const filters = await getStoreFilters(countryCode)

  const { results, count } = await search({
    currency_code: region.currency_code,
    region_id: region.id,
    order: sortBy,
    page: pageNumber,
    collection: [currentCollection.id],
    type: type?.split(','),
    material: material?.split(','),
    price: price?.split(','),
    query: q,
  })

  return (
    <Container className="flex flex-col gap-6 !pb-8 !pt-0">
      {/* Collection dropdown hidden — already filtered to this collection */}
      <HorizontalFilterBar
        filters={filters}
        lockedCollectionId={currentCollection.id}
        countryCode={countryCode}
        sortBy={sortBy || 'relevance'}
        config={{ showCollection: false }}
      />

      <Box>
        <Text className="text-md text-secondary">
          {count === 1 ? `${count} product` : `${count} products`}
        </Text>
      </Box>

      <ActiveProductFilters
        filters={filters}
        currentCollection={currentCollection}
        countryCode={countryCode}
      />

      <Suspense fallback={<SkeletonProductGrid />}>
        {results && results.length > 0 ? (
          <PaginatedProducts
            products={results}
            page={pageNumber}
            total={count}
            countryCode={countryCode}
          />
        ) : (
          <p className="py-10 text-center text-lg text-secondary">
            No products.
          </p>
        )}
      </Suspense>
    </Container>
  )
}
