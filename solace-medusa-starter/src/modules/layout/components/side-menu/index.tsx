'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react'

import { createNavigation } from '@lib/constants'
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
import Divider from '@modules/common/components/divider'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import {
  ArrowLeftIcon,
  BarsIcon,
  ChevronRightIcon,
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
  const [categoryStack, setCategoryStack] = useState<CategoryItem[]>([])
  const currentCategory = categoryStack[categoryStack.length - 1] || null
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const renderCategories = (categories: any[]) => {
    return categories.map((item, index) => {
      const hasChildren =
        item.category_children && item.category_children.length > 0

      const lastCategoryIndex = categories.findLastIndex(
        (cat) => cat.type === 'parent_category'
      )

      return (
        <Fragment key={index}>
          <Button
            variant="ghost"
            className="group w-full justify-between rounded-xl px-4 py-4 text-left transition-all hover:bg-gray-50"
            onClick={
              hasChildren
                ? () =>
                    handleCategoryClick({
                      name: item.name,
                      handle: item.handle,
                    })
                : () => handleOpenDialogChange(false)
            }
            asChild={!hasChildren}
          >
            {hasChildren ? (
              <>
                <span className="flex items-center gap-4 text-base font-semibold text-gray-900">
                  {item.icon && item.icon}
                  {item.name}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
              </>
            ) : (
              <LocalizedClientLink href={item.handle}>
                <span className="flex items-center gap-4 text-base font-semibold text-gray-900">
                  {item.icon && item.icon}
                  {item.name}
                </span>
              </LocalizedClientLink>
            )}
          </Button>
          {index === lastCategoryIndex && (
            <Divider className="my-4 -ml-4 w-[calc(100%+2rem)]" />
          )}
        </Fragment>
      )
    })
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

  const shouldRenderButton =
    !currentCategory || currentCategory.name !== 'Collections'

  // Render a placeholder button during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="icon"
        withIcon
        className="flex h-auto !p-2 xsmall:!p-3.5 large:hidden"
        disabled
      >
        <BarsIcon />
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="icon"
          withIcon
          className="flex h-auto !p-2 xsmall:!p-3.5 large:hidden"
        >
          <BarsIcon />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="!max-h-full !max-w-full !rounded-none bg-white"
          aria-describedby={undefined}
        >
          <DialogHeader className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white !p-5 text-xl font-bold text-basic-primary shadow-sm small:text-2xl">
            {currentCategory && (
              <Button 
                variant="tonal" 
                withIcon 
                size="sm" 
                onClick={handleBack}
                className="rounded-lg"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            <span className="flex-1">{currentCategory?.name || 'Menu'}</span>
            <Button
              onClick={() => handleOpenDialogChange(false)}
              variant="icon"
              withIcon
              size="sm"
              className="rounded-lg p-2"
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Menu modal</DialogTitle>
          </VisuallyHidden.Root>
          <DialogBody className="overflow-y-auto bg-gray-50 p-5 small:p-6">
            <Box className="flex flex-col gap-2">
              {shouldRenderButton && (
                <Button
                  variant="tonal"
                  className="mb-4 w-full rounded-xl py-4 text-base font-semibold small:w-max"
                  size="sm"
                  onClick={() => handleOpenDialogChange(false)}
                  asChild={!!currentCategory}
                >
                  <LocalizedClientLink
                    href={
                      currentCategory ? `${currentCategory.handle}` : `/shop`
                    }
                  >
                    Shop all{' '}
                    {currentCategory && currentCategory.name !== 'Shop'
                      ? currentCategory.name
                      : ''}
                  </LocalizedClientLink>
                </Button>
              )}
              {renderCategories(getActiveCategories())}
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SideMenu
