import { Metadata } from 'next'

interface StorePageLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Shop - All products',
  description: 'Explore all of our products.',
}

export default function StorePageLayout({ children }: StorePageLayoutProps) {
  return <>{children}</>
}
