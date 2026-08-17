import React from 'react'
import Image from 'next/image'

import { cn } from '@lib/util/cn'
import { getVariantColor } from '@lib/util/get-variant-color'
import { HttpTypes } from '@medusajs/types'
import { Text } from '@modules/common/components/text'

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

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex items-center gap-x-2">
        <Text as="span" className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">
          {title}:
        </Text>
        <Text as="span" className="text-xs sm:text-sm font-bold text-gray-900">
          {current}
        </Text>
      </div>

      <div
        className="flex flex-wrap gap-2.5 sm:gap-3"
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
                className={cn(
                  'relative h-11 w-11 overflow-hidden rounded-full transition-all duration-200 cursor-pointer touch-manipulation',
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
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 cursor-pointer touch-manipulation',
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
              className={cn(
                'flex h-10 min-w-[44px] items-center justify-center rounded-xl border px-3.5 text-xs sm:text-sm font-semibold cursor-pointer touch-manipulation',
                'transition-all duration-200',
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
