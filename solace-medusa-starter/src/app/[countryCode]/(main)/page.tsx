import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getRegion } from '@lib/data/regions'
import { Container } from '@modules/common/components/container'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import { HeroSection, WhyChooseUs, CustomerReviews, AkkalkotStore } from '@modules/home/components'

export const metadata: Metadata = {
  title: 'Shree Swami Samarth Products | Swami Om Enterprises',
  description:
    'Shop authentic Shree Swami Samarth devotional products from Akkalkot. Kurtas, dhotis, shawls, T-shirts, topis and frames. Wholesale and retail Pan-India.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/',
  },
  openGraph: {
    title: 'Shree Swami Samarth Devotional Products | Swami Om Enterprises',
    description:
      'Bring home the blessings of Akkalkot Maharaj. Shop printed kurtas, dhotis, shawls, T-shirts, topis and metal frames. Delivery across India.',
    url: 'https://swamiomenterprises.in/',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/og_image/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swami Om Enterprises | Shree Swami Samarth Devotional Products Akkalkot',
      },
    ],
  },
}

export const dynamic = 'force-dynamic'

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return notFound()
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { results, count } = await search({
    currency_code: region.currency_code,
    region_id: region.id,
    page,
  })

  return (
    <>
      <HeroSection />
      <section
        id="product-catalog"
        aria-label="Our Shree Swami Samarth Devotional Product Catalog"
        className="relative py-10 sm:py-14 bg-gradient-to-b from-white via-amber-50/20 to-white"
      >
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2.5">
            <span className="inline-flex items-center gap-1.5 text-orange-950 text-xs font-bold tracking-wide px-3.5 py-1.5 bg-white/95 rounded-full shadow-xs border border-amber-300/80 backdrop-blur-md">
              <span className="text-amber-500 font-semibold text-xs">✦</span>
              अक्कलकोट स्वामी उत्पादने
              <span className="text-amber-500 font-semibold text-xs">✦</span>
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
                Devotional Catalog
              </span>
            </h2>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Authentic Shree Swami Samarth kurtas, dhotis, shawls, T-shirts, frames, topis and devotional accessories direct from Akkalkot.
            </p>
          </div>

          <Suspense fallback={<SkeletonProductGrid />}>
            {results && results.length > 0 ? (
              <PaginatedProducts
                products={results}
                page={page}
                total={count}
                countryCode={countryCode}
              />
            ) : (
              <p className="py-10 text-center text-lg text-secondary">
                No products found.
              </p>
            )}
          </Suspense>
        </div>
      </section>
      <WhyChooseUs />
      <CustomerReviews />
      <AkkalkotStore />
    </>
  )
}
