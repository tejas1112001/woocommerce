'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import { Text } from '@modules/common/components/text'
import { PlaceholderImage } from '@modules/common/icons'
import clsx from 'clsx'

type ThumbnailProps<T extends React.ElementType = 'a'> = {
  as?: T
  thumbnail?: string | null
  size?: 'small' | 'big' | 'full'
  more?: string
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  'as' | 'thumbnail' | 'size' | 'more'
>

export default function OrderThumbnail<T extends React.ElementType = 'a'>({
  as,
  thumbnail,
  size = 'small',
  more,
  className,
  ...props
}: ThumbnailProps<T>) {
  const Component = as || 'a'

  return (
    <Component
      as={as}
      className={clsx(
        'relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-1.5 transition-all duration-200 ease-in-out',
        className,
        {
          'hover:border-action-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 active:border-action-primary':
            !more,
        },
        {
          'h-[52px] w-[44px]': size === 'small',
          'h-[68px] w-[58px] small:h-[84px] small:w-[72px]': size === 'big',
          'h-full w-full': size === 'full',
        }
      )}
      {...props}
    >
      {more ? (
        <Text className="flex h-full w-full items-center justify-center text-lg text-basic-primary">
          {more}
        </Text>
      ) : (
        <ImageOrPlaceholder image={thumbnail} size={size} />
      )}
    </Component>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, 'size'> & { image?: string | null }) => {
  const [hasError, setHasError] = useState(false)

  if (!image || hasError) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center text-secondary">
        <PlaceholderImage size={size === 'small' ? '16' : '24'} />
      </div>
    )
  }

  return (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 h-full w-full object-cover object-center"
      draggable={false}
      sizes="(max-width: 576px) 120px, 120px"
      onError={() => setHasError(true)}
      fill
    />
  )
}

