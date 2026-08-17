'use client'

import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useParams, usePathname } from 'next/navigation'

import { Popover, Transition } from '@headlessui/react'
import { signout } from '@lib/data/customer'
import AccountNavLink from '@modules/account/components/account-nav/account-nav-link'
import { profileNavItemsGroups } from '@modules/account/components/account-nav/consts'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import Divider from '@modules/common/components/divider'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { UserIcon } from '@modules/common/icons'

const ProfileDropdown = ({ loggedIn }: { loggedIn: boolean }) => {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)
  const toggle = () => setCartDropdownOpen((prev) => !prev)

  const { countryCode } = useParams()
  const pathname = usePathname()

  // Close dropdown on pathname change
  useEffect(() => {
    close()
  }, [pathname])

  // Close dropdown on outside click / tap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close()
      }
    }

    if (cartDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [cartDropdownOpen])

  const handleLogout = async () => {
    close()
    await signout(countryCode as string)
  }

  return (
    <div
      ref={containerRef}
      className="z-50 h-full relative"
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <Popover className="relative flex h-full items-center">
        <Popover.Button
          onClick={(e) => {
            e.preventDefault()
            toggle()
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-action-primary outline-none transition-colors hover:bg-fg-secondary-hover hover:text-action-primary-hover active:bg-fg-secondary-pressed active:text-action-primary-pressed"
          data-testid="profile-dropdown-button"
        >
          <UserIcon className="h-6 w-6 text-basic-primary" />
        </Popover.Button>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="absolute -right-2 top-[calc(100%+8px)] w-[260px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl text-neutral-900 dark:text-white overflow-hidden p-1.5"
            data-testid={`${loggedIn ? 'profile-dropdown-logged-in' : 'profile-dropdown-logged-out'}`}
          >
            {loggedIn ? (
              profileNavItemsGroups.map((group, groupIndex) => (
                <Fragment key={groupIndex}>
                  <ul className="flex flex-col gap-0.5">
                    {group.map((item) => (
                      <li key={item.href || item.type}>
                        {item.type === 'logout' ? (
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                          >
                            <span className="flex items-center justify-center text-red-500">
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </button>
                        ) : (
                          <AccountNavLink
                            href={item.href}
                            icon={item.icon}
                            onClick={close}
                          >
                            {item.label}
                          </AccountNavLink>
                        )}
                      </li>
                    ))}
                  </ul>
                  {groupIndex < profileNavItemsGroups.length - 1 && (
                    <div className="my-1.5 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80" />
                  )}
                </Fragment>
              ))
            ) : (
              <>
                <Box
                  className="flex flex-col gap-2 p-2"
                  data-testid="profile-dropdown-sign-in-up"
                >
                  <Button size="sm" asChild onClick={close}>
                    <LocalizedClientLink href="/account?mode=sign-in">
                      Sign in
                    </LocalizedClientLink>
                  </Button>
                  <Button size="sm" asChild variant="tonal" onClick={close}>
                    <LocalizedClientLink href="/account?mode=register">
                      Sign up
                    </LocalizedClientLink>
                  </Button>
                </Box>
              </>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default ProfileDropdown
