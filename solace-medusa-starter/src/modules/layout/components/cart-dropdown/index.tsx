'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { deleteLineItem, updateLineItem } from '@lib/data/cart'
import { useCartStore } from '@lib/store/useCartStore'
import { convertToLocale } from '@lib/util/money'
import { isDefaultVariantTitle } from '@lib/util/is-default-variant'
import { HttpTypes } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BagIcon, MinusThinIcon, PlusIcon, TrashIcon, XIcon } from '@modules/common/icons'
import Thumbnail from '@modules/products/components/thumbnail'

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

const CartItemRow = ({
  item,
  currencyCode,
  onRefresh,
}: {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  onRefresh: () => Promise<void>
}) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const qty = item.quantity
  const maxQty =
    !item.variant?.manage_inventory || item.variant?.allow_backorder
      ? 10
      : Math.max(0, item.variant?.inventory_quantity ?? 0)

  const handleQtyChange = async (newQty: number) => {
    if (newQty < 1 || newQty > maxQty || isUpdating) return

    const previousCart = useCartStore.getState().cart

    // 1. Optimistic update
    useCartStore.getState().updateItemQuantityOptimistic(item.id, newQty)

    setIsUpdating(true)
    try {
      await updateLineItem({ lineId: item.id, quantity: newQty })
      await onRefresh()
    } catch {
      // Revert on error
      useCartStore.setState({ cart: previousCart })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    const previousCart = useCartStore.getState().cart

    // 1. Optimistic delete
    useCartStore.getState().deleteItemOptimistic(item.id)

    setIsDeleting(true)
    try {
      await deleteLineItem(item.id)
      await onRefresh()
    } catch {
      // Revert on error
      useCartStore.setState({ cart: previousCart })
    } finally {
      setIsDeleting(false)
    }
  }

  const unitPrice = item.unit_price ?? 0
  const lineTotal = unitPrice * qty

  return (
    <div
      className={`flex gap-3 py-4 transition-opacity duration-200 ${
        isDeleting ? 'opacity-30 pointer-events-none' : ''
      }`}
      data-testid="cart-item"
    >
      {/* Product Image */}
      <LocalizedClientLink
        href={`/products/${item.variant?.product?.handle ?? ''}`}
        className="shrink-0"
      >
        <div className="h-[96px] w-[80px] overflow-hidden rounded-lg bg-gray-100">
          <Thumbnail
            thumbnail={item.variant?.thumbnail || item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="h-full w-full rounded-none object-cover"
          />
        </div>
      </LocalizedClientLink>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <LocalizedClientLink
              href={`/products/${item.variant?.product?.handle ?? ''}`}
              data-testid="product-link"
            >
              <p className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 dark:text-white hover:underline">
                {item.product_title}
              </p>
            </LocalizedClientLink>
            {item.variant?.title && !isDefaultVariantTitle(item.variant.title) && (
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {item.variant.title}
              </p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Remove item"
            className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            data-testid="cart-item-remove-button"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Qty + Price row */}
        <div className="mt-2 flex items-center justify-between">
          {/* Qty selector */}
          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm h-8">
            <button
              type="button"
              onClick={() => handleQtyChange(qty - 1)}
              disabled={qty <= 1 || isUpdating}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <MinusThinIcon className="h-3 w-3" />
            </button>
            <span
              className="min-w-[2ch] text-center text-sm font-semibold text-gray-800 dark:text-white"
              aria-live="polite"
              data-testid="cart-item-quantity"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(qty + 1)}
              disabled={qty >= maxQty || isUpdating}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <PlusIcon className="h-3 w-3" />
            </button>
          </div>

          {/* Line total */}
          <span
            className="text-sm font-semibold text-gray-900 dark:text-white"
            data-testid="cart-item-price"
          >
            {convertToLocale({ amount: lineTotal, currency_code: currencyCode })}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────────────────────────────

const EmptyCart = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 py-16 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
      <BagIcon className="h-9 w-9 text-gray-400" />
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">Your bag is empty</p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Looks like you haven&apos;t added anything yet.
      </p>
    </div>
    <button
      onClick={onClose}
      className="mt-2 rounded-full bg-gray-900 dark:bg-white px-7 py-3 text-sm font-semibold text-white dark:text-gray-900 transition-all hover:opacity-85 active:scale-95"
    >
      Continue Shopping
    </button>
  </div>
)

// ─── Cart Drawer ───────────────────────────────────────────────────────────────

const CartDropdown = ({
  cart: cartProp,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const {
    isOpenCartDropdown,
    openCartDropdown: _open,
    closeCartDropdown,
    cart: storeCart,
    isCartLoading,
    setCart,
    refreshCart,
  } = useCartStore()

  const drawerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Track hydration state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Robust synchronization with SSR/server cart data
  useEffect(() => {
    if (cartProp) {
      setCart(cartProp)
    }
  }, [cartProp, setCart])

  // Refresh whenever the drawer is opened (ensures freshness after adding items)
  useEffect(() => {
    if (isOpenCartDropdown) {
      refreshCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenCartDropdown])

  // Body scroll lock
  useEffect(() => {
    if (isOpenCartDropdown) {
      document.body.classList.add('cart-drawer-open')
    } else {
      document.body.classList.remove('cart-drawer-open')
    }
    return () => document.body.classList.remove('cart-drawer-open')
  }, [isOpenCartDropdown])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDropdown()
    },
    [closeCartDropdown]
  )
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // The active cart is Zustand state (live) or the SSR prop (initial fallback)
  const activeCart = storeCart ?? cartProp

  const items = activeCart?.items
    ? [...activeCart.items].sort((a, b) =>
        (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
      )
    : []

  const totalItems = items.length
  const subtotal = activeCart?.subtotal ?? 0
  const currencyCode = activeCart?.currency_code ?? 'usd'

  // Cart icon badge (always visible in nav)
  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() =>
          isOpenCartDropdown ? closeCartDropdown() : refreshCart().then(() => _open())
        }
        aria-label="Open cart"
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-action-primary transition-colors hover:bg-fg-secondary-hover hover:text-action-primary-hover active:bg-fg-secondary-pressed active:text-action-primary-pressed"
        data-testid="nav-cart-link"
        id="cart-drawer-trigger"
      >
        <div className="relative inline-flex items-center justify-center">
          <BagIcon className="h-6 w-6 text-basic-primary" />
          {totalItems > 0 && isMounted && (
            <span
              key={totalItems}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow-[0_1.5px_3px_rgba(0,0,0,0.25)] select-none animate-badge-pop"
            >
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCartDropdown}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpenCartDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        data-testid="nav-cart-dropdown"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full flex-col bg-white dark:bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out small:w-[420px] large:w-[480px] ${
          isOpenCartDropdown ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">My Bag</h2>
            {totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 dark:bg-white px-1.5 text-[11px] font-bold text-white dark:text-gray-900">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCartDropdown}
            aria-label="Close cart"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            id="cart-drawer-close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* ── Body ── */}
        {isCartLoading && !activeCart ? (
          // Loading skeleton
          <div className="flex-1 overflow-y-auto px-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex animate-pulse gap-3 py-4 border-b border-gray-50 dark:border-gray-900">
                <div className="h-[96px] w-[80px] shrink-0 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="mt-auto h-8 w-28 rounded-full bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="flex-1 overflow-y-auto px-5 no-scrollbar">
            <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  currencyCode={currencyCode}
                  onRefresh={refreshCart}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyCart onClose={closeCartDropdown} />
        )}

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-6 pt-4 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
              <span
                className="text-base font-bold text-gray-900 dark:text-white"
                data-testid="cart-subtotal"
              >
                {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            {/* Checkout CTA */}
            <LocalizedClientLink href="/checkout" onClick={closeCartDropdown}>
              <button
                className="mt-1 w-full rounded-full bg-gray-900 dark:bg-white py-3.5 text-sm font-semibold text-white dark:text-gray-900 shadow-sm transition-all hover:opacity-85 active:scale-[0.98]"
                data-testid="checkout-button"
                id="cart-checkout-button"
              >
                Checkout
              </button>
            </LocalizedClientLink>

            {/* View cart link */}
            <LocalizedClientLink href="/cart" onClick={closeCartDropdown}>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 hover:underline cursor-pointer mt-1">
                View full cart
              </p>
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDropdown
