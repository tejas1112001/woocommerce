'use client'

import React from 'react'

import { cn } from '@lib/util/cn'
import Divider from '@modules/common/components/divider'
import { Label } from '@modules/common/components/label'
import { Text } from '@modules/common/components/text'
import { ChevronDownIcon, TickThinIcon } from '@modules/common/icons'
import * as SelectPrimitive from '@radix-ui/react-select'

import {
  ContentProps,
  GroupProps,
  ItemProps,
  RootProps,
  TriggerProps,
} from './types'

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  error?: string
} | null>(null)

export const Select = ({
  children,
  value,
  onValueChange,
  error,
  className,
}: RootProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Radix generates unstable aria-controls IDs during SSR; render after mount.
  if (!mounted) {
    return <div ref={ref} className={className} suppressHydrationWarning />
  }

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, isOpen, setIsOpen, error }}
    >
      <div ref={ref} className={className}>
        <SelectPrimitive.Root
          value={value}
          onValueChange={onValueChange}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          {children}
        </SelectPrimitive.Root>
      </div>
    </SelectContext.Provider>
  )
}
Select.displayName = 'Select'

/**
 * Used to label a group of items.
 */
export const SelectLabel: React.FC<
  React.ComponentPropsWithoutRef<typeof Label>
> = ({ className, children, ...props }) => {
  const context = React.useContext(SelectContext)

  return (
    <Label
      className={cn(
        'text-sm font-medium text-secondary',
        { 'text-negative': context?.error },
        className
      )}
      {...props}
    >
      {children}
    </Label>
  )
}
SelectLabel.displayName = 'SelectLabel'

/**
 * The trigger that toggles the select.
 */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('Trigger must be used within a Select')

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        onClick={() => context.setIsOpen(!context.isOpen)}
        className={cn(
          'border-primary flex w-full items-center justify-between gap-2 border bg-secondary px-4 py-3 text-md text-basic-primary focus-within:ring-0 focus-within:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
          { 'border-negative focus:border-negative': context.error },
          { 'border-action-primary': context.isOpen },
          className
        )}
        {...props}
      >
        {children}
        <span className="flex items-center gap-2.5">
          <SelectPrimitive.Icon>
            <ChevronDownIcon className="h-5 w-5 text-basic-primary" />
          </SelectPrimitive.Icon>
        </span>
      </SelectPrimitive.Trigger>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

/**
 * The value of the select.
 */
export const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className={cn('select-value text-md text-basic-primary', className)}
    {...props}
  />
))
SelectValue.displayName = 'SelectValue'

/**
 * The content of the select (with the options).
 */
export const SelectContent = ({
  children,
  className,
  position = 'popper',
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  ...props
}: ContentProps) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'z-[100] max-h-72 w-max overflow-hidden rounded-2xl border border-gray-200/90 bg-white py-1.5 shadow-xl shadow-black/15',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        position={position}
        side={side}
        sideOffset={sideOffset}
        align={align}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center rounded-t-xl bg-white py-1 text-gray-400 hover:text-gray-700">
          <ChevronDownIcon className="h-4 w-4 rotate-180" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="w-full p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center rounded-b-xl bg-white py-1 text-gray-400 hover:text-gray-700">
          <ChevronDownIcon className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}
SelectContent.displayName = 'SelectContent'

/**
 * Groups multiple items together.
 */
export const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<GroupProps>
>(({ children, label, className }, ref) => (
  <SelectPrimitive.Group ref={ref}>
    {label && (
      <SelectPrimitive.Label
        className={cn('w-full p-4 text-md text-basic-primary', className)}
      >
        {label}
      </SelectPrimitive.Label>
    )}
    {children}
  </SelectPrimitive.Group>
))
SelectGroup.displayName = 'SelectGroup'

/**
 * An item in the select.
 */
export const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('Item must be used within a Select')

    return (
      <SelectPrimitive.Item
        ref={ref}
        value={value}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-800',
          '!outline-none transition-colors duration-150',
          'hover:bg-gray-100 focus:bg-gray-100',
          'data-[state=checked]:bg-gray-900 data-[state=checked]:text-white',
          className
        )}
        {...props}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator>
          <TickThinIcon className="h-4 w-4 text-white" />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    )
  }
)
SelectItem.displayName = 'SelectItem'

/**
 * Used to be helper text.
 */
export const SelectDescription: React.FC<
  React.ComponentPropsWithoutRef<typeof Text>
> = ({ className, children, ...props }) => {
  const context = React.useContext(SelectContext)

  return (
    <Text
      as="p"
      className={cn(
        'mt-2 text-sm font-medium text-secondary',
        { 'text-negative': context?.error },
        className
      )}
      {...props}
    >
      {context?.error || children}
    </Text>
  )
}
SelectDescription.displayName = 'SelectDescription'

/**
 * Used to separate groups of items.
 */
export const SelectSeparator: React.FC<
  React.ComponentPropsWithoutRef<typeof Divider>
> = ({ className, ...props }) => <Divider className={className} {...props} />
SelectSeparator.displayName = 'SelectSeparator'
