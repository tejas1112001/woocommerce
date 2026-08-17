import { XIcon } from '@modules/common/icons/x'

type ActiveFilterItemProps = {
  label: string
  filterKey: string
  options: {
    id: string
    value: string
  }[]
  handleRemoveFilter: (filterKey: string, handle: string) => void
}

export default function ActiveFilterItem({
  label,
  filterKey,
  options,
  handleRemoveFilter,
}: ActiveFilterItemProps) {
  return (
    <>
      {options
        ?.sort((a, b) =>
          label !== 'Price' ? a.value.localeCompare(b.value) : 0
        )
        .map((option, id) => (
          <button
            key={id}
            type="button"
            onClick={() => handleRemoveFilter(filterKey, option.id)}
            aria-label={`Remove ${label}: ${option.value}`}
            className="group flex h-7 items-center gap-1.5 rounded-full border border-[#6B0014]/30 bg-[#6B0014]/10 px-3 text-xs font-semibold text-[#6B0014] transition-all duration-150 hover:border-red-600 hover:bg-red-50 hover:text-red-600 shadow-2xs cursor-pointer"
          >
            <span className="max-w-[120px] truncate">{option.value}</span>
            <XIcon className="h-3 w-3 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
    </>
  )
}
