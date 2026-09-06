import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCustomer } from '@lib/data/customer'
import { getLocalizedPath } from '@lib/util/urls'
import AccountLayout from '@modules/account/templates/account-layout'

export async function generateMetadata(): Promise<Metadata> {
  const customer = await getCustomer().catch(() => null)

  if (customer) {
    return {
      title: 'My Account Dashboard',
      description:
        'Manage your Swami Om Enterprises account, view order history, update shipping details, and edit profile settings.',
    }
  }

  return {
    title: 'Customer Sign In & Account Registration',
    description:
      'Sign in or register a new account with Swami Om Enterprises to track orders, manage addresses, and access exclusive devotional products.',
  }
}

export default async function AccountPageLayout(props: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  params: Promise<{ countryCode: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { dashboard, login } = props
  const [customer, params, searchParams] = await Promise.all([
    getCustomer().catch(() => null),
    props.params,
    props.searchParams,
  ])

  const { countryCode } = params
  const rawRedirectTo = searchParams?.redirectTo
  const redirectTo =
    typeof rawRedirectTo === 'string'
      ? rawRedirectTo
      : Array.isArray(rawRedirectTo)
      ? rawRedirectTo[0]
      : null

  if (customer && redirectTo) {
    redirect(getLocalizedPath(decodeURIComponent(redirectTo), countryCode))
  }

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}
