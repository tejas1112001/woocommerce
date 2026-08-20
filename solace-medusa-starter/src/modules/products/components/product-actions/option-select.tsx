import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { cn } from '@lib/util/cn'
import { getVariantColor } from '@lib/util/get-variant-color'
import { HttpTypes } from '@medusajs/types'
import { Text } from '@modules/common/components/text'
import { ChevronLeftIcon, ChevronRightIcon } from '@modules/common/icons'

/**
 * Returns true when the color is light enough that it needs a visible border
 * to be distinguishable against a white/light background.
 * Accepts 3- or 6-digit hex strings (with or without leading #).
 */
function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  // Perceived luminance (ITU-R BT.601)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.75
}

type VariantColor = {
  Name: string
  Type?: Array<{
    Image?: {
      url: string
      alternativeText?: string
    }
    Color?: string
  }>
}

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  variantsColors: VariantColor[]
  title: string
  disabled: boolean
  'data-testid'?: string
}

/** Checkmark SVG — stroke color adapts via the `stroke` prop */
const Checkmark = ({ light }: { light: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-5 w-5"
    stroke={light ? '#111111' : '#ffffff'}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  variantsColors,
  title,
  'data-testid': dataTestId,
  disabled,
}) => {
  const filteredOptions = option.values
    ?.sort((a, b) => a.value.localeCompare(b.value))
    .map((v) => v.value)

  const isMoreThan6 = (filteredOptions?.length ?? 0) > 6
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 2)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !isMoreThan6) return

    checkScroll()
    container.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      container.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll, isMoreThan6, filteredOptions])

  useEffect(() => {
    if (!scrollContainerRef.current || !current || !isMoreThan6) return
    try {
      const selectedEl = scrollContainerRef.current.querySelector<HTMLElement>(
        `[data-value="${CSS.escape(current)}"]`
      )
      if (selectedEl) {
        selectedEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    } catch {
      // Fallback if selector fails
    }
  }, [current, isMoreThan6])

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.75
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Text as="span" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">
            {title}:
          </Text>
          <Text as="span" className="text-xs sm:text-sm font-bold text-gray-900">
            {current}
          </Text>
        </div>

        {isMoreThan6 && (
          <div className="flex items-center gap-x-1.5 sm:hidden" aria-label={`${title} navigation`}>
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all active:scale-95 touch-manipulation',
                !canScrollLeft
                  ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
              )}
              aria-label={`Scroll ${title.toLowerCase()} left`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-xs transition-all active:scale-95 touch-manipulation',
                !canScrollRight
                  ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
              )}
              aria-label={`Scroll ${title.toLowerCase()} right`}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className={cn(
          'flex gap-2.5 sm:gap-3',
          isMoreThan6
            ? 'overflow-x-auto scroll-smooth no-scrollbar py-0.5 sm:flex-wrap sm:overflow-x-visible'
            : 'flex-wrap'
        )}
        data-testid={dataTestId}
      >
        {filteredOptions?.map((v) => {
          const color = getVariantColor(v, variantsColors)
          const image = color?.Image
          const hex = color?.Color
          const isSelected = v === current

          // ── Image swatch ──────────────────────────────────────────────────
          if (image) {
            return (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                data-value={v}
                className={cn(
                  'relative h-11 w-11 overflow-hidden rounded-full transition-all duration-200 cursor-pointer touch-manipulation',
                  isMoreThan6 && 'shrink-0 sm:shrink',
                  'border-2',
                  isSelected
                    ? 'border-gray-900 ring-2 ring-gray-900/20 scale-105 shadow-xs'
                    : 'border-gray-200 hover:border-gray-400 hover:scale-105',
                  disabled && 'cursor-not-allowed opacity-40'
                )}
                aria-label={`Choose ${v}`}
                aria-pressed={isSelected}
                disabled={disabled}
                data-testid="option-button"
                title={v}
              >
                <Image
                  src={image.url}
                  alt={image.alternativeText ?? v}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                    <Checkmark light={false} />
                  </span>
                )}
              </button>
            )
          }

          // ── Hex color swatch ──────────────────────────────────────────────
          if (hex) {
            const light = isLightColor(hex)
            return (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                data-value={v}
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 cursor-pointer touch-manipulation',
                  isMoreThan6 && 'shrink-0 sm:shrink',
                  'border-2',
                  isSelected
                    ? light
                      ? 'border-gray-900 ring-2 ring-gray-900/20 scale-105 shadow-xs'
                      : 'border-gray-900 ring-2 ring-gray-900/20 scale-105 shadow-xs'
                    : light
                      ? 'border-gray-300 hover:border-gray-500 hover:scale-105'
                      : 'border-transparent hover:border-gray-300 hover:scale-105',
                  disabled && 'cursor-not-allowed opacity-40'
                )}
                aria-label={`Choose ${v}`}
                aria-pressed={isSelected}
                style={{ backgroundColor: hex }}
                disabled={disabled}
                data-testid="option-button"
                title={v}
              >
                {isSelected && <Checkmark light={light} />}
              </button>
            )
          }

          // ── Text pill (Size and any non-color option) ─────────────────────
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              data-value={v}
              className={cn(
                'flex h-10 min-w-[44px] items-center justify-center rounded-xl border px-3.5 text-xs sm:text-sm font-semibold cursor-pointer touch-manipulation',
                'transition-all duration-200',
                isMoreThan6 && 'shrink-0 sm:shrink',
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-xs scale-[1.02]'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50',
                disabled && 'cursor-not-allowed opacity-40'
              )}
              aria-label={`Choose ${v}`}
              aria-pressed={isSelected}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
