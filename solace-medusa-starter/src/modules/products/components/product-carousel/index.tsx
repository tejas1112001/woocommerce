import { getProductPrice } from '@lib/util/get-product-price'
import { StoreProduct } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

import { ProductTile } from '../product-tile'
import CarouselWrapper from './carousel-wrapper'

interface ViewAllProps {
  link: string
  text?: string
}

interface ProductCarouselProps {
  products: StoreProduct[]
  regionId: string
  title: string
  viewAll?: ViewAllProps
  testId?: string
}

export function ProductCarousel({
  products,
  regionId,
  title,
  viewAll,
  testId,
}: ProductCarouselProps) {
  return (
    <Container className="overflow-hidden" data-testid={testId}>
      <Box className="flex flex-col gap-6 small:gap-12">
        <CarouselWrapper title={title} productsCount={products.length}>
          <Box className="flex gap-2.5 sm:gap-3.5">
            {products.map((item, index) => {
              const cheapestVariant = getProductPrice({
                product: item,
              })

              return (
                <Box
                  className="flex-[0_0_calc(50%-5px)] sm:flex-[0_0_calc(33.333%-8px)] md:flex-[0_0_calc(25%-9px)] xl:flex-[0_0_calc(20%-9.6px)] 2xl:flex-[0_0_calc(16.666%-10px)] flex flex-col h-full"
                  key={index}
                >
                  <ProductTile
                    product={{
                      id: item.id,
                      created_at: item.created_at,
                      title: item.title,
                      handle: item.handle,
                      thumbnail: item.thumbnail,
                      calculatedPrice:
                        cheapestVariant.cheapestPrice?.calculated_price ?? '',
                      salePrice:
                        cheapestVariant.cheapestPrice?.original_price ?? '',
                      variantCount: item.variants?.length ?? 1,
                    }}
                    regionId={regionId}
                  />
                </Box>
              )
            })}
          </Box>
        </CarouselWrapper>
        {viewAll && (
          <Button asChild>
            <LocalizedClientLink
              href={viewAll.link}
              className="mx-auto w-max !px-5 !py-3"
            >
              {viewAll.text || 'View all'}
            </LocalizedClientLink>
          </Button>
        )}
      </Box>
    </Container>
  )
}
