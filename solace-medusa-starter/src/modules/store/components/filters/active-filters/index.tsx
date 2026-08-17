'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { FILTER_KEYS } from '@lib/constants'
import { useActiveFilterHandles } from '@lib/hooks/use-active-filter-handle'
import { useClearFiltersUrl } from '@lib/hooks/use-clear-filters-url'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { PRICING_OPTIONS } from '@modules/search/const'
import { ProductFilters } from 'types/global'

import ActiveFilterItem from './active-filter-item'

type ActiveProductFiltersProps = {
  filters: ProductFilters
  currentCategory?: StoreProductCategory
  currentCollection?: StoreCollection
  currentQuery?: string
  countryCode: string
}

export default function ActiveProductFilters({
  filters,
  currentCategory,
  currentCollection,
  currentQuery,
  countryCode,
}: ActiveProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Categories
  const activeCategoryIds = useActiveFilterHandles({
    key: FILTER_KEYS.CATEGORY_KEY,
  })
  const activeCategories = filters.category?.filter((cat) =>
    activeCategoryIds?.includes(cat.id)
  )

  // Collections
  const activeCollectionIds = useActiveFilterHandles({
    key: FILTER_KEYS.COLLECTION_KEY,
  })
  const activeCollections = filters.collection?.filter((collection) => {
    return activeCollectionIds?.includes(collection.id)
  })

  // Types
  const activeTypeIds = useActiveFilterHandles({
    key: FILTER_KEYS.TYPE_KEY,
  })
  const activeTypes = filters.type?.filter((type) => {
    return activeTypeIds?.includes(type.id)
  })

  // Materials
  const activeMaterialNames = useActiveFilterHandles({
    key: FILTER_KEYS.MATERIAL_KEY,
  })
  const activeMaterials = filters.material?.filter((material) => {
    return activeMaterialNames?.includes(material.id)
  })

  // Prices
  const activePricesHandles = useActiveFilterHandles({
    key: FILTER_KEYS.PRICE_KEY,
  })
  const activePrices = PRICING_OPTIONS?.filter((price) => {
    return activePricesHandles?.includes(price.id)
  })

  const clearAllUrl = useClearFiltersUrl()

  const handleRemoveFilter = (key: string, id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const values = params.get(key)?.split(',') || []
    const newValues = values.filter((value) => value !== id)

    if (newValues.length > 0) {
      params.set(key, newValues.join(','))
    } else {
      params.delete(key)
    }

    const basePath = currentQuery
      ? `/${countryCode}/results/${currentQuery}`
      : currentCategory
        ? `/${countryCode}/categories/${currentCategory.handle}`
        : currentCollection
          ? `/${countryCode}/collections/${currentCollection.handle}`
          : `/${countryCode}/shop`

    router.push(
      params.toString() ? `${basePath}?${params.toString()}` : `${basePath}`
    )
  }

  if (
    activeCategories?.length === 0 &&
    activeCollections?.length === 0 &&
    activeTypes?.length === 0 &&
    activeMaterials?.length === 0 &&
    activePrices?.length === 0
  ) {
    return null
  }

  return (
    <Box className="flex flex-wrap items-center gap-1.5">
      {activeCategories?.length > 0 && (
        <ActiveFilterItem
          label="Category"
          filterKey={FILTER_KEYS.CATEGORY_KEY}
          options={activeCategories.map((cat) => ({
            value: cat.value,
            id: cat.id,
          }))}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activeCollections?.length > 0 && (
        <ActiveFilterItem
          label="Collection"
          filterKey={FILTER_KEYS.COLLECTION_KEY}
          options={activeCollections?.map((collection) => ({
            value: collection.value,
            id: collection.id,
          }))}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activeTypes?.length > 0 && (
        <ActiveFilterItem
          label="Type"
          filterKey={FILTER_KEYS.TYPE_KEY}
          options={activeTypes}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activeMaterials?.length > 0 && (
        <ActiveFilterItem
          label="Material"
          filterKey={FILTER_KEYS.MATERIAL_KEY}
          options={activeMaterials}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {activePrices?.length > 0 && (
        <ActiveFilterItem
          label="Price"
          filterKey={FILTER_KEYS.PRICE_KEY}
          options={activePrices}
          handleRemoveFilter={handleRemoveFilter}
        />
      )}
      {/* Clear all pill */}
      <Link
        href={clearAllUrl}
        className="flex h-7 items-center rounded-full border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-600 transition-all duration-150 hover:border-red-600 hover:text-red-600 shadow-2xs"
      >
        Clear all
      </Link>
    </Box>
  )
}
