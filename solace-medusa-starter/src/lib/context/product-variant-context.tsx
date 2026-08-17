'use client'

import { createContext, useCallback, useContext, useState } from 'react'

import { HttpTypes } from '@medusajs/types'

type ProductVariantContextValue = {
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  setSelectedVariant: (v: HttpTypes.StoreProductVariant | undefined) => void
}

const ProductVariantContext = createContext<ProductVariantContextValue>({
  selectedVariant: undefined,
  setSelectedVariant: () => {},
})

export function ProductVariantProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [selectedVariant, setSelectedVariantState] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(undefined)

  const setSelectedVariant = useCallback(
    (v: HttpTypes.StoreProductVariant | undefined) => {
      setSelectedVariantState(v)
    },
    []
  )

  return (
    <ProductVariantContext.Provider value={{ selectedVariant, setSelectedVariant }}>
      {children}
    </ProductVariantContext.Provider>
  )
}

export function useProductVariant() {
  return useContext(ProductVariantContext)
}
