import { getRegion } from '@lib/data/regions'
import { getProductPrice } from '@lib/util/get-product-price'
import { ProductTile } from '@modules/products/components/product-tile'
import { PRODUCT_LIMIT } from '@modules/search/actions'
import { Pagination } from '@modules/store/components/pagination'
import { SearchedProduct } from 'types/global'

export default async function PaginatedProducts({
  products,
  total,
  page,
  countryCode,
}: {
  products: SearchedProduct[]
  total: number
  page: number
  countryCode: string
}) {
  const totalPages = Math.ceil(total / PRODUCT_LIMIT)
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <ul
        className="grid w-full grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        data-testid="products-list"
      >
        {products.map((p) => {
          const cheapestVariant = getProductPrice({
            product: p,
          })
          return (
            <li key={p.id} className="flex flex-col h-full">
              <ProductTile
                product={{
                  id: p.id,
                  created_at: p.created_at,
                  title: p.title,
                  handle: p.handle,
                  thumbnail: p.thumbnail,
                  calculatedPrice:
                    cheapestVariant.cheapestPrice?.calculated_price ?? '',
                  salePrice: p.sale_price,
                  variantCount: p.variants?.length ?? 1,
                }}
                regionId={region.id}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
