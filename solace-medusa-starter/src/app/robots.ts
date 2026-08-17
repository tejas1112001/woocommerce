import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/account/*',
          '/order/*',
          '/reset-password',
          '/results',
          '/*?sort=',
          '/*?ref=',
        ],
      },
    ],
    sitemap: 'https://swamiomenterprises.in/sitemap.xml',
    host: 'https://swamiomenterprises.in',
  }
}
