'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { getLocalizedPath } from '@lib/util/urls'
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

  // Close dropdown when pathname changes (user navigates)
  useMemo(() => {
    setOpenDropdown(null)
  }, [pathname])

  return (
    <Box className="hidden items-center gap-1.5 self-stretch large:flex">
      {navigation.map((item: any, index: number) => {
        const handle = item.name.toLowerCase().replace(/\s+/g, '-')
        const itemLocalizedPath = getLocalizedPath(item.handle, countryCode)

        // Robust path matching
        const isShopRoute =
          (handle === 'shop' || item.handle === '/shop') &&
          (pathname.includes('/shop') ||
            pathname.includes('/categories') ||
            pathname.includes('/store'))

        const isCollectionRoute =
          (handle === 'collections' || item.handle === '/collections') &&
          pathname.includes('/collections')

        const isExactOrSubpath =
          item.handle !== '/shop' &&
          item.handle !== '/collections' &&
          (pathname.includes(itemLocalizedPath) || pathname.includes(item.handle))

        const isActive = isShopRoute || isCollectionRoute || isExactOrSubpath

        return (
          <DropdownMenu
            key={index}
            item={item}
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
                href={itemLocalizedPath}
                className={cn(
                  'group relative flex items-center rounded-xl !px-4 !py-2 text-[15px] font-semibold tracking-wide transition-all duration-200 outline-none',
                  isActive
                    ? 'bg-[#6B0014]/10 text-[#6B0014]'
                    : 'text-gray-800 hover:bg-gray-100/70 hover:text-[#6B0014]'
                )}
              >
                <span className="relative inline-flex items-center gap-1.5">
                  <span>{item.name}</span>

                  {/* Has dropdown indicator */}
                  {item.category_children && item.category_children.length > 0 && (
                    <svg
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        openDropdown?.name === item.name ? 'rotate-180 text-[#6B0014]' : 'text-gray-400 group-hover:text-[#6B0014]'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}

                  {/* Active gold underline indicator */}
                  <span
                    className={cn(
                      'absolute -bottom-2 left-0 h-[2.5px] w-full origin-left rounded-full bg-[#D4AF37] transition-transform duration-200 ease-out',
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:opacity-50'
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
