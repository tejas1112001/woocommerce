'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@modules/common/components/dialog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import {
  ArrowLeftIcon,
  BagIcon,
  BarsIcon,
  ChevronRightIcon,
  TejasLogo,
  UserIcon,
  XIcon,
} from '@modules/common/icons'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface CategoryItem {
  name: string
  handle: string
}

const SideMenu = ({
  productCategories,
  collections,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) => {
  const pathname = usePathname()
  const [categoryStack, setCategoryStack] = useState<CategoryItem[]>([])
  const currentCategory = categoryStack[categoryStack.length - 1] || null
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mobile-menu-open')
    } else {
      document.body.classList.remove('mobile-menu-open')
    }
    return () => document.body.classList.remove('mobile-menu-open')
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setCategoryStack([])
  }, [pathname])

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  const handleCategoryClick = (category: CategoryItem) => {
    setCategoryStack([
      ...categoryStack,
      { name: category.name, handle: category.handle },
    ])
  }

  const handleBack = () => {
    setCategoryStack(categoryStack.slice(0, -1))
  }

  const handleOpenDialogChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setCategoryStack([])
    }
  }

  const getActiveCategories = () => {
    let currentCategories = [
      ...(navigation[0]?.category_children || []),
      ...navigation.slice(1),
    ]

    for (const category of categoryStack) {
      const found = currentCategories.find(
        (item) => item.name === category.name
      )
      if (found?.category_children) {
        currentCategories = found.category_children.map((category) => ({
          ...category,
          icon: null,
        }))
      } else {
        break
      }
    }
    return currentCategories
  }

  const renderCategories = (categories: any[]) => {
    return categories.map((item, index) => {
      const hasChildren =
        item.category_children && item.category_children.length > 0

      // Active route matching
      const isActive =
        item.handle && item.handle !== '/' && item.handle !== '/shop'
          ? pathname.includes(item.handle)
          : false

      return (
        <Fragment key={index}>
          {hasChildren ? (
            <button
              type="button"
              className={cn(
                'group flex w-full items-center justify-between rounded-xl p-3.5 text-left transition-all duration-150',
                isActive
                  ? 'bg-[#6B0014]/10 text-[#6B0014] font-bold border-l-3 border-[#D4AF37]'
                  : 'bg-white text-gray-800 hover:bg-gray-100/80 hover:text-gray-900 border border-gray-100 shadow-2xs'
              )}
              onClick={() =>
                handleCategoryClick({
                  name: item.name,
                  handle: item.handle,
                })
              }
              data-testid={formatNameForTestId(`mobile-menu-${item.name}`)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && <span className="text-[#6B0014]">{item.icon}</span>}
                <span className="truncate text-base font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-gray-400 group-hover:text-[#6B0014]">
                <span className="text-xs font-semibold text-gray-400">
                  {item.category_children.length}
                </span>
                <ChevronRightIcon className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
            </button>
          ) : (
            <LocalizedClientLink
              href={item.handle}
              onClick={() => handleOpenDialogChange(false)}
              className={cn(
                'group flex w-full items-center justify-between rounded-xl p-3.5 text-left transition-all duration-150',
                isActive
                  ? 'bg-[#6B0014]/10 text-[#6B0014] font-bold border-l-3 border-[#D4AF37]'
                  : 'bg-white text-gray-800 hover:bg-gray-100/80 hover:text-gray-900 border border-gray-100 shadow-2xs'
              )}
              data-testid={formatNameForTestId(`mobile-menu-${item.name}`)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && <span className="text-[#6B0014]">{item.icon}</span>}
                <span className="truncate text-base font-medium">
                  {item.name}
                </span>
              </div>
              {isActive && (
                <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              )}
            </LocalizedClientLink>
          )}
        </Fragment>
      )
    })
  }

  const shouldRenderShopAllButton =
    !currentCategory || currentCategory.name !== 'Collections'

  // Render SSR fallback button
  if (!mounted) {
    return (
      <Button
        variant="icon"
        withIcon
        className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-gray-100 large:hidden"
        disabled
        aria-label="Toggle navigation menu"
      >
        <BarsIcon className="h-6 w-6 text-gray-800" />
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="icon"
          withIcon
          className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-gray-800 transition-colors hover:bg-gray-100 active:bg-gray-200 large:hidden"
          aria-label="Open navigation menu"
          data-testid="mobile-menu-trigger"
        >
          <BarsIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogPortal>
        {/* Backdrop overlay */}
        <DialogOverlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300" />

        {/* Slide-in drawer container */}
        <DialogContent
          className="fixed left-0 top-0 bottom-0 z-50 flex h-full w-[88vw] max-w-[360px] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out border-r border-gray-200/80"
          aria-describedby={undefined}
        >
          {/* Header */}
          <DialogHeader className="sticky top-0 z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-0 shadow-2xs">
            {currentCategory ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg p-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5 text-[#6B0014]" />
                <span className="truncate max-w-[180px] font-bold text-gray-900">
                  {currentCategory.name}
                </span>
              </button>
            ) : (
              <LocalizedClientLink
                href="/"
                onClick={() => handleOpenDialogChange(false)}
                className="flex items-center gap-2"
              >
                <TejasLogo className="h-10 w-auto" />
              </LocalizedClientLink>
            )}

            <button
              type="button"
              onClick={() => handleOpenDialogChange(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeader>

          <VisuallyHidden.Root>
            <DialogTitle>Mobile Navigation Menu</DialogTitle>
          </VisuallyHidden.Root>

          {/* Body */}
          <DialogBody className="flex-1 overflow-y-auto bg-gray-50/60 p-4 space-y-3 no-scrollbar">
            {/* CTA Button */}
            {shouldRenderShopAllButton && (
              <LocalizedClientLink
                href={currentCategory ? `${currentCategory.handle}` : `/shop`}
                onClick={() => handleOpenDialogChange(false)}
                className="group flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#0A0A0A] via-[#6B0014] to-[#0A0A0A] px-4 py-3.5 text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.99]"
              >
                <span className="text-sm font-bold tracking-wide">
                  Shop all{' '}
                  {currentCategory && currentCategory.name !== 'Shop'
                    ? currentCategory.name
                    : ''}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#0A0A0A] transition-transform duration-200 group-hover:translate-x-1">
                  <ChevronRightIcon className="h-4 w-4" />
                </span>
              </LocalizedClientLink>
            )}

            {/* Category list */}
            <div className="space-y-2 pt-1">
              {renderCategories(getActiveCategories())}
            </div>
          </DialogBody>

          {/* Quick links footer */}
          <div className="shrink-0 border-t border-gray-100 bg-white p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <LocalizedClientLink
                href="/account"
                onClick={() => handleOpenDialogChange(false)}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#6B0014]"
              >
                <UserIcon className="h-5 w-5 text-gray-500" />
                <span>Account</span>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/cart"
                onClick={() => handleOpenDialogChange(false)}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#6B0014]"
              >
                <BagIcon className="h-5 w-5 text-gray-500" />
                <span>Cart</span>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                onClick={() => handleOpenDialogChange(false)}
                className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#6B0014]"
              >
                <span className="flex h-5 w-5 items-center justify-center font-bold text-[#D4AF37]">
                  ?
                </span>
                <span>Support</span>
              </LocalizedClientLink>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SideMenu
