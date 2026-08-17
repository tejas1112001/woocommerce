import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getRegion } from '@lib/data/regions'
import { Container } from '@modules/common/components/container'
import { search } from '@modules/search/actions'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import PaginatedProducts from '@modules/store/templates/paginated-products'
import HeroSection from '@modules/home/components/hero-section'

export const metadata: Metadata = {
  title: 'Shree Swami Samarth Products | Swami Om Enterprises',
  description:
    'Shop authentic Shree Swami Samarth devotional products from Akkalkot. Kurtas, dhotis, shawls, T-shirts, topis & frames. Wholesale & retail Pan-India.',
  alternates: {
    canonical: 'https://swamiomenterprises.in/',
  },
  openGraph: {
    title: 'Shree Swami Samarth Devotional Products | Swami Om Enterprises',
    description:
      'Bring home the blessings of Akkalkot Maharaj. Shop printed kurtas, dhotis, shawls, T-shirts, topis & metal frames. Delivery across India.',
    url: 'https://swamiomenterprises.in/',
    siteName: 'Swami Om Enterprises',
    type: 'website',
    images: [
      {
        url: 'https://swamiomenterprises.in/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Swami Om Enterprises - Shree Swami Samarth Devotional Products Akkalkot',
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
      <Container className="flex flex-col gap-6 !pb-8 !pt-6">
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
              No products.
            </p>
          )}
        </Suspense>
      </Container>
    </>
  )
}
