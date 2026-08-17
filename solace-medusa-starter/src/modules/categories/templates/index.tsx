import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getCategoryByHandle } from '@lib/data/categories'
import { getProductsList, getStoreFilters } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Text } from '@modules/common/components/text'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'
import ActiveProductFilters from '@modules/store/components/filters/active-filters'
import HorizontalFilterBar from '@modules/store/components/horizontal-filter-bar'
import PaginatedProducts from '@modules/store/templates/paginated-products'

export const runtime = 'edge'

export default async function CategoryTemplate({
  searchParams,
  params,
}: {
  searchParams: Promise<Record<string, string | undefined>>
  params: Promise<{ countryCode: string; category: string[] }>
}) {
  const { sortBy, page, collection, type, material, price, q, category } = await searchParams
  const { countryCode, category: categoryHandle } = await params

  const region = await getRegion(countryCode)
  const { product_categories } = await getCategoryByHandle(categoryHandle)
  const currentCategory = product_categories[product_categories.length - 1]

  if (!currentCategory || !region) notFound()

  const pageNumber = page ? parseInt(page) : 1
  const filters = await getStoreFilters(countryCode)

  const { results, count } = await search({
    region_id: region.id,
    currency_code: region.currency_code,
    category_id: currentCategory.id,
    order: sortBy,
    page: pageNumber,
    collection: collection?.split(','),
    type: type?.split(','),
    material: material?.split(','),
    price: price?.split(','),
    query: q,
  })

  const { products: recommendedProducts } = await getProductsList({
    pageParam: 0,
    queryParams: { limit: 9 },
    countryCode: countryCode,
  }).then(({ response }) => response)

  return (
    <>
      <Container className="flex flex-col gap-6 !pb-8 !pt-0">
        <HorizontalFilterBar
          filters={filters}
          countryCode={countryCode}
          sortBy={sortBy || 'relevance'}
        />

        <Box>
          <Text className="text-md text-secondary">
            {count === 1 ? `${count} product` : `${count} products`}
          </Text>
        </Box>

        <ActiveProductFilters
          filters={filters}
          currentCategory={currentCategory}
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

      {recommendedProducts && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={recommendedProducts}
            regionId={region.id}
            title="Recommended products"
          />
        </Suspense>
      )}
    </>
  )
}
