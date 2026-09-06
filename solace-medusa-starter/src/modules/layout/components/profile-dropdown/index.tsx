'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'

import { Popover, Transition } from '@headlessui/react'
import { signout } from '@lib/data/customer'
import { cn } from '@lib/util/cn'
import AccountNavLink from '@modules/account/components/account-nav/account-nav-link'
import { profileNavItemsGroups } from '@modules/account/components/account-nav/consts'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { UserIcon } from '@modules/common/icons'

const ProfileDropdown = ({ loggedIn }: { loggedIn: boolean }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'sign-in' | 'register'>('sign-in')
  const containerRef = useRef<HTMLDivElement>(null)

  const open = () => setDropdownOpen(true)
  const close = () => setDropdownOpen(false)
  const toggle = () => setDropdownOpen((prev) => !prev)

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

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [dropdownOpen])

  // Escape key handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropdownOpen) {
        close()
      }
    },
    [dropdownOpen]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-full bg-transparent outline-none transition-colors duration-200',
            dropdownOpen
              ? 'bg-[#6B0014]/10 text-[#6B0014]'
              : 'text-action-primary hover:bg-gray-100 hover:text-action-primary-hover'
          )}
          data-testid="profile-dropdown-button"
          aria-label="Account menu"
          aria-expanded={dropdownOpen}
        >
          <UserIcon className="h-6 w-6 text-gray-800" />
        </Popover.Button>

        <Transition
          show={dropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-2 scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-0 translate-y-1 scale-95"
        >
          <Popover.Panel
            static
            className="absolute -right-2 top-[calc(100%+8px)] w-[300px] rounded-2xl border border-gray-200/80 bg-white shadow-2xl overflow-hidden p-2 text-gray-900 z-50"
            data-testid={`${loggedIn ? 'profile-dropdown-logged-in' : 'profile-dropdown-logged-out'}`}
          >
            {loggedIn ? (
              /* ── Logged In Dropdown ── */
              <div className="p-1 space-y-2">
                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#6B0014]/10 via-[#D4AF37]/15 to-transparent p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B0014] text-[#D4AF37] shadow-sm">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Signed In
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900">
                      My Account
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {profileNavItemsGroups.map((group, groupIndex) => (
                    <Fragment key={groupIndex}>
                      <ul className="flex flex-col gap-0.5">
                        {group.map((item) => (
                          <li key={item.href || item.type}>
                            {item.type === 'logout' ? (
                              <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-150"
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
                        <div className="my-1 h-px w-full bg-gray-100" />
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Logged Out View with Login/Register Tab Toggle ── */
              <Box
                className="flex flex-col gap-3 p-2"
                data-testid="profile-dropdown-sign-in-up"
              >
                {/* Segmented Tab Bar */}
                <div className="relative flex rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('sign-in')}
                    className={cn(
                      'relative z-10 flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all duration-200',
                      activeTab === 'sign-in'
                        ? 'bg-white text-[#6B0014] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className={cn(
                      'relative z-10 flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition-all duration-200',
                      activeTab === 'register'
                        ? 'bg-white text-[#6B0014] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Register
                  </button>
                </div>

                {/* Tab Content Panels */}
                {activeTab === 'sign-in' ? (
                  <div className="space-y-3 p-1 animate-fadeIn">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Welcome Back
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                        Access your orders, track shipments, and manage saved items.
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        <span>Saved addresses & fast checkout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        <span>Order tracking & history</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full rounded-xl bg-[#6B0014] text-white hover:bg-[#50000f] font-semibold py-2.5 shadow-sm transition-all"
                      asChild
                    >
                      <LocalizedClientLink href="/account?mode=sign-in" onClick={close}>
                        Sign In to Account
                      </LocalizedClientLink>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 p-1 animate-fadeIn">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        Create an Account
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                        Join us for exclusive member perks and faster checkout.
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        <span>Exclusive member offers & drops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        <span>Manage returns & order history</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="tonal"
                      className="w-full rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 text-[#6B0014] hover:bg-[#D4AF37]/20 font-semibold py-2.5 transition-all"
                      asChild
                    >
                      <LocalizedClientLink href="/account?mode=register" onClick={close}>
                        Create New Account
                      </LocalizedClientLink>
                    </Button>
                  </div>
                )}
              </Box>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default ProfileDropdown
