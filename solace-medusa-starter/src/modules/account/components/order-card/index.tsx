import { getFulfillmentStatus, getOrderStatus } from '@lib/util/format-order'
import { getPaymentStatusLabel } from '@lib/constants'
import { convertToLocale } from '@lib/util/money'
import { getLocalizedPath } from '@lib/util/urls'
import { HttpTypes } from '@medusajs/types'
import { Badge } from '@modules/common/components/badge'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'

import Thumbnail from './thumbnail'

function getStatusBadgeVariant(
  status: string
): 'basic' | 'brand' | 'green' | 'red' | 'outline' {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'green'
    case 'canceled':
    case 'requires_action':
      return 'red'
    case 'pending':
    case 'not_fulfilled':
      return 'outline'
    default:
      return 'brand'
  }
}

export default function OrderCard({
  order,
}: {
  order: HttpTypes.StoreOrder & { status: string }
}) {
  const countryCode = order.shipping_address?.country_code
  const orderStatus = getOrderStatus(order.status) ?? order.status
  const fulfillmentStatus = getFulfillmentStatus(
    (order as any).fulfillment_status
  )

  const paymentStatus =
    order.payment_collections?.[0]?.status ?? order.payment_status

  return (
    <Box className="flex flex-col bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header row */}
      <Box className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/80 px-4 py-3 large:px-5 bg-neutral-50/50 dark:bg-neutral-900/30">
        <Box className="flex flex-wrap items-center gap-3">
          <Text className="font-semibold text-neutral-900 dark:text-white text-sm">
            Order #{order.display_id}
          </Text>
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            Placed on{' '}
            {new Date(order.created_at)
              .toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              .replace('.', '')}
          </Text>
        </Box>
        <Box className="flex flex-wrap items-center gap-1.5">
          <Badge
            label={orderStatus}
            variant={getStatusBadgeVariant(order.status)}
          />
          {fulfillmentStatus && (
            <Badge
              label={fulfillmentStatus}
              variant={getStatusBadgeVariant(
                (order as any).fulfillment_status ?? ''
              )}
            />
          )}
          {paymentStatus && (
            <Badge
              label={getPaymentStatusLabel(paymentStatus)}
              variant={getStatusBadgeVariant(paymentStatus)}
            />
          )}
        </Box>
      </Box>

      {/* Body row */}
      <Box className="flex flex-col gap-4 p-4 large:flex-row large:items-center large:justify-between large:p-5">
        {/* Thumbnails */}
        <Box className="flex flex-wrap items-center gap-2.5">
          {order.items.slice(0, 3).map((item, index) => (
            <Thumbnail
              key={index}
              thumbnail={item.thumbnail || (item as any).variant?.product?.thumbnail || (item as any).variant?.thumbnail}
              href={getLocalizedPath(`/products/${item.product_handle}`, countryCode)}
              size="big"
            />
          ))}
          {order.items.length > 3 && (
            <Thumbnail
              more={`+${order.items.length - 3}`}
              href={getLocalizedPath(`/account/orders/details/${order.id}`, countryCode)}
              size="big"
            />
          )}
        </Box>

        {/* Price + action */}
        <Box className="flex items-center justify-between gap-4 large:flex-col large:items-end">
          <Box className="flex flex-col items-start large:items-end">
            <Text className="text-xs text-neutral-500 dark:text-neutral-400">
              Total Amount
            </Text>
            <Text className="text-base font-bold text-neutral-900 dark:text-white">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </Text>
          </Box>
          <Box className="flex flex-wrap gap-2 items-center justify-end">
            <Button variant="text" size="sm" asChild className="w-max">
              <LocalizedClientLink href={`/account/orders/invoice/${order.id}`}>
                Invoice
              </LocalizedClientLink>
            </Button>
            <Button variant="tonal" size="sm" asChild className="w-max">
              <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                View details &rarr;
              </LocalizedClientLink>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

