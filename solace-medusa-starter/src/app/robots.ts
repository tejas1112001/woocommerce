import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL
  const baseUrl =
    envUrl && !envUrl.includes('localhost')
      ? envUrl.replace(/\/$/, '')
      : 'https://swamiomenterprises.in'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/cart',
          '/checkout',
          '/account/',
          '/order/',
          '/reset-password',
          '/results',
          '/api/',
          '/thank-you',
          '/*?sort=',
          '/*?ref=',
          '/*sessionid=',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
