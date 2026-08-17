'use client'

import { cn } from '@lib/util/cn'
import { MinusThinIcon, PlusIcon } from '@modules/common/icons'

type ItemQtySelectProps = {
  qty: number
  maxQuantity: number
  action: (quantity: number) => void
}

export default function ItemQtySelect({
  qty,
  maxQuantity,
  action,
}: ItemQtySelectProps) {
  const canDecrement = qty > 1
  const canIncrement = qty < maxQuantity && maxQuantity > 0

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm',
        'h-10 select-none',
        { 'pointer-events-none opacity-50': maxQuantity === 0 }
      )}
      data-testid="item-qty-select"
      role="group"
      aria-label="Quantity"
    >
      {/* Decrement button */}
      <button
        type="button"
        onClick={() => canDecrement && action(qty - 1)}
        disabled={!canDecrement}
        aria-label="Decrease quantity"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'text-gray-700 transition-colors duration-150',
          'hover:bg-gray-100 active:bg-gray-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent'
        )}
      >
        <MinusThinIcon className="h-4 w-4" />
      </button>

      {/* Quantity display */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="min-w-[2ch] text-center text-sm font-semibold text-gray-800"
      >
        {qty}
      </span>

      {/* Increment button */}
      <button
        type="button"
        onClick={() => canIncrement && action(qty + 1)}
        disabled={!canIncrement}
        aria-label="Increase quantity"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          'text-gray-700 transition-colors duration-150',
          'hover:bg-gray-100 active:bg-gray-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent'
        )}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
