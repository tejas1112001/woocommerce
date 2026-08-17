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
      <Box className="flex flex-col gap-6">
        <Box className="flex items-center justify-between">
          <Heading as="h1" className="text-xl small:text-2xl font-bold">
            Order History
          </Heading>
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {totalCount} {totalCount === 1 ? 'order' : 'orders'} total
          </Text>
        </Box>
        <Box className="flex w-full flex-col gap-4">
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
      className="flex w-full flex-col items-center gap-6 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center shadow-xs"
      data-testid="no-orders-container"
    >
      <Box className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
        <BoxIcon className="w-8 h-8" />
      </Box>
      <Box className="flex flex-col items-center gap-2">
        <Heading as="h2" className="text-xl text-neutral-900 dark:text-white font-semibold">
          No orders yet
        </Heading>
        <Text className="max-w-[438px] text-center text-sm text-neutral-500 dark:text-neutral-400">
          You haven&apos;t placed any orders yet. Explore our shop and start shopping!
        </Text>
        <Button variant="filled" size="sm" asChild className="mt-3">
          <LocalizedClientLink href="/shop">Start shopping</LocalizedClientLink>
        </Button>
      </Box>
    </Box>
  )
}

export default OrderOverview

