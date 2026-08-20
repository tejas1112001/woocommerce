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

  // Important indexable static pages only (excluding utility/non-indexable pages like /thank-you)
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
    {
      url: `${baseUrl}/wholesale`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: now,
    },
  ]

  // Dynamic Product routes
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { response } = await getProductsList({
      countryCode: 'in',
      queryParams: { limit: 1000 },
    })
    if (response?.products) {
      productRoutes = response.products
        .filter((product) => isValidHandle(product.handle))
        .map((product) => ({
          url: `${baseUrl}/products/${product.handle!.trim()}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : now,
        }))
    }
  } catch (e) {
    console.error('Error generating product sitemap entries:', e)
  }

  // Dynamic Category routes
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const { product_categories } = await getCategoriesList()
    if (product_categories) {
      categoryRoutes = product_categories
        .filter((category) => isValidHandle(category.handle))
        .map((category) => ({
          url: `${baseUrl}/categories/${category.handle!.trim()}`,
          lastModified: category.updated_at
            ? new Date(category.updated_at)
            : now,
        }))
    }
  } catch (e) {
    console.error('Error generating category sitemap entries:', e)
  }

  // Dynamic Collection routes
  let collectionRoutes: MetadataRoute.Sitemap = []
  try {
    const { collections } = await getCollectionsList(100)
    if (collections) {
      collectionRoutes = collections
        .filter((collection) => isValidHandle(collection.handle))
        .map((collection) => ({
          url: `${baseUrl}/collections/${collection.handle!.trim()}`,
          lastModified: collection.updated_at
            ? new Date(collection.updated_at)
            : now,
        }))
    }
  } catch (e) {
    console.error('Error generating collection sitemap entries:', e)
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes]
}
