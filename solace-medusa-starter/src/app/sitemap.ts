import { MetadataRoute } from 'next'
import { getCategoriesList } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'

export const dynamic = 'force-dynamic'

/**
 * Validates that a handle is real, non-empty, and not a route template/placeholder (e.g., [handle], [product-handle]).
 */
function isValidHandle(handle?: string | null): handle is string {
  if (!handle || typeof handle !== 'string') return false
  const trimmed = handle.trim()
  if (!trimmed) return false
  // Reject route parameter placeholders or bracketed strings
  if (trimmed.includes('[') || trimmed.includes(']') || trimmed.includes('{') || trimmed.includes('}')) {
    return false
  }
  return true
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL
  const baseUrl =
    envUrl && !envUrl.includes('localhost')
      ? envUrl.replace(/\/$/, '')
      : 'https://swamiomenterprises.in'

  const now = new Date()

  // 1. Static INDEX pages (5 pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
    },
  ]

  // Allowed Product Handles (3 pages)
  const allowedProductHandles = [
    'shree-swami-samarth-printed-tshirt',
    'shree-swami-samarth-topi',
    'swami-samarth-napkins',
  ]

  // Allowed Category Handles (2 pages)
  const allowedCategoryHandles = ['printed-t-shirt', 'idol-accessories']

  // Allowed Collection Handles (1 page)
  const allowedCollectionHandles = ['swami-samarth']

  // Product routes
  const productDateMap = new Map<string, Date>()
  try {
    const { response } = await getProductsList({
      countryCode: 'in',
      queryParams: { limit: 1000 },
    })
    if (response?.products) {
      for (const p of response.products) {
        if (p.handle && allowedProductHandles.includes(p.handle)) {
          productDateMap.set(
            p.handle,
            p.updated_at ? new Date(p.updated_at) : now
          )
        }
      }
    }
  } catch (e) {
    console.error('Error fetching product sitemap entries:', e)
  }

  const productRoutes: MetadataRoute.Sitemap = allowedProductHandles.map(
    (handle) => ({
      url: `${baseUrl}/products/${handle}`,
      lastModified: productDateMap.get(handle) || now,
    })
  )

  // Category routes
  const categoryDateMap = new Map<string, Date>()
  try {
    const { product_categories } = await getCategoriesList()
    if (product_categories) {
      for (const c of product_categories) {
        if (c.handle && allowedCategoryHandles.includes(c.handle)) {
          categoryDateMap.set(
            c.handle,
            c.updated_at ? new Date(c.updated_at) : now
          )
        }
      }
    }
  } catch (e) {
    console.error('Error fetching category sitemap entries:', e)
  }

  const categoryRoutes: MetadataRoute.Sitemap = allowedCategoryHandles.map(
    (handle) => ({
      url: `${baseUrl}/categories/${handle}`,
      lastModified: categoryDateMap.get(handle) || now,
    })
  )

  // Collection routes
  const collectionDateMap = new Map<string, Date>()
  try {
    const { collections } = await getCollectionsList(100)
    if (collections) {
      for (const col of collections) {
        if (col.handle && allowedCollectionHandles.includes(col.handle)) {
          collectionDateMap.set(
            col.handle,
            col.updated_at ? new Date(col.updated_at) : now
          )
        }
      }
    }
  } catch (e) {
    console.error('Error fetching collection sitemap entries:', e)
  }

  const collectionRoutes: MetadataRoute.Sitemap = allowedCollectionHandles.map(
    (handle) => ({
      url: `${baseUrl}/collections/${handle}`,
      lastModified: collectionDateMap.get(handle) || now,
    })
  )

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
  ]
}
