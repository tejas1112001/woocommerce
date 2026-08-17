'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import { createUrl } from '@lib/util/urls'
import { Checkbox } from '@modules/common/components/checkbox'
import { Label } from '@modules/common/components/label'
import clsx from 'clsx'
import { omit } from 'lodash'

type CheckboxProps = {
  items?: {
    id: string
    value: string
    disabled?: boolean
  }[]
  param: string
}

export const FilterItems: React.FC<CheckboxProps> = ({ items, param }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const values = searchParams.get(param)?.split(',') ?? []

  const searchParamsObj = omit(
    Object.fromEntries(searchParams.entries()),
    'page'
  )

  return (
    <ul className="flex flex-col gap-0.5 p-0.5">
      {items
        ?.sort((a, b) =>
          param !== 'price' ? a.value.localeCompare(b.value) : 0
        )
        .map((item) => {
          const checked = values.includes(item.id)
          const DynamicTag = item.disabled ? 'li' : Link

          const newValues = checked
            ? values
                .filter((v) => v !== item.id)
                .sort()
                .join(',')
            : [...values, item.id].sort().join(',')

          const newSearchParamsObject = newValues.length
            ? { ...searchParamsObj, [param]: newValues }
            : omit(searchParamsObj, param)

          const href = createUrl(
            pathname,
            new URLSearchParams(newSearchParamsObject)
          )

          return (
            <DynamicTag
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-gray-800 transition-colors duration-150 hover:bg-[#6B0014]/5 hover:text-[#6B0014] cursor-pointer"
              href={href}
              key={item.id}
              data-testid={formatNameForTestId(`${item.value}-filter-item`)}
            >
              <div className="flex shrink-0 items-center justify-center">
                <Checkbox
                  id={`${param}-${item.id}`}
                  role="checkbox"
                  type="button"
                  checked={checked}
                  aria-checked={checked}
                  name={item.value}
                  disabled={item.disabled}
                  className="!m-0 h-4 w-4 shrink-0 rounded border-gray-300 data-[state=checked]:bg-[#6B0014] data-[state=checked]:border-[#6B0014] focus:ring-0"
                />
              </div>
              <Label
                htmlFor={`${param}-${item.id}`}
                className={clsx('cursor-pointer text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#6B0014] select-none truncate', {
                  'pointer-events-none text-gray-400': item.disabled,
                })}
              >
                {item.value}
              </Label>
            </DynamicTag>
          )
        })}
    </ul>
  )
}
