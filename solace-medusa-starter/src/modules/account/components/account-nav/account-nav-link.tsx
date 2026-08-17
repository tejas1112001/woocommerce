'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@lib/util/cn'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type AccountNavLinkProps = {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
  'data-testid'?: string
  onClick?: () => void
  className?: string
}

const AccountNavLink = ({
  href,
  children,
  icon,
  'data-testid': dataTestId,
  onClick,
  className,
}: AccountNavLinkProps) => {
  const route = usePathname()
  // Active check: exact match for /account or startsWith for subpages
  const active =
    href === '/account'
      ? route.endsWith('/account')
      : href !== '' && href !== '#' && route.includes(href)

  return (
    <LocalizedClientLink
      href={href}
      data-testid={dataTestId}
      className="block"
      onClick={onClick}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out',
          active
            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-900 dark:hover:text-white',
          className
        )}
      >
        <span
          className={cn(
            'flex items-center justify-center transition-colors',
            active
              ? 'text-white dark:text-neutral-900'
              : 'text-neutral-500 dark:text-neutral-400'
          )}
        >
          {icon}
        </span>
        <span className="truncate">{children}</span>
      </div>
    </LocalizedClientLink>
  )
}

export default AccountNavLink

