import repeat from '@lib/util/repeat'
import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import Item from '@modules/order/components/item'
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item'

type ItemsProps = {
  items: HttpTypes.StoreCartLineItem[] | HttpTypes.StoreOrderLineItem[] | null
}

const Items = ({ items }: ItemsProps) => {
  return (
    <Box className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col">
      <Box className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/60 mb-1">
        <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
          Items in your order
        </h3>
        <span className="text-xs text-neutral-500 font-medium">
          {items?.length ?? 0} {items?.length === 1 ? 'item' : 'items'}
        </span>
      </Box>
      <Box className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800/80">
        {items?.length
          ? items
              .sort((a, b) => {
                return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
              })
              .map((item) => {
                return <Item key={item.id} item={item} />
              })
          : repeat(2).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </Box>
    </Box>
  )
}

export default Items
