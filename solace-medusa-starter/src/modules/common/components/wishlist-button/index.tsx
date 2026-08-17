'use client'

import { useWishlistStore, WishlistItem } from '@lib/store/useWishlistStore'
import { cn } from '@lib/util/cn'
import { HeartIcon } from '@modules/common/icons'

interface WishlistButtonProps {
  product: WishlistItem
  className?: string
  size?: 'sm' | 'md'
}

export function WishlistButton({
  product,
  className,
  size = 'md',
}: WishlistButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore()
  const saved = isInWishlist(product.id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border transition-all duration-200',
        'focus-visible:outline-none focus:outline-none',
        size === 'md'
          ? 'h-12 w-12 border-gray-200 hover:border-red-300 hover:bg-red-50'
          : 'h-9 w-9 border-gray-200 hover:border-red-300 hover:bg-red-50',
        saved
          ? 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100'
          : 'bg-white',
        'active:scale-90',
        className
      )}
    >
      <HeartIcon
        filled={saved}
        className={cn(
          'transition-all duration-200',
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          saved ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
        )}
      />
    </button>
  )
}
