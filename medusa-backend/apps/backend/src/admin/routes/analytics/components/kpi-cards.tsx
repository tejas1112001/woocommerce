import React from "react"
import { Container, Heading, Text, Badge } from "@medusajs/ui"

interface KPICardsProps {
  metrics: {
    total_sales: number
    total_orders: number
    total_customers: number
    total_products: number
    average_order_value: number
    sales_trend_percentage: number
    orders_trend_percentage: number
  } | null
  isLoading: boolean
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, isLoading }) => {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Container key={i} className="p-4 animate-pulse bg-ui-bg-subtle border border-ui-border-base rounded-lg">
            <div className="h-4 bg-ui-bg-component rounded w-1/2 mb-3" />
            <div className="h-8 bg-ui-bg-component rounded w-3/4 mb-2" />
            <div className="h-3 bg-ui-bg-component rounded w-1/3" />
          </Container>
        ))}
      </div>
    )
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.total_sales),
      trend: metrics.sales_trend_percentage,
      subtext: "vs previous period",
    },
    {
      title: "Total Orders",
      value: metrics.total_orders.toLocaleString(),
      trend: metrics.orders_trend_percentage,
      subtext: "vs previous period",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(metrics.average_order_value),
      trend: null,
      subtext: "per completed order",
    },
    {
      title: "Total Customers",
      value: metrics.total_customers.toLocaleString(),
      trend: null,
      subtext: "registered accounts",
    },
    {
      title: "Active Products",
      value: metrics.total_products.toLocaleString(),
      trend: null,
      subtext: "in catalog",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <Container key={idx} className="p-5 flex flex-col justify-between shadow-xs border border-ui-border-base rounded-lg bg-ui-bg-subtle">
          <div>
            <Text className="text-ui-fg-subtle text-xs font-medium uppercase tracking-wider mb-1">
              {card.title}
            </Text>
            <Heading level="h2" className="text-2xl font-bold text-ui-fg-base tracking-tight">
              {card.value}
            </Heading>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Text className="text-ui-fg-muted text-xs">{card.subtext}</Text>
            {card.trend !== null && card.trend !== 0 && (
              <Badge
                color={card.trend > 0 ? "green" : "red"}
                size="small"
                className="font-medium"
              >
                {card.trend > 0 ? `+${card.trend}%` : `${card.trend}%`}
              </Badge>
            )}
          </div>
        </Container>
      ))}
    </div>
  )
}
