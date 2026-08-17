import { Box } from '@modules/common/components/box'
import { Text } from '@modules/common/components/text'

export default function ProductPrice({
  calculatedPrice,
  salePrice,
}: {
  calculatedPrice: string
  salePrice: string
}) {
  if (!calculatedPrice) {
    return null
  }

  const isOnSale = salePrice !== calculatedPrice

  return (
    <Box className="flex items-center flex-wrap gap-1.5 pt-0.5">
      <Text
        className="text-sm sm:text-base font-bold leading-none tracking-tight text-gray-900"
        as="span"
      >
        {calculatedPrice}
      </Text>
      {isOnSale && (
        <Text
          size="sm"
          className="text-xs font-medium text-gray-400 line-through"
          as="span"
        >
          {salePrice}
        </Text>
      )}
      {isOnSale && (
        <span className="inline-flex items-center rounded bg-red-50 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600 border border-red-100">
          Sale
        </span>
      )}
    </Box>
  )
}
