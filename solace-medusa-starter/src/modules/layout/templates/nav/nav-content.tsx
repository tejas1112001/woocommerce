'use client'

import { useState } from 'react'

import { cn } from '@lib/util/cn'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { SearchIcon, TejasLogo } from '@modules/common/icons'
import SideMenu from '@modules/layout/components/side-menu'
import { SearchDialog } from '@modules/search/components/search-dialog'
import SearchDropdown from '@modules/search/components/search-dropdown'

import Navigation from './navigation'

export default function NavContent(props: any) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    // Three-column flex layout:
    //   Left  → [Hamburger menu (mobile)] + [Logo]
    //   Center → [Desktop navigation — flex-1 centered]
    //   Right  → [Search button] (profile + cart are in NavActions)
    <div className="flex h-[88px] w-full items-center gap-6">
      {/* ── Left column: hamburger (mobile) + logo ── */}
      <Box className="flex shrink-0 items-center gap-3">
        {/* Hamburger — only on mobile/tablet */}
        <Box className="flex large:hidden">
          <SideMenu
            productCategories={props.productCategories}
            collections={props.collections}
          />
        </Box>

        {/* Logo */}
        <LocalizedClientLink href="/" aria-label="Go to homepage" className="flex items-center">
          <TejasLogo
            className={cn(
              'h-12 w-auto transition-opacity hover:opacity-85',
              'medium:h-14 large:h-[60px]'
            )}
          />
        </LocalizedClientLink>
      </Box>

      {/* ── Center column: desktop nav links ── */}
      <Box
        className={cn('hidden flex-1 items-center justify-center large:flex', {
          'large:hidden': isSearchOpen,
        })}
      >
        <Navigation
          countryCode={props.countryCode}
          productCategories={props.productCategories}
          collections={props.collections}
        />
      </Box>

      {/* ── Right column: search (profile + cart handled by NavActions) ── */}
      <Box className="ml-auto flex shrink-0 items-center">
        {/* Search dropdown inline (large screens) */}
        {isSearchOpen && (
          <SearchDropdown
            setIsOpen={setIsSearchOpen}
            recommendedProducts={props.products}
            isOpen={isSearchOpen}
            countryCode={props.countryCode}
          />
        )}

        {/* Search dialog for mobile */}
        <SearchDialog
          recommendedProducts={props.products}
          countryCode={props.countryCode}
          isOpen={isSearchOpen}
          handleOpenDialogChange={setIsSearchOpen}
        />

        {/* Search toggle button */}
        {!isSearchOpen && (
          <Button
            variant="icon"
            withIcon
            className="h-11 w-11 rounded-full flex items-center justify-center p-2.5 transition-colors hover:bg-fg-secondary-hover"
            onClick={() => setIsSearchOpen(true)}
            data-testid="search-button"
            aria-label="Open search"
          >
            <SearchIcon className="h-6 w-6" />
          </Button>
        )}
      </Box>
    </div>
  )
}
