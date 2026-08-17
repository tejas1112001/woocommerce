import { Metadata } from 'next'

import { enrichLineItems } from '@lib/data/cart'
import { listOrders } from '@lib/data/orders'
import OrderOverview, {
  OrderType,
} from '@modules/account/components/order-overview'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Overview of your previous orders.',
}

type Props = {
  searchParams: Promise<{
    page?: string
  }>
}

export const ORDERS_LIMIT = 5

export default async function Orders(props: Props) {
  const searchParams = await props.searchParams
  const { page } = searchParams
  const currentPage = page ? parseInt(page) : 1

  const result = await listOrders(
    ORDERS_LIMIT,
    (currentPage - 1) * ORDERS_LIMIT
  )

  let { orders, count } = result

  if (orders && orders.length > 0) {
    orders = await Promise.all(
      orders.map(async (order) => {
        if (order.items && order.items.length > 0 && order.region_id) {
          const enrichedItems = await enrichLineItems(order.items, order.region_id)
          return { ...order, items: enrichedItems } as any
        }
        return order
      })
    )
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <OrderOverview
        orders={orders as unknown as OrderType[]}
        page={page}
        totalCount={count ?? 0}
      />
    </div>
  )
}
