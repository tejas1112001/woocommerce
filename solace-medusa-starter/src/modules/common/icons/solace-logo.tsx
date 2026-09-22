'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@lib/util/cn'
import { useStoreSettings } from '@lib/context/store-settings-context'

export interface TejasLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  logoClassName?: string
  overrideSrc?: string
  alt?: string
}

const DEFAULT_LOGO_SRC = '/logo/logo.png'

export const TejasLogo = ({
  className,
  logoClassName,
  overrideSrc,
  alt,
  ...props
}: TejasLogoProps) => {
  const { logoUrl, storeName } = useStoreSettings()
  const activeLogo = overrideSrc || logoUrl || DEFAULT_LOGO_SRC
  const [imgSrc, setImgSrc] = useState<string>(activeLogo)

  useEffect(() => {
    setImgSrc(overrideSrc || logoUrl || DEFAULT_LOGO_SRC)
  }, [overrideSrc, logoUrl])

  return (
    <div
      className={cn(
        'inline-flex items-center h-8 select-none',
        className
      )}
      {...props}
    >
      <img
        src={imgSrc}
        alt={alt || `${storeName || 'Swami Om Enterprises'} Logo`}
        onError={() => {
          if (imgSrc !== DEFAULT_LOGO_SRC) {
            setImgSrc(DEFAULT_LOGO_SRC)
          }
        }}
        className={cn('h-full w-auto object-contain shrink-0', logoClassName)}
      />
    </div>
  )
}
