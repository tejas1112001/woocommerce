import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProductByHandle, getProductsList } from '@lib/data/products'
import { getRegion, listRegions } from '@lib/data/regions'
import { JsonLd } from '@modules/common/components/json-ld'
import ProductTemplate from '@modules/products/templates'

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )

    if (!countryCodes) {
      return []
    }

    const products = await Promise.all(
      countryCodes.map((countryCode) => {
        return getProductsList({ countryCode })
      })
    ).then((responses) =>
      responses.map(({ response }) => response.products).flat()
    )

    const staticParams = countryCodes
      ?.map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error('Skipping static generation:', error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params

  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)
  if (!product) {
    notFound()
  }

  const siteSuffix = 'Swami Om Enterprises'
  let pageTitle = `${product.title} | ${siteSuffix}`
  if (pageTitle.length > 60) {
    // Shorten title smartly if exceeds 60 characters
    pageTitle = `${product.title.slice(0, 36).trim()}... | ${siteSuffix}`
  }

  const rawDescription = product.description || product.title
  const cleanDescription =
    rawDescription.replace(/\s+/g, ' ').slice(0, 140).trim() +
    '. Buy online from Swami Om Enterprises with shipping across India.'

  const canonicalUrl = `https://swamiomenterprises.in/products/${handle}`

  return {
    title: pageTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.title} | Swami Om Enterprises`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'Swami Om Enterprises',
      type: 'article',
      images: product.thumbnail
        ? [
            {
              url: product.thumbnail.startsWith('http')
                ? product.thumbnail
                : `https://swamiomenterprises.in${product.thumbnail}`,
              alt: `${product.title} | Shree Swami Samarth Devotional Product`,
            },
          ]
        : [
            {
              url: 'https://swamiomenterprises.in/logo/logo.png',
              alt: 'Swami Om Enterprises',
            },
          ],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id)

  if (!pricedProduct) {
    notFound()
  }

  const canonicalUrl = `https://swamiomenterprises.in/products/${params.handle}`

  // Product JSON-LD Schema
  const cheapestVariant = pricedProduct.variants?.reduce(
    (min, variant) => {
      const price = variant.calculated_price?.calculated_amount
      return price && (!min || price < min) ? price : min
    },
    null as number | null
  )

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pricedProduct.title,
    description: pricedProduct.description || pricedProduct.title,
    image: pricedProduct.images?.map((img) => img.url) || [
      pricedProduct.thumbnail,
    ],
    sku: pricedProduct.id,
    brand: {
      '@type': 'Brand',
      name: 'Swami Om Enterprises',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: region.currency_code?.toUpperCase() || 'INR',
      price: cheapestVariant || '0',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Swami Om Enterprises',
      },
    },
  }

  const breadcrumbSchema = {
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
        name: 'Shop',
        item: 'https://swamiomenterprises.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pricedProduct.title,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <>
      <JsonLd id="jsonld-product" data={[productSchema, breadcrumbSchema]} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
      />
    </>
  )
}

