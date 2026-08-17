import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCustomer } from '@lib/data/customer'
import { listRegions } from '@lib/data/regions'
import ProfileDetails from '@modules/account/components/profile-details'
import Divider from '@modules/common/components/divider'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and edit your Tejas profile.',
}

export default async function Profile() {
  const [customer, regions] = await Promise.all([
    getCustomer().catch(() => null),
    listRegions().catch(() => null),
  ])

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div
      className="xl:ml-auto xl:max-w-[900px]"
      data-testid="profile-page-wrapper"
    >
      <ProfileDetails customer={customer} />
      <Divider className="mt-6" />
    </div>
  )
}
