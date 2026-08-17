'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { FILTER_KEYS, storeSortOptions } from '@lib/constants'
import { createUrl } from '@lib/util/urls'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@modules/common/components/select'
import { SearchIcon, XIcon } from '@modules/common/icons'
import { ChevronDownIcon } from '@modules/common/icons'
import { omit } from 'lodash'
import { ProductFilters } from 'types/global'

import { FilterItems } from '../filters/filter-wrapper/filter-item'

// ─── Types ────────────────────────────────────────────────────────────────────

export type HorizontalFilterBarConfig = {
  showCategory?: boolean
  showCollection?: boolean
  showSearch?: boolean
  showSort?: boolean
}

export type HorizontalFilterBarProps = {
  filters: ProductFilters
  lockedCollectionId?: string
  config?: HorizontalFilterBarConfig
  countryCode: string
  sortBy?: string
  activeFiltersSlot?: React.ReactNode
}

// ─── Pill Filter Dropdown ─────────────────────────────────────────────────────

function FilterDropdown({
  label,
  param,
  items,
}: {
  label: string
  param: string
  items: { id: string; value: string }[]
}) {
  const searchParams = useSearchParams()
  const activeCount =
    searchParams.get(param)?.split(',').filter(Boolean).length ?? 0

  if (items.length === 0) return null

  return (
    <Select value={null} onValueChange={() => {}}>
      <SelectTrigger
        aria-label={`Filter by ${label}`}
        data-testid={`${label.toLowerCase()}-filter`}
        className={[
          'group h-9 shrink-0 gap-1.5 rounded-full border px-3.5 sm:px-4 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap',
          '[&>span:last-child]:hidden', // hide built-in chevron
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B0014]/20 focus-visible:ring-offset-1',
          activeCount > 0
            ? 'border-[#6B0014] bg-[#6B0014] text-white shadow-xs hover:bg-[#580010]'
            : 'border-gray-300 bg-white text-gray-800 shadow-2xs hover:border-[#D4AF37] hover:text-[#6B0014]',
        ].join(' ')}
      >
        <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          {label}
          {activeCount > 0 ? (
            <span className="flex h-4.5 min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[11px] font-bold text-[#0A0A0A]">
              {activeCount}
            </span>
          ) : (
            <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-[#6B0014]" />
          )}
        </span>
      </SelectTrigger>
      <SelectContent className="z-[100] mt-1.5 min-w-[220px] max-h-72 overflow-y-auto mega-menu-scroll rounded-2xl border border-gray-200/90 bg-white p-1.5 shadow-xl shadow-black/15">
        <FilterItems items={items} param={param} />
      </SelectContent>
    </Select>
  )
}

// ─── Search Input ─────────────────────────────────────────────────────────────

function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(searchParams.get('q') ?? '')
  }, [searchParams])

  const pushSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(
        omit(Object.fromEntries(searchParams.entries()), 'page') as Record<
          string,
          string
        >
      )
      if (query.trim()) {
        params.set('q', query.trim())
      } else {
        params.delete('q')
      }
      router.push(createUrl(pathname, params))
    },
    [searchParams, pathname, router]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushSearch(v), 400)
  }

  return (
    <div
      className={[
        'flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border px-3.5 text-xs sm:text-sm transition-all duration-200 small:w-56 small:flex-none shadow-2xs',
        focused || value
          ? 'border-[#D4AF37] bg-white shadow-xs ring-2 ring-[#D4AF37]/20 text-gray-900'
          : 'border-gray-300 bg-white text-gray-800 hover:border-[#D4AF37]',
      ].join(' ')}
    >
      <SearchIcon
        className={[
          'h-3.5 w-3.5 shrink-0 transition-colors duration-200',
          focused || value ? 'text-[#6B0014]' : 'text-gray-400',
        ].join(' ')}
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('')
            pushSearch('')
          }}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({ sortBy }: { sortBy: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const current = storeSortOptions.find((o) => o.value === sortBy)

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-500 small:block">
        Sort
      </span>
      <Select value={sortBy} onValueChange={handleChange}>
        <SelectTrigger
          aria-label="Sort by"
          data-testid="select-sort-by"
          className="group h-9 shrink-0 gap-1.5 rounded-full border border-gray-300 bg-white px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs transition-all duration-200 hover:border-[#D4AF37] hover:text-[#6B0014] focus:outline-none cursor-pointer whitespace-nowrap [&>span:last-child]:hidden"
        >
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <SelectValue
              placeholder={current?.label ?? storeSortOptions[0].label}
              className="whitespace-nowrap"
            />
            <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-[#6B0014]" />
          </span>
        </SelectTrigger>
        <SelectContent className="z-[100] mt-1.5 min-w-[180px] max-h-72 overflow-y-auto mega-menu-scroll rounded-2xl border border-gray-200/90 bg-white p-1.5 shadow-xl shadow-black/15">
          {storeSortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="hidden h-5 w-px bg-basic-primary/30 small:block" />
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HorizontalFilterBar({
  filters,
  lockedCollectionId,
  config = {},
  sortBy = 'relevance',
  activeFiltersSlot,
}: HorizontalFilterBarProps) {
  const {
    showCategory = true,
    showCollection = true,
    showSearch = true,
    showSort = true,
  } = config

  const showCollectionDropdown = showCollection && !lockedCollectionId

  const categoryOptions = filters.category ?? []
  const collectionOptions = filters.collection ?? []

  const hasFilters = showCategory || showCollectionDropdown
  const hasControls = showSearch || showSort

  return (
    <div
      className="w-full border-b border-gray-200/80 py-3.5 my-2"
      role="search"
      aria-label="Product filters"
    >
      {/* Single row / responsive wrap: filters | chips | search + sort */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Filter pills */}
        {hasFilters && (
          <div className="flex shrink-0 items-center gap-2">
            {showCategory && (
              <FilterDropdown
                label="Category"
                param={FILTER_KEYS.CATEGORY_KEY}
                items={categoryOptions}
              />
            )}
            {showCollectionDropdown && (
              <FilterDropdown
                label="Collection"
                param={FILTER_KEYS.COLLECTION_KEY}
                items={collectionOptions}
              />
            )}
          </div>
        )}

        {/* Vertical divider between filters and chips */}
        {hasFilters && activeFiltersSlot && <Divider />}

        {/* Active filter chips */}
        {activeFiltersSlot && (
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {activeFiltersSlot}
          </div>
        )}

        {/* Spacer when no chips */}
        {!activeFiltersSlot && <div className="flex-1" />}

        {/* Vertical divider before search/sort */}
        {hasControls && <Divider />}

        {/* Search + Sort */}
        {hasControls && (
          <div className="flex flex-1 sm:flex-initial items-center gap-2 justify-end">
            {showSearch && <SearchInput />}
            {showSort && showSearch && <Divider />}
            {showSort && <SortDropdown sortBy={sortBy} />}
          </div>
        )}
      </div>
    </div>
  )
}
