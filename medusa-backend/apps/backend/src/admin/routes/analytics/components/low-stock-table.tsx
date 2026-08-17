import React from "react"
import { Container, Heading, Text, Table, Badge } from "@medusajs/ui"

interface LowStockItem {
  id: string
  sku: string
  title: string
  stocked_quantity: number
  reserved_quantity: number
}

interface LowStockTableProps {
  items: LowStockItem[]
  isLoading: boolean
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ items, isLoading }) => {
  return (
    <Container className="p-4 sm:p-6 shadow-xs border border-ui-border-base rounded-lg bg-ui-bg-subtle flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Heading level="h2" className="text-lg font-semibold text-ui-fg-base">
            Low Stock Inventory Alerts
          </Heading>
          {items && items.length > 0 && (
            <Badge color="orange" size="small">
              {items.length} Alerts
            </Badge>
          )}
        </div>
        <Text className="text-ui-fg-subtle text-xs mb-4">
          Inventory items at or below safety stock threshold
        </Text>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-ui-bg-component rounded w-full" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>SKU</Table.HeaderCell>
                  <Table.HeaderCell>Item Title</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Stock Level</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.map((item) => {
                  const isOut = item.stocked_quantity <= 0
                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell className="font-mono text-xs text-ui-fg-subtle">
                        {item.sku}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-ui-fg-base max-w-[160px] truncate" title={item.title}>
                        {item.title}
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <Badge color={isOut ? "red" : "orange"} size="small">
                          {isOut ? "Out of Stock" : `${item.stocked_quantity} left`}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-ui-fg-muted text-sm border border-dashed border-ui-border-base rounded-md flex flex-col items-center gap-1">
            <span className="text-emerald-500 font-medium">✓ All items adequately stocked</span>
            <span className="text-xs text-ui-fg-muted">No inventory items below threshold</span>
          </div>
        )}
      </div>
    </Container>
  )
}
