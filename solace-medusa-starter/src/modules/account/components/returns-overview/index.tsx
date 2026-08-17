import { HttpTypes } from '@medusajs/types'
import { convertToLocale } from '@lib/util/money'
import { Badge } from '@modules/common/components/badge'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { RefreshIcon } from '@modules/common/icons'

export type OrderWithReturns = HttpTypes.StoreOrder & {
  status: string
  returns?: Array<{
    id: string
    status: string
    created_at: string
    refund_amount?: number
    items?: Array<{
      item_id: string
      quantity: number
      reason?: { label?: string }
      note?: string
    }>
  }>
  refunds?: Array<{
    id: string
    amount: number
    created_at: string
    note?: string
  }>
}

function getReturnStatusVariant(
  status: string
): 'basic' | 'brand' | 'green' | 'red' | 'outline' {
  switch (status?.toLowerCase()) {
    case 'received':
    case 'completed':
      return 'green'
    case 'canceled':
    case 'requires_action':
      return 'red'
    case 'requested':
    case 'pending':
      return 'outline'
    default:
      return 'brand'
  }
}

const ReturnCard = ({
  order,
  returnItem,
}: {
  order: OrderWithReturns
  returnItem: NonNullable<OrderWithReturns['returns']>[number]
}) => {
  const formattedDate = new Date(returnItem.created_at).toLocaleDateString(
    'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  )

  return (
    <Box className="flex flex-col bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header */}
      <Box className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 px-4 py-3 large:px-5 bg-neutral-50/50 dark:bg-neutral-900/30">
        <Box className="flex flex-wrap items-center gap-3">
          <Text className="font-semibold text-neutral-900 dark:text-white text-sm">
            Return for Order #{order.display_id}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            Requested on {formattedDate}
          </Text>
        </Box>
        <Badge
          label={
            returnItem.status.charAt(0).toUpperCase() +
            returnItem.status.slice(1)
          }
          variant={getReturnStatusVariant(returnItem.status)}
        />
      </Box>

      {/* Body */}
      <Box className="flex flex-col gap-3 p-4 large:p-5">
        {returnItem.items && returnItem.items.length > 0 && (
          <Box className="flex flex-col gap-1.5">
            <Text className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {returnItem.items.length}{' '}
              {returnItem.items.length === 1 ? 'item' : 'items'} in return request
            </Text>
            {returnItem.items.map((ri, i) => {
              const orderItem = order.items?.find((oi) => oi.id === ri.item_id)
              return (
                <Box
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800"
                >
                  <Text className="text-sm font-medium text-neutral-900 dark:text-white">
                    {orderItem?.product_title ?? ri.item_id}{' '}
                    <span className="text-neutral-500 font-normal">x{ri.quantity}</span>
                  </Text>
                  {ri.reason?.label && (
                    <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                      Reason: {ri.reason.label}
                    </Text>
                  )}
                </Box>
              )
            })}
          </Box>
        )}
        {returnItem.refund_amount != null && (
          <Box className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              Estimated Refund Amount
            </Text>
            <Text className="text-base font-bold text-neutral-900 dark:text-white">
              {convertToLocale({
                amount: returnItem.refund_amount,
                currency_code: order.currency_code,
              })}
            </Text>
          </Box>
        )}
        <Box className="flex justify-end pt-1">
          <Button variant="tonal" size="sm" asChild className="w-max">
            <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
              View order details &rarr;
            </LocalizedClientLink>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const ReturnsOverview = ({ orders }: { orders: OrderWithReturns[] }) => {
  // Collect all orders that have returns
  const ordersWithReturns = orders.filter(
    (o) => o.returns && o.returns.length > 0
  )

  if (ordersWithReturns.length === 0) {
    return (
      <Box
        className="flex w-full flex-col items-center gap-6 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center shadow-xs"
        data-testid="no-returns-container"
      >
        <Box className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
          <RefreshIcon className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
        </Box>
        <Box className="flex flex-col items-center gap-2">
          <Heading as="h1" className="text-xl text-neutral-900 dark:text-white font-semibold">
            No returns or refunds
          </Heading>
          <Text className="max-w-[438px] text-center text-sm text-neutral-500 dark:text-neutral-400">
            You currently have no active return or refund requests. Returns become available after placing an order.
          </Text>
          <Button variant="filled" size="sm" asChild className="mt-3">
            <LocalizedClientLink href="/shop">Explore shop</LocalizedClientLink>
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex items-center justify-between">
        <Heading as="h1" className="text-xl small:text-2xl font-bold">
          Returns &amp; Refunds
        </Heading>
        <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {ordersWithReturns.reduce(
            (acc, o) => acc + (o.returns?.length ?? 0),
            0
          )}{' '}
          request(s)
        </Text>
      </Box>
      <Box className="flex flex-col gap-4">
        {ordersWithReturns.flatMap((order) =>
          (order.returns ?? []).map((ret) => (
            <ReturnCard key={ret.id} order={order} returnItem={ret} />
          ))
        )}
      </Box>
    </Box>
  )
}

export default ReturnsOverview

