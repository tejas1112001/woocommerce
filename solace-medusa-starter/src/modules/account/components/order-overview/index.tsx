import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BoxIcon } from '@modules/common/icons'
import { Pagination } from '@modules/store/components/pagination'
import { ORDERS_LIMIT } from 'app/[countryCode]/(main)/account/@dashboard/orders/page'

import OrderCard from '../order-card'

export interface OrderType extends HttpTypes.StoreOrder {
  status: string
}

const OrderOverview = ({
  orders,
  page,
  totalCount,
}: {
  orders: OrderType[]
  page: string | undefined
  totalCount: number
}) => {
  const totalPages = Math.ceil(totalCount / ORDERS_LIMIT)
  const pageNumber = page ? parseInt(page) : 1

  if (orders?.length) {
    return (
      <Box className="flex flex-col gap-4 small:gap-6">
        <Box className="flex items-center justify-between">
          <Heading as="h1" className="!text-lg small:!text-2xl !font-bold text-neutral-900 dark:text-white">
            Order History
          </Heading>
          <Text className="text-xs small:text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {totalCount} {totalCount === 1 ? 'order' : 'orders'} total
          </Text>
        </Box>
        <Box className="flex w-full flex-col gap-3 small:gap-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </Box>
        {totalPages > 1 && (
          <Pagination
            data-testid="orders-pagination"
            page={pageNumber}
            totalPages={totalPages}
          />
        )}
      </Box>
    )
  }

  return <NoOrders />
}

export function NoOrders() {
  return (
    <Box
      className="flex w-full flex-col items-center gap-4 small:gap-6 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 small:p-8 text-center shadow-xs"
      data-testid="no-orders-container"
    >
      <Box className="w-12 h-12 small:w-16 small:h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
        <BoxIcon className="w-6 h-6 small:w-8 small:h-8" />
      </Box>
      <Box className="flex flex-col items-center gap-1.5 small:gap-2">
        <Heading as="h2" className="!text-base small:!text-xl text-neutral-900 dark:text-white !font-bold">
          No orders yet
        </Heading>
        <Text className="max-w-[438px] text-center text-xs small:text-sm text-neutral-500 dark:text-neutral-400">
          You haven&apos;t placed any orders yet. Explore our shop and start shopping!
        </Text>
        <Button variant="filled" size="sm" asChild className="mt-2 small:mt-3">
          <LocalizedClientLink href="/shop">Start shopping</LocalizedClientLink>
        </Button>
      </Box>
    </Box>
  )
}

export default OrderOverview

