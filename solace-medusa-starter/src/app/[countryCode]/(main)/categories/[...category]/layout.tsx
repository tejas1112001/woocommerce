import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCategoryByHandle, listCategories } from '@lib/data/categories'
import { listRegions } from '@lib/data/regions'
import { StoreProductCategory, StoreRegion } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import { JsonLd } from '@modules/common/components/json-ld'
import StoreBreadcrumbs from '@modules/store/templates/breadcrumbs'

interface CategoryPageLayoutProps {
  children: React.ReactNode
  params: Promise<{ category: string[] }>
}

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(
  props: CategoryPageLayoutProps
): Promise<Metadata> {
  const params = await props.params
  const { product_categories } = await getCategoryByHandle(params.category)

  if (!product_categories || product_categories.length === 0) {
    return {
      title: 'Category Not Found | Swami Om Enterprises',
      description: 'Category not found.',
    }
  }

  const lastCategory = product_categories[product_categories.length - 1]
  const categoryName = lastCategory.name

  const pageTitle = `Shree Swami Samarth ${categoryName} | Swami Om Enterprises`
  const canonicalUrl = `https://swamiomenterprises.in/categories/${params.category.join('/')}`

  const rawDescription =
    lastCategory.description ||
    `Browse Shree Swami Samarth ${categoryName} collection at Swami Om Enterprises.`
  const cleanDescription =
    rawDescription.replace(/\s+/g, ' ').slice(0, 120).trim() +
    ' Retail & bulk wholesale rates with Pan-India shipping.'

  return {
    title: pageTitle,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'Swami Om Enterprises',
      type: 'website',
      images: [
        {
          url: 'https://swamiomenterprises.in/logo/logo.png',
          alt: `Shree Swami Samarth ${categoryName} - Swami Om Enterprises`,
        },
      ],
    },
  }
}

export default async function CategoryPageLayout(
  props: CategoryPageLayoutProps
) {
  const params = await props.params
  const { category } = params
  const { children } = props

  const { product_categories } = await getCategoryByHandle(category)

  if (!product_categories || product_categories.length === 0) {
    notFound()
  }

  const currentCategory = product_categories[product_categories.length - 1]

  if (!currentCategory) {
    notFound()
  }

  const canonicalUrl = `https://swamiomenterprises.in/categories/${category.join('/')}`

  const categoryBreadcrumbSchema = {
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
        name: 'Categories',
        item: 'https://swamiomenterprises.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentCategory.name,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <>
      <JsonLd id="jsonld-category" data={categoryBreadcrumbSchema} />
      <Container className="flex flex-col gap-8 !py-8">
        <Box className="flex flex-col gap-4">
          <StoreBreadcrumbs breadcrumb={currentCategory.name} />
          <Heading
            as="h1"
            className="text-4xl font-extrabold text-basic-primary small:text-5xl"
          >
            {currentCategory.name}
          </Heading>
        </Box>
      </Container>
      {children}
    </>
  )
}

