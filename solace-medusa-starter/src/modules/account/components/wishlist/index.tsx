'use client'

import Image from 'next/image'

import { isDefaultVariantTitle } from '@lib/util/is-default-variant'
import {
  useWishlistStore,
  WishlistItem,
} from '@lib/store/useWishlistStore'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { HeartIcon, TrashIcon } from '@modules/common/icons'

const WishlistItemCard = ({
  item,
}: {
  item: WishlistItem
  countryCode: string
}) => {
  const { removeItem } = useWishlistStore()

  return (
    <Box className="flex gap-4 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 items-center">
      {/* Thumbnail */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <HeartIcon className="h-6 w-6 text-neutral-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <Box className="flex flex-1 flex-col justify-between gap-2">
        <Box className="flex flex-col">
          <LocalizedClientLink
            href={`/products/${item.handle}`}
            className="hover:underline font-semibold text-neutral-900 dark:text-white text-base"
          >
            {item.title}
          </LocalizedClientLink>
          {item.variantTitle && !isDefaultVariantTitle(item.variantTitle) && (
            <Text className="text-xs text-neutral-500 dark:text-neutral-400">
              {item.variantTitle}
            </Text>
          )}
          {item.price && (
            <Text className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
              {item.price}
            </Text>
          )}
        </Box>
        <Box className="flex items-center justify-between gap-2 pt-1">
          <Button variant="tonal" size="sm" asChild className="w-max">
            <LocalizedClientLink href={`/products/${item.handle}`}>
              View product &rarr;
            </LocalizedClientLink>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            aria-label="Remove from wishlist"
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg p-2"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const WishlistPage = ({ countryCode }: { countryCode: string }) => {
  const { items, clearWishlist } = useWishlistStore()

  if (items.length === 0) {
    return (
      <Box
        className="flex w-full flex-col items-center gap-6 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center shadow-xs"
        data-testid="empty-wishlist-container"
      >
        <Box className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
          <HeartIcon className="h-8 w-8 text-neutral-400" />
        </Box>
        <Box className="flex flex-col items-center gap-2">
          <Heading as="h1" className="text-xl text-neutral-900 dark:text-white font-semibold">
            Your wishlist is empty
          </Heading>
          <Text className="max-w-[438px] text-center text-sm text-neutral-500 dark:text-neutral-400">
            Save items you love to your wishlist. They&apos;ll appear here so
            you can easily find them later.
          </Text>
          <Button variant="filled" size="sm" asChild className="mt-3">
            <LocalizedClientLink href="/shop">Start shopping</LocalizedClientLink>
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="flex flex-col gap-6" data-testid="wishlist-page-wrapper">
      <Box className="flex items-center justify-between">
        <Heading as="h1" className="text-xl small:text-2xl font-bold">
          Wishlist
        </Heading>
        <Box className="flex items-center gap-3">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
          <Button
            variant="text"
            size="sm"
            onClick={clearWishlist}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Clear all
          </Button>
        </Box>
      </Box>
      <Box className="flex flex-col gap-4">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            countryCode={countryCode}
          />
        ))}
      </Box>
    </Box>
  )
}

export default WishlistPage

