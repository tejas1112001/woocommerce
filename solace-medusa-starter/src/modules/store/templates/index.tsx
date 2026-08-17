import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getStoreFilters } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { Container } from '@modules/common/components/container'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import HorizontalFilterBar from '@modules/store/components/horizontal-filter-bar'

import ActiveProductFilters from '../components/filters/active-filters'
import PaginatedProducts from './paginated-products'

export const runtime = 'edge'

export default async function StoreTemplate({
  searchParams,
  params,
}: {
  searchParams: Promise<Record<string, string | undefined>>
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const { sortBy, page, collection, type, material, price, q, category } =
    await searchParams
  const region = await getRegion(countryCode)

  if (!region) {
    return notFound()
  }

  const pageNumber = page ? parseInt(page) : 1
  const filters = await getStoreFilters(countryCode)

  const { results, count } = await search({
    currency_code: region.currency_code,
    region_id: region.id,
    order: sortBy,
    page: pageNumber,
    collection: collection?.split(','),
    type: type?.split(','),
    material: material?.split(','),
    price: price?.split(','),
    query: q,
    category_ids: category?.split(','),
  })

  return (
    <Container className="flex flex-col gap-6 !pb-8 !pt-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Shree Swami Samarth Devotional Store
        </h1>
        <p className="text-sm text-gray-600">
          Discover authentic devotional products inspired by Akkalkot Maharaj. Shipping across Maharashtra & India.
        </p>
      </div>

      {/* Unified horizontal filter + sort bar with inline active chips */}
      <HorizontalFilterBar
        filters={filters}
        countryCode={countryCode}
        sortBy={sortBy || 'relevance'}
        activeFiltersSlot={
          <ActiveProductFilters countryCode={countryCode} filters={filters} />
        }
      />

      {/* Product grid */}
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
