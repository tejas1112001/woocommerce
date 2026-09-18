import React from 'react'

import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ArrowLeftIcon } from '@modules/common/icons'
import Items from '@modules/order/components/items'
import OrderSummary from '@modules/order/components/order-summary'
import ShippingDetails from '@modules/order/components/shipping-details'
import CancelOrderButton from '@modules/order/components/cancel-order-button'
import OrderProgress from '@modules/order/components/order-progress'

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder & { status: string }
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <Box className="flex flex-col gap-4 small:gap-6">
      {/* Top Header & Navigation */}
      <Box className="flex items-center justify-between gap-3">
        <Button variant="tonal" size="sm" asChild className="w-max h-8 text-xs small:text-sm px-3">
          <LocalizedClientLink
            href="/account/orders"
            data-testid="back-to-overview-button"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Order history
          </LocalizedClientLink>
        </Button>
        <Button variant="tonal" size="sm" asChild className="w-max h-8 text-xs small:text-sm px-3">
          <LocalizedClientLink href={`/account/orders/invoice/${order.id}`}>
            Invoice &rarr;
          </LocalizedClientLink>
        </Button>
      </Box>

      {/* Order header */}
      <Box className="flex flex-col gap-0.5">
        <Heading as="h1" className="!text-xl small:!text-2xl !font-bold text-neutral-900 dark:text-white">
          Order #{order.display_id}
        </Heading>
        <Text className="text-xs small:text-sm text-secondary">Placed on {formattedDate}</Text>
      </Box>

      {/* Order Tracking Progress Component */}
      <OrderProgress order={order} />

      {/* Main Order Content: 2-Column Desktop Grid / 1-Column Mobile */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 small:gap-6 items-start"
        data-testid="order-details-container"
      >
        {/* Left Column: Items & Delivery */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 small:gap-6">
          <Items items={order.items} />
          <ShippingDetails order={order} />
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 small:gap-6 lg:sticky lg:top-24">
          <OrderSummary order={order} />
          <CancelOrderButton order={order} />
        </div>
      </div>
    </Box>
  )
}

export default OrderDetailsTemplate
