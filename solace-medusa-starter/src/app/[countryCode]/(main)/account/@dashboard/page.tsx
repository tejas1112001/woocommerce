import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

  return (
    <Overview
      customer={customer}
      orders={(result.orders ?? []) as unknown as OrderType[]}
      totalOrders={result.count ?? 0}
    />
  )
}
