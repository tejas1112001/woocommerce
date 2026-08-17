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

import PaymentDetails from '../components/payment-details'

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
    <Box className="flex flex-col justify-center gap-6 small:gap-8">
      {/* Back button */}
      <Button variant="tonal" size="sm" asChild className="w-max">
        <LocalizedClientLink
          href="/account/orders"
          data-testid="back-to-overview-button"
        >
          <ArrowLeftIcon />
          Order history
        </LocalizedClientLink>
      </Button>

      {/* Order header */}
      <Box className="flex flex-col gap-1">
        <Heading as="h2" className="text-2xl small:text-3xl">
          Order #{order.display_id}
        </Heading>
        <Text className="text-md text-secondary">Placed on {formattedDate}</Text>
      </Box>

      {/* Order Tracking Progress Component */}
      <OrderProgress order={order} />

      {/* Order content */}
      <Box
        className="flex h-full w-full flex-col gap-4"
        data-testid="order-details-container"
      >
        <Items items={order.items} />
        <OrderSummary order={order} />
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />

        {/* Cancel Order Button - Shows only if order is cancellable */}
        <CancelOrderButton order={order} />
      </Box>
    </Box>
  )
}

export default OrderDetailsTemplate
