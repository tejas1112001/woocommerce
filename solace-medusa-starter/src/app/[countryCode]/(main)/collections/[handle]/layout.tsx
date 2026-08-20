import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getCollectionByHandle,
  getCollectionsList,
} from '@lib/data/collections'
import { listRegions } from '@lib/data/regions'
import { StoreCollection, StoreRegion } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import { JsonLd } from '@modules/common/components/json-ld'
import StoreBreadcrumbs from '@modules/store/templates/breadcrumbs'

interface CollectionPageLayoutProps {
  children: React.ReactNode
  params: Promise<{ handle: string; countryCode: string }>
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const { collections } = await getCollectionsList()

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(
  props: CollectionPageLayoutProps
): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const pageTitle = `${collection.title} | Shree Swami Samarth Devotional Store`
  const canonicalUrl = `https://swamiomenterprises.in/collections/${params.handle}`
  const description = `Explore ${collection.title} featuring Shree Swami Samarth devotional products from Akkalkot, Solapur. Wholesale and retail orders available.`

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: 'Swami Om Enterprises',
      type: 'website',
      images: [
        {
          url: 'https://swamiomenterprises.in/og_image/og-image.png',
          width: 1200,
          height: 630,
          alt: `${collection.title} - Swami Om Enterprises`,
        },
      ],
    },
  }
}

export default async function CollectionPageLayout(
  props: CollectionPageLayoutProps
) {
  const params = await props.params
  const { handle } = params
  const { children } = props

  const currentCollection = await getCollectionByHandle(handle)

  if (!currentCollection) {
    notFound()
  }

  const canonicalUrl = `https://swamiomenterprises.in/collections/${handle}`

  const collectionBreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://swamiomenterprises.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: 'https://swamiomenterprises.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentCollection.title,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <>
      <JsonLd id="jsonld-collection" data={collectionBreadcrumbSchema} />
      <Container className="flex flex-col gap-8 !py-8">
        <Box className="flex flex-col gap-4">
          <StoreBreadcrumbs breadcrumb={currentCollection.title} />
          <Heading
            as="h1"
            className="text-4xl font-extrabold text-basic-primary small:text-5xl"
          >
            {currentCollection.title}
          </Heading>
        </Box>
      </Container>
      {children}
    </>
  )
}

