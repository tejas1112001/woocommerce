import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <Box className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5">
      <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
        Delivery Details
      </h3>
      {order.shipping_address ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          <div className="space-y-1">
            <p className="font-semibold text-neutral-900 dark:text-white">
              {order.shipping_address.first_name} {order.shipping_address.last_name}
            </p>
            {order.shipping_address.company && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {order.shipping_address.company}
              </p>
            )}
            <p className="text-neutral-600 dark:text-neutral-400">{order.shipping_address.address_1}</p>
            {order.shipping_address.address_2 && (
              <p className="text-neutral-600 dark:text-neutral-400">{order.shipping_address.address_2}</p>
            )}
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.shipping_address.city}
              {order.shipping_address.province ? `, ${order.shipping_address.province}` : ''}
              {order.shipping_address.postal_code ? ` - ${order.shipping_address.postal_code}` : ''}
            </p>
            <p className="font-medium text-neutral-900 dark:text-white uppercase text-xs">
              {order.shipping_address.country_code?.toUpperCase()}
            </p>
          </div>
          <div className="space-y-2 sm:border-l sm:border-neutral-100 dark:sm:border-neutral-800 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Recipient Contact
              </p>
              {order.shipping_address.phone && (
                <p className="text-neutral-700 dark:text-neutral-300">
                  Phone: <span className="font-medium text-neutral-900 dark:text-white">{order.shipping_address.phone}</span>
                </p>
              )}
              <p className="text-neutral-700 dark:text-neutral-300">
                Email: <span className="font-medium text-neutral-900 dark:text-white">{order.email}</span>
              </p>
            </div>
            {order.shipping_methods && order.shipping_methods[0] && (
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Shipping Method
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.shipping_methods[0].name}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-400 italic">No shipping details available</p>
      )}
    </Box>
  )
}

export default ShippingDetails
