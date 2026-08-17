'use client'

import React from 'react'

import { cn } from '@lib/util/cn'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { Box } from '@modules/common/components/box'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface CategoryItem {
  name: string
  handle: string
  category_children?: CategoryItem[]
  description?: string
}

interface DropdownMenuProps {
  item: CategoryItem
  activeItem: {
    name: string
    handle: string
  } | null
  children: React.ReactNode
  customContent?: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// ── Category card icon pool — rotated by index for visual variety ──────────
const CATEGORY_ICONS = [
  // Tag / label
  <path key="tag" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
  // Cube / box
  <path key="cube" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  // Star
  <path key="star" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
  // Sparkles
  <path key="sparkles" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  // Fire
  <path key="fire" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />,
  // Gift
  <path key="gift" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />,
]

// Collection icon SVG
const COLLECTION_ICON = (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
)

const renderModernMegaMenu = (
  itemsList: CategoryItem[],
  activeItem: { name: string; handle: string } | null,
  item: CategoryItem,
  onOpenChange: (open: boolean) => void
) => {
  const isCollectionsView =
    activeItem?.name === 'Collections' || item.name === 'Collections'

  const title = isCollectionsView
    ? 'Browse Collections'
    : activeItem?.name === 'Shop'
    ? 'Shop by Category'
    : activeItem?.name ?? item.name

  const subtitle = isCollectionsView
    ? 'Explore our exclusive product collections'
    : 'Discover our curated selection of premium products'

  return (
    <div className="mx-auto w-full max-w-[1328px] px-6 py-7 medium:px-12">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 medium:flex-row medium:items-center medium:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0A0A0A] medium:text-2xl flex items-center gap-2.5">
            <span>{title}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </h2>
          <p className="mt-1 text-xs text-gray-500 medium:text-sm">
            {subtitle}
          </p>
        </div>

        <LocalizedClientLink
          href={`${activeItem?.handle ?? item.handle}`}
          onClick={() => onOpenChange(false)}
          className="group inline-flex w-fit items-center gap-2 rounded-xl bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white border border-[#D4AF37]/30 shadow-sm transition-all duration-200 hover:bg-[#6B0014] hover:text-[#D4AF37] hover:border-[#D4AF37]/60 active:scale-[0.98]"
        >
          <span>View All</span>
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </LocalizedClientLink>
      </div>

      {/* Thin theme divider */}
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* ── Content Grids ──────────────────────────────────── */}
      {isCollectionsView ? (
        /* ── Collections Grid (Compact Cards, scales for 6–8 items) ── */
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {itemsList.map((collection, index) => (
            <LocalizedClientLink
              key={index}
              href={collection.handle}
              onClick={() => onOpenChange(false)}
              className="group relative flex items-center gap-3.5 rounded-xl border border-gray-200/70 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:shadow-md"
              data-testid={formatNameForTestId(`${collection.name}-collection-card`)}
            >
              {/* Subtle hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-[#6B0014]/5 via-[#D4AF37]/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* Icon badge */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6B0014]/10 to-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#6B0014] transition-all duration-200 group-hover:bg-[#6B0014] group-hover:text-[#D4AF37]">
                <svg
                  className="h-5 w-5 transition-colors duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {COLLECTION_ICON}
                </svg>
              </div>

              {/* Title & action */}
              <div className="relative min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#6B0014]">
                  {collection.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 transition-colors duration-200 group-hover:text-[#D4AF37]">
                  <span>Explore</span>
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        /* ── Categories Grid (Scalable multi-column grid for 20–30 items) ── */
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {itemsList.map((category, index) => {
            const IconPath = CATEGORY_ICONS[index % CATEGORY_ICONS.length]
            return (
              <LocalizedClientLink
                key={index}
                href={category.handle}
                onClick={() => onOpenChange(false)}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/60 hover:shadow-md"
                data-testid={formatNameForTestId(`${category.name}-category-card`)}
              >
                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[#6B0014]/5 via-[#D4AF37]/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                {/* Top row: Icon badge */}
                <div className="relative mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100/80 text-[#6B0014] transition-all duration-200 group-hover:bg-[#6B0014] group-hover:text-[#D4AF37]">
                  <svg
                    className="h-5 w-5 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {IconPath}
                  </svg>
                </div>

                {/* Name */}
                <h3 className="relative mb-1 text-sm font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-[#6B0014]">
                  {category.name}
                </h3>

                {/* Subcategory previews */}
                {category.category_children && category.category_children.length > 0 && (
                  <div className="relative mt-1 space-y-0.5">
                    {category.category_children.slice(0, 3).map((subcat, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-700"
                      >
                        <div className="h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]" />
                        <span className="truncate">{subcat.name}</span>
                      </div>
                    ))}
                    {category.category_children.length > 3 && (
                      <div className="text-[11px] font-semibold text-[#6B0014] group-hover:text-[#D4AF37]">
                        +{category.category_children.length - 3} more
                      </div>
                    )}
                  </div>
                )}

                {/* Pinned action at bottom */}
                <div className="relative mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-gray-400 transition-colors duration-200 group-hover:text-[#D4AF37]">
                  <span>Shop</span>
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      )}

      {/* ── Bottom CTA Banner (Theme dark maroon/black with gold accents) ── */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0A0A0A] via-[#580010] to-[#2B0008] p-6 text-white shadow-xl">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#D4AF37]/10 blur-2xl" />

        <div className="relative flex flex-col items-start justify-between gap-4 medium:flex-row medium:items-center">
          {/* Text */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold medium:text-lg">
              <span>Need Help Finding Something?</span>
              <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
            </h3>
            <p className="mt-1 text-xs text-gray-300 medium:text-sm">
              Our team is here to assist you with personalized product recommendations
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <LocalizedClientLink
              href="/contact"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#0A0A0A] shadow-md transition-all duration-200 hover:bg-[#c59b27] hover:shadow-lg medium:px-5 medium:py-2.5 medium:text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Contact Us</span>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/about"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xs transition-all duration-200 hover:border-[#D4AF37] hover:bg-white/10 medium:px-5 medium:py-2.5 medium:text-sm"
            >
              <span>Learn More</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  item,
  activeItem,
  children,
  customContent,
  isOpen,
  onOpenChange,
}) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    onOpenChange(true)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onOpenChange(false)
    }, 150)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className="relative flex h-full items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {item.category_children && item.category_children.length > 0 && (
        <Box
          className={cn(
            // Base layout
            'fixed inset-x-0 z-40 border-t border-gray-100 bg-white shadow-2xl',
            // Entry animation
            'transition-all duration-200 ease-out',
            // Visibility states
            isOpen
              ? 'pointer-events-auto visible translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-2 opacity-0',
            // Thin top accent stripe + custom scrollbar + invisible top hit bridge
            "mega-menu-panel mega-menu-scroll before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 before:content-['']"
          )}
          style={{
            top: '88px',
            maxHeight: isOpen ? 'calc(100vh - 88px)' : '0',
            overflowY: isOpen ? 'auto' : 'hidden',
            overflowX: 'hidden',
          }}
        >
          {/* Top theme accent line: Maroon -> Gold -> Purple */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#6B0014] via-[#D4AF37] to-[#7C3AED]" />

          {customContent ?? renderModernMegaMenu(item.category_children, activeItem, item, onOpenChange)}
        </Box>
      )}
    </div>
  )
}

export default DropdownMenu
