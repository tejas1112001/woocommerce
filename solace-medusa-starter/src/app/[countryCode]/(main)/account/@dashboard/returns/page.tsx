import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAuthHeaders } from '@lib/data/cookies'
import { sdk } from '@lib/config'
import medusaError from '@lib/util/medusa-error'
import ReturnsOverview, {
  OrderWithReturns,
} from '@modules/account/components/returns-overview'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'View your return and refund requests.',
}

async function getOrdersWithReturns(): Promise<OrderWithReturns[]> {
  const authHeaders = await getAuthHeaders()
  return sdk.store.order
    .list(
      {
        limit: 50,
        offset: 0,
        fields: '+returns,+returns.items,+returns.items.reason,+refunds',
      },
      { next: { tags: ['order'] }, ...authHeaders }
    )
    .then(({ orders }) => orders as unknown as OrderWithReturns[])
    .catch((err) => {
      medusaError(err)
      return []
    })
}

export default async function ReturnsPage() {
  const orders = await getOrdersWithReturns().catch(() => null)

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="returns-page-wrapper">
      <ReturnsOverview orders={orders} />
    </div>
  )
}
