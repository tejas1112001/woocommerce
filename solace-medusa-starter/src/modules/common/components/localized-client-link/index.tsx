'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getLocalizedPath } from '@lib/util/urls'

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const { countryCode } = useParams()
  const localizedHref = getLocalizedPath(href, countryCode as string | undefined)

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
