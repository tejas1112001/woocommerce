import { MetadataRoute } from 'next'
import { getCategoriesList } from '@lib/data/categories'
import { getProductsList } from '@lib/data/products'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://swamiomenterprises.in'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic Product routes
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const { response } = await getProductsList({ countryCode: 'in' })
    if (response?.products) {
      productRoutes = response.products.map((product) => ({
        url: `${baseUrl}/products/${product.handle}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
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
      categoryRoutes = product_categories.map((category) => ({
        url: `${baseUrl}/categories/${category.handle}`,
        lastModified: category.updated_at
          ? new Date(category.updated_at)
          : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (e) {
    console.error('Error generating category sitemap entries:', e)
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
