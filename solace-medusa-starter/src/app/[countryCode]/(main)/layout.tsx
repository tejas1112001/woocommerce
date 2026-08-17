import React, { Suspense } from 'react'
import { Metadata } from 'next'

import { getBaseURL } from '@lib/util/env'
import Footer from '@modules/layout/templates/footer'
import NavWrapper from '@modules/layout/templates/nav'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/favicon.ico',
  },
}

export const dynamic = 'force-dynamic'

function NavSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-basic-primary bg-primary" style={{ height: '64px' }} />
  )
}

function FooterSkeleton() {
  return <div className="w-full border-t border-basic-primary bg-static" style={{ height: '200px' }} />
}

export default async function PageLayout(props: {
  params: Promise<{ countryCode: string }>
  children: React.ReactNode
}) {
  const { countryCode } = await props.params

  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <NavWrapper countryCode={countryCode} />
      </Suspense>
      {props.children}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer countryCode={countryCode} />
      </Suspense>
    </>
  )
}
