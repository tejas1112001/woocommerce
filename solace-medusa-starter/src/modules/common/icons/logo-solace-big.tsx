import React from 'react'
import { cn } from '@lib/util/cn'

export interface TejasLogoBigProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  logoClassName?: string
}

export const TejasLogoBig = ({
  className,
  logoClassName,
  ...props
}: TejasLogoBigProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center h-16 select-none',
        className
      )}
      {...props}
    >
      <img
        src="/logo/logo.png"
        alt="Swami Om Enterprises Logo"
        className={cn('h-full w-auto object-contain shrink-0', logoClassName)}
      />
    </div>
  )
}


