import React from "react"
import { Select } from "@medusajs/ui"

export type DateRangePreset = "today" | "7d" | "30d" | "month" | "all"

interface DateRangePickerProps {
  value: DateRangePreset
  onChange: (preset: DateRangePreset) => void
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="w-[180px]">
      <Select size="small" value={value} onValueChange={(val) => onChange(val as DateRangePreset)}>
        <Select.Trigger className="bg-ui-bg-base">
          <Select.Value placeholder="Select Date Range" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="today">Today</Select.Item>
          <Select.Item value="7d">Last 7 Days</Select.Item>
          <Select.Item value="30d">Last 30 Days</Select.Item>
          <Select.Item value="month">This Month</Select.Item>
          <Select.Item value="all">All Time</Select.Item>
        </Select.Content>
      </Select>
    </div>
  )
}
