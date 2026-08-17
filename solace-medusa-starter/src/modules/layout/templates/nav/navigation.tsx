'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { NavigationItem } from '@modules/common/components/navigation-item'
import DropdownMenu from './dropdown-menu'

export default function Navigation({
  countryCode,
  productCategories,
  collections,
}: {
  countryCode: string
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<{
    name: string
    handle: string
  } | null>(null)

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  return (
    <Box className="hidden items-center gap-2 self-stretch large:flex">
      {navigation.map((item: any, index: number) => {
        const handle = item.name.toLowerCase().replace(/\s+/g, '-')
        const isCategories =
          handle === 'shop' && pathname.includes(`/${countryCode}/categories`)
        const active =
          item.handle !== '/shop' &&
          pathname.includes(`/${countryCode}${item.handle}`)

        const isActive = active || isCategories

        return (
          <DropdownMenu
            key={index}
            item={item}
            // FIX: activeItem now accepts null (was typed as non-nullable causing potential crash)
            activeItem={openDropdown}
            isOpen={openDropdown?.name === item.name}
            onOpenChange={(open) => {
              setOpenDropdown(
                open ? { name: item.name, handle: item.handle } : null
              )
            }}
            customContent={undefined}
          >
            <div
              className="flex h-full items-center"
              data-testid={formatNameForTestId(`${item.name}-dropdown`)}
            >
              <NavigationItem
                href={`/${countryCode}${item.handle}`}
                className={cn(
                  'relative !px-5 !py-2.5 text-[15px] large:text-base font-semibold tracking-wide transition-colors duration-150',
                  isActive
                    ? 'text-action-primary'
                    : 'text-basic-primary hover:text-action-primary'
                )}
              >
                <span className="relative inline-block">
                  {item.name}
                  {/* Active underline indicator with smooth scale-in from left */}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-[2.5px] w-full origin-left rounded-full bg-action-primary transition-transform duration-200 ease-out',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </span>
              </NavigationItem>
            </div>
          </DropdownMenu>
        )
      })}
    </Box>
  )
}
