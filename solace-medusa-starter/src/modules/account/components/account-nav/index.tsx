'use client'

import React, { Fragment } from 'react'
import { useParams } from 'next/navigation'

import { signout } from '@lib/data/customer'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { Button } from '@modules/common/components/button'

import AccountNavLink from './account-nav-link'
import { profileNavItemsGroups } from './consts'

const AccountNav = () => {
  const { countryCode } = useParams()

  const handleLogout = async () => {
    await signout(countryCode as string)
  }

  return (
    <div className="w-full bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xs">
      <nav className="flex flex-col gap-1">
        {profileNavItemsGroups.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            <ul className="flex flex-col gap-1">
              {group.map((item) => (
                <li
                  key={item.href || item.type}
                  data-testid={formatNameForTestId(`${item.label}-nav-item`)}
                >
                  {item.type === 'logout' ? (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center text-red-500">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Button>
                  ) : (
                    <AccountNavLink href={item.href} icon={item.icon}>
                      {item.label}
                    </AccountNavLink>
                  )}
                </li>
              ))}
            </ul>
            {groupIndex < profileNavItemsGroups.length - 1 && (
              <div className="my-2 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80" />
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  )
}

export default AccountNav

