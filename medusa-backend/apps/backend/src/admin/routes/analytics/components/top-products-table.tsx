import React from "react"
import { Container, Heading, Text, Table } from "@medusajs/ui"

interface ProductItem {
  id: string
  title: string
  thumbnail: string | null
  units_sold: number
  total_revenue: number
}

interface TopProductsTableProps {
  products: ProductItem[]
  isLoading: boolean
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products, isLoading }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <Container className="p-4 sm:p-6 shadow-xs border border-ui-border-base rounded-lg bg-ui-bg-subtle flex flex-col justify-between overflow-hidden">
      <div>
        <Heading level="h2" className="text-lg font-semibold text-ui-fg-base mb-1">
          Top Selling Products
        </Heading>
        <Text className="text-ui-fg-subtle text-xs mb-4">
          Best performing catalog items by volume & revenue
        </Text>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-ui-bg-component rounded w-full" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Product</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Units Sold</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">Revenue</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {products.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-medium text-ui-fg-base">
                      <div className="flex items-center gap-3">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-8 h-8 rounded object-cover border border-ui-border-base shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-ui-bg-component flex items-center justify-center text-xs text-ui-fg-subtle font-bold shrink-0">
                            {item.title.charAt(0)}
                          </div>
                        )}
                        <span className="truncate max-w-[180px]" title={item.title}>
                          {item.title}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-right font-medium">
                      {item.units_sold}
                    </Table.Cell>
                    <Table.Cell className="text-right font-semibold text-ui-fg-base">
                      {formatCurrency(item.total_revenue)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-ui-fg-muted text-sm border border-dashed border-ui-border-base rounded-md">
            No sales data recorded yet
          </div>
        )}
      </div>
    </Container>
  )
}
