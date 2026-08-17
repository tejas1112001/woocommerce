import React, { useState } from "react"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface ChartDataPoint {
  date: string
  sales: number
  orders: number
}

interface SalesChartProps {
  data: ChartDataPoint[]
  isLoading: boolean
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  const [chartType, setChartType] = useState<"area" | "bar">("area")
  const [activeMetric, setActiveMetric] = useState<"sales" | "orders">("sales")

  if (isLoading) {
    return (
      <Container className="p-6 h-[380px] animate-pulse bg-ui-bg-subtle border border-ui-border-base rounded-lg flex flex-col justify-between">
        <div className="h-6 bg-ui-bg-component rounded w-1/4" />
        <div className="h-64 bg-ui-bg-component rounded w-full" />
      </Container>
    )
  }

  const formatTooltipValue = (value: number) => {
    if (activeMetric === "sales") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value)
    }
    return `${value} orders`
  }

  return (
    <Container className="p-4 sm:p-6 shadow-xs border border-ui-border-base rounded-lg bg-ui-bg-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
            Sales & Revenue Trend
          </Heading>
          <Text className="text-ui-fg-subtle text-xs">
            Performance over selected date range
          </Text>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="bg-ui-bg-base p-1 border border-ui-border-base rounded-md flex gap-1">
            <Button
              size="small"
              variant={activeMetric === "sales" ? "secondary" : "transparent"}
              onClick={() => setActiveMetric("sales")}
              className="text-xs"
            >
              Revenue (₹)
            </Button>
            <Button
              size="small"
              variant={activeMetric === "orders" ? "secondary" : "transparent"}
              onClick={() => setActiveMetric("orders")}
              className="text-xs"
            >
              Orders Count
            </Button>
          </div>

          {/* Chart Type Toggle */}
          <div className="bg-ui-bg-base p-1 border border-ui-border-base rounded-md flex gap-1">
            <Button
              size="small"
              variant={chartType === "area" ? "secondary" : "transparent"}
              onClick={() => setChartType("area")}
              className="text-xs"
            >
              Area
            </Button>
            <Button
              size="small"
              variant={chartType === "bar" ? "secondary" : "transparent"}
              onClick={() => setChartType("bar")}
              className="text-xs"
            >
              Bar
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full min-w-0">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  tickFormatter={(val) =>
                    activeMetric === "sales" ? `₹${val}` : `${val}`
                  }
                />
                <Tooltip
                  formatter={(val: any) => [formatTooltipValue(Number(val)), activeMetric === "sales" ? "Revenue" : "Orders"]}
                  labelStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderRadius: "8px",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={activeMetric}
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  tickFormatter={(val) =>
                    activeMetric === "sales" ? `₹${val}` : `${val}`
                  }
                />
                <Tooltip
                  formatter={(val: any) => [formatTooltipValue(Number(val)), activeMetric === "sales" ? "Revenue" : "Orders"]}
                  labelStyle={{ color: "#f4f4f5", fontWeight: 600 }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderRadius: "8px",
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                  }}
                />
                <Bar dataKey={activeMetric} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-ui-fg-muted text-sm border border-dashed border-ui-border-base rounded-md">
            No sales data recorded for the selected date range
          </div>
        )}
      </div>
    </Container>
  )
}
