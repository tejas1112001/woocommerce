import { Metadata } from 'next'

import WishlistPage from '@modules/account/components/wishlist'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'View and manage your saved items.',
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Wishlist(props: Props) {
  const params = await props.params
  const { countryCode } = params

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <WishlistPage countryCode={countryCode} />
    </div>
  )
}
