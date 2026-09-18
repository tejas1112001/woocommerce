import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { enrichLineItems } from '@lib/data/cart'
import { getCustomer } from '@lib/data/customer'
import { listOrders } from '@lib/data/orders'
import Overview from '@modules/account/components/overview'
import { OrderType } from '@modules/account/components/order-overview'

export const metadata: Metadata = {
  title: 'My Account Dashboard',
  description: 'Overview of your account activity, recent orders, and shipping details at Swami Om Enterprises.',
}

export default async function OverviewTemplate() {
  // Run in parallel to avoid sequential waterfall
  const [customer, result] = await Promise.all([
    getCustomer().catch(() => null),
    listOrders(5, 0),
  ])

  if (!customer) {
    notFound()
  }

  let orders = result.orders ?? []
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
    <Overview
      customer={customer}
      orders={orders as unknown as OrderType[]}
      totalOrders={result.count ?? 0}
    />
  )
}
