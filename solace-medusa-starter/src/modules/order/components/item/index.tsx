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
    <Box className="flex w-full items-center justify-between py-3.5 gap-3" data-testid="product-row">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <Thumbnail
            thumbnail={(item as any).variant?.product?.thumbnail || (item as any).variant?.thumbnail || item.thumbnail}
            size="square"
          />
        </div>
        <Box className="flex flex-col min-w-0">
          {item.product_collection && (
            <Text className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate">
              {item.product_collection}
            </Text>
          )}
          <Text className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate" data-testid="product-name">
            {item.product_title}
          </Text>
          {/* Variant title */}
          {variantTitle && !isDefaultVariantTitle(variantTitle) && (
            <Text className="text-[11px] sm:text-xs text-neutral-500 truncate">
              {variantTitle}
            </Text>
          )}
          {/* Individual variant options (size, color, etc.) */}
          {variantOptions.length > 0 && (
            <Box className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
              {variantOptions.map((opt, i) => (
                <Text key={i} className="text-[11px] text-neutral-500">
                  {opt}
                </Text>
              ))}
            </Box>
          )}
          <Text className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-medium">
            Qty: {item.quantity}
          </Text>
        </Box>
      </div>

      <Box className="flex-shrink-0 text-right">
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
