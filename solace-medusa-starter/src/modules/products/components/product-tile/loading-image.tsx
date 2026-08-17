'use client'

import { useState } from 'react'
import Image from 'next/image'

export const LoadingImage = ({
  src,
  alt,
  priority,
  loading,
  sizes,
  className,
  onClick,
}: {
  src: string
  alt: string
  priority?: boolean
  loading?: 'eager' | 'lazy'
  sizes?: string
  className?: string
  onClick?: () => void
}) => {
  const [isLoading, setIsLoading] = useState(true)
  
  // Handle missing or empty image src
  const imageSrc = src && src.trim() !== '' ? src : '/placeholder-product.png'
  const hasValidSrc = src && src.trim() !== ''

  return (
    <div className="relative h-full w-full" onClick={onClick}>
      {isLoading && hasValidSrc && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {!hasValidSrc ? (
        // Placeholder when no image is available
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <svg
            className="h-16 w-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : (
        <Image
          src={imageSrc}
          fill
          sizes={sizes}
          alt={alt}
          className={className}
          priority={priority}
          loading={loading}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  )
}
