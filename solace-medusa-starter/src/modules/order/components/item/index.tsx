import { isDefaultVariantTitle } from '@lib/util/is-default-variant'
import { HttpTypes } from '@medusajs/types'
import { Text } from '@medusajs/ui'
import { Box } from '@modules/common/components/box'
import LineItemPrice from '@modules/common/components/line-item-price'
import Thumbnail from '@modules/products/components/thumbnail'

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
}

function getVariantOptions(
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
): string[] {
  const variant = (item as any).variant
  if (!variant?.options?.length) return []
  return variant.options
    .filter((opt: { option?: { title?: string }; value?: string }) => {
      const title = opt.option?.title?.toLowerCase().trim()
      const val = opt.value?.toLowerCase().trim()
      return title !== 'default option' && val !== 'default option value'
    })
    .map(
      (opt: { option?: { title?: string }; value?: string }) =>
        `${opt.option?.title ?? ''}: ${opt.value ?? ''}`
    )
}

const Item = ({ item }: ItemProps) => {
  const variantOptions = getVariantOptions(item)
  const variantTitle = item.variant_title

  return (
    <Box className="flex w-full bg-primary p-4" data-testid="product-row">
      <div className="flex h-[100px] w-[100px] flex-shrink-0">
        <Thumbnail
          thumbnail={(item as any).variant?.product?.thumbnail || (item as any).variant?.thumbnail || item.thumbnail}
          size="square"
        />
      </div>
      <Box className="flex flex-1 flex-col justify-between px-4">
        <Box>
          {item.product_collection && (
            <Text size="base" className="text-secondary">
              {item.product_collection}
            </Text>
          )}
          <Text className="font-medium" data-testid="product-name">
            {item.product_title}
          </Text>
          {/* Variant title */}
          {variantTitle && !isDefaultVariantTitle(variantTitle) && (
            <Text size="base" className="text-secondary">
              {variantTitle}
            </Text>
          )}
          {/* Individual variant options (size, color, etc.) */}
          {variantOptions.length > 0 && (
            <Box className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {variantOptions.map((opt, i) => (
                <Text key={i} size="base" className="text-secondary">
                  {opt}
                </Text>
              ))}
            </Box>
          )}
          <Text size="base" className="mt-1 text-secondary">
            Qty: {item.quantity}
          </Text>
        </Box>
        <LineItemPrice
          item={item}
          style="tight"
          className="mt-2 flex-col items-start gap-0 medium:hidden"
        />
      </Box>
      <Box className="hidden items-center justify-center medium:flex">
        <LineItemPrice
          item={item}
          style="tight"
          className="flex-col items-end gap-0"
        />
      </Box>
    </Box>
  )
}

export default Item
