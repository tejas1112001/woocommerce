import React from "react"
import { Container, Heading, Text, Table, StatusBadge } from "@medusajs/ui"

interface RecentOrder {
  id: string
  display_id: string | number
  email: string
  total: number
  currency_code: string
  status: string
  payment_status: string
  fulfillment_status: string
  created_at: string
}

interface RecentOrdersTableProps {
  orders: RecentOrder[]
  isLoading: boolean
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders, isLoading }) => {
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string): "green" | "orange" | "red" | "blue" | "grey" => {
    switch (status.toLowerCase()) {
      case "completed":
        return "green"
      case "pending":
      case "requires_action":
        return "orange"
      case "canceled":
        return "red"
      case "processing":
        return "blue"
      default:
        return "grey"
    }
  }

  return (
    <Container className="p-4 sm:p-6 shadow-xs border border-ui-border-base rounded-lg bg-ui-bg-subtle overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
            Recent Orders Activity
          </Heading>
          <Text className="text-ui-fg-subtle text-xs">
            Live stream of latest incoming orders
          </Text>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-ui-bg-component rounded w-full" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Customer Email</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="text-right">Total Amount</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell className="font-semibold text-ui-fg-base">
                    <a
                      href={`/app/orders/${order.id}`}
                      className="hover:underline text-blue-500 font-mono"
                    >
                      #{order.display_id}
                    </a>
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle text-sm">
                    {order.email}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-muted text-xs">
                    {formatDate(order.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell className="text-right font-semibold text-ui-fg-base">
                    {formatCurrency(order.total, order.currency_code)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="py-8 text-center text-ui-fg-muted text-sm border border-dashed border-ui-border-base rounded-md">
          No recent orders found
        </div>
      )}
    </Container>
  )
}
