import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <Box className="flex flex-col gap-y-3">
      <Box className="flex flex-col gap-y-2" id="product-info">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="w-max text-xs font-semibold uppercase tracking-widest text-secondary transition-colors hover:text-basic-primary"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          as="h1"
          className="text-3xl font-bold leading-tight tracking-tight text-basic-primary small:text-4xl"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
      </Box>
    </Box>
  )
}

export default ProductInfo
