import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCustomer } from '@lib/data/customer'
import { getRegion } from '@lib/data/regions'
import AddressBook from '@modules/account/components/address-book'

export const metadata: Metadata = {
  title: 'Addresses',
  description: 'View your addresses',
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const [customer, region] = await Promise.all([
    getCustomer().catch(() => null),
    getRegion(countryCode).catch(() => null),
  ])

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
