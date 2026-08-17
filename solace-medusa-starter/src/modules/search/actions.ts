import { safeDecodeURIComponent } from '@lib/util/safe-decode-uri'
import { getProductPrice } from '@lib/util/get-product-price'
import { HttpTypes } from '@medusajs/types'
import { SearchedProducts, SearchedProduct } from 'types/global'

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
export const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
export const PRODUCT_LIMIT = 12

/** Medusa only supports `relevance` when a search plugin is configured; otherwise use created_at. */
function resolveProductOrder(order?: string): string {
  switch (order) {
    case 'price_asc':
      return 'calculated_price'
    case 'price_desc':
      return '-calculated_price'
    case 'created_at':
      return '-created_at'
    case 'relevance':
    case undefined:
    case '':
      return '-created_at'
    default:
      return order.startsWith('-') || order.includes('_') ? order : `-created_at`
  }
}

type SearchParams = {
  currency_code: string
  region_id: string
  page?: number
  order?: string
  category_id?: string
  category_ids?: string[]
  collection?: string[]
  type?: string[]
  material?: string[]
  price?: string[]
  query?: string
}

export async function search({
  currency_code,
  region_id,
  page = 1,
  order = 'relevance',
  category_id,
  category_ids,
  collection,
  type,
  material,
  price,
  query,
}: SearchParams): Promise<SearchedProducts> {
  const sortBy = resolveProductOrder(order)

  const queryParams: HttpTypes.StoreProductParams & Record<string, any> = {
    region_id,
    limit: PRODUCT_LIMIT,
    offset: (page - 1) * PRODUCT_LIMIT,
    order: sortBy,
  }

  // Single category_id (used on category pages) takes priority;
  // otherwise use multi-select category_ids from filter bar
  if (category_id) {
    queryParams.category_id = [category_id]
  } else if (category_ids && category_ids.length > 0) {
    queryParams.category_id = category_ids
  }

  if (collection && collection.length > 0) {
    queryParams.collection_id = collection
  }

  if (type && type.length > 0) {
    queryParams.type_id = type
  }

  if (material && material.length > 0) {
    queryParams.material = material
  }

  if (price && price.length > 0) {
    price.forEach((range) => {
      switch (range) {
        case 'under-100':
          queryParams.price_to = '100'
          break
        case '100-500':
          queryParams.price_from = '100'
          queryParams.price_to = '500'
          break
        case '501-1000':
          queryParams.price_from = '501'
          queryParams.price_to = '1000'
          break
        case 'more-than-1000':
          queryParams.price_from = '1000'
          break
      }
    })
  }

  if (query) {
    queryParams.q = safeDecodeURIComponent(query)
  }

  const searchParams = new URLSearchParams({
    limit: PRODUCT_LIMIT.toString(),
    offset: queryParams.offset.toString(),
    order: queryParams.order,
    region_id: queryParams.region_id,
    fields:
      '*variants.calculated_price,+variants.inventory_quantity,*variants,*variants.prices',
  })

  if (queryParams.category_id) {
    queryParams.category_id.forEach((id: string) => {
      searchParams.append('category_id[]', id)
    })
  }

  if (queryParams.collection_id) {
    queryParams.collection_id.forEach((id: string) => {
      searchParams.append('collection_id[]', id)
    })
  }

  if (queryParams.type_id) {
    queryParams.type_id.forEach((id: string) => {
      searchParams.append('type_id[]', id)
    })
  }

  if (queryParams.material) {
    queryParams.material.forEach((mat: string) => {
      searchParams.append('material[]', mat)
    })
  }

  if (queryParams.price_from) {
    searchParams.append('price_from', queryParams.price_from)
  }

  if (queryParams.price_to) {
    searchParams.append('price_to', queryParams.price_to)
  }

  if (queryParams.q) {
    searchParams.append('q', queryParams.q)
  }

  const response = await fetch(
    `${BACKEND_URL}/store/products?${searchParams.toString()}`,
    {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY ?? '',
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Response error. Status: ${response.status}`)
  }

  const data = await response.json()
  const products = data.products ?? []
  const count = typeof data.count === 'number' ? data.count : products.length

  const results: SearchedProduct[] = products.map((product: any) => {
    const price = getProductPrice({ product })
    const sale_price = price.cheapestPrice?.calculated_price || ''
    const regular_price = price.cheapestPrice?.original_price || ''

    return {
      ...product,
      sale_price,
      regular_price,
    } as SearchedProduct
  })

  return {
    results,
    count,
  }
}
