import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAllCollectionsWithProducts } from '@lib/data/collections'
import { getRegion } from '@lib/data/regions'
import { getProductPrice } from '@lib/util/get-product-price'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import CollectionCarousel from '@modules/collections/components/collection-carousel'

export const metadata: Metadata = {
  title: 'Collections | Tejas',
  description: 'Browse all our curated collections.',
}

export const dynamic = 'force-dynamic'

export default async function CollectionsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) return notFound()

  const allCollections = await getAllCollectionsWithProducts(countryCode)

  // Filter out collections that have no products
  const collections = allCollections?.filter((collection) => {
    const products = (collection as any).products ?? []
    return products.length > 0
  }) ?? []

  if (!collections || collections.length === 0) {
    return (
      <Container className="flex flex-col gap-8 !py-12">
        <Heading as="h1" className="text-4xl font-semibold text-basic-primary small:text-5xl">
          Collections
        </Heading>
        <Text size="md" className="py-10 text-center text-secondary">
          No collections found.
        </Text>
      </Container>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {/* One section per collection - only showing collections with products */}
      {collections.map((collection, index) => {
        const products = (collection as any).products ?? []

        return (
          <section
            key={collection.id}
            className={index > 0 ? 'border-t border-basic-primary' : ''}
          >
            <CollectionCarousel
              collection={{
                id: collection.id,
                title: collection.title,
                handle: collection.handle,
                description: (collection as any).description ?? null,
              }}
              products={products.map((p: any) => {
                const cheapestVariant = getProductPrice({ product: p })
                return {
                  id: p.id,
                  created_at: p.created_at,
                  title: p.title,
                  handle: p.handle,
                  thumbnail: p.thumbnail,
                  calculatedPrice: cheapestVariant.cheapestPrice?.calculated_price ?? '',
                  salePrice: cheapestVariant.cheapestPrice?.original_price ?? '',
                }
              })}
              regionId={region.id}
            />
          </section>
        )
      })}
    </div>
  )
}
