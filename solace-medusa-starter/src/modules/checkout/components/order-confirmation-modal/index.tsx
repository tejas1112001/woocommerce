'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { convertToLocale } from '@lib/util/money'
import { CheckCircleIcon } from '@modules/common/icons'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import Divider from '@modules/common/components/divider'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@modules/common/components/dialog'

type OrderConfirmationModalProps = {
  order: any
  isOpen: boolean
  onClose: () => void
}

export default function OrderConfirmationModal({
  order,
  isOpen,
  onClose,
}: OrderConfirmationModalProps) {
  const params = useParams()
  const countryCode = (params.countryCode as string) || 'in'

  const getAmount = (amount?: number | null) => {
    if (amount === undefined || amount === null) return '-'
    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  const handleGoHome = () => {
    window.location.href = `/${countryCode}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="max-h-full max-w-[700px] !rounded-none small:max-h-[90vh] small:max-w-[700px]"
          aria-describedby={undefined}
        >
          <DialogHeader className="flex flex-col items-center text-center p-6 border-b-[0.5px]">
            <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
            <Heading as="h1" className="text-2xl font-bold text-basic-primary">
              Order Placed Successfully!
            </Heading>
            <Text className="text-secondary mt-1">
              Thank you for your purchase. Your order number is{' '}
              <span className="font-semibold text-basic-primary">#{order.display_id}</span>
            </Text>
            <DialogTitle className="sr-only">Order Confirmation Modal</DialogTitle>
          </DialogHeader>

          <DialogBody className="overflow-y-auto p-6 flex flex-col gap-6">
            {/* Order Items Summary */}
            <div>
              <Heading as="h3" className="text-lg font-semibold text-basic-primary mb-3">
                Order Summary
              </Heading>
              <div className="flex flex-col gap-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 text-md">
                    <div className="flex flex-col">
                      <span className="font-medium text-basic-primary">{item.title}</span>
                      {item.variant?.title && item.variant.title !== 'Default Variant' && (
                        <span className="text-xs text-secondary">
                          Variant: {item.variant.title}
                        </span>
                      )}
                      <span className="text-xs text-secondary">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-medium text-basic-primary">
                      {getAmount(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Address Details */}
            <div className="grid grid-cols-1 small:grid-cols-2 gap-6 text-sm">
              <div>
                <Heading as="h4" className="font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Shipping Address
                </Heading>
                {order.shipping_address ? (
                  <div className="text-secondary leading-relaxed">
                    <p className="font-medium text-basic-primary">
                      {order.shipping_address.first_name} {order.shipping_address.last_name}
                    </p>
                    {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>
                      {order.shipping_address.city}
                      {order.shipping_address.province ? `, ${order.shipping_address.province}` : ''}
                      {order.shipping_address.postal_code ? ` ${order.shipping_address.postal_code}` : ''}
                    </p>
                    <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                    {order.shipping_address.phone && (
                      <p className="mt-1 text-xs">Phone: {order.shipping_address.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-secondary">No shipping address provided</p>
                )}
              </div>

              <div>
                <Heading as="h4" className="font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Billing Address
                </Heading>
                {order.billing_address ? (
                  <div className="text-secondary leading-relaxed">
                    <p className="font-medium text-basic-primary">
                      {order.billing_address.first_name} {order.billing_address.last_name}
                    </p>
                    {order.billing_address.company && <p>{order.billing_address.company}</p>}
                    <p>{order.billing_address.address_1}</p>
                    {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
                    <p>
                      {order.billing_address.city}
                      {order.billing_address.province ? `, ${order.billing_address.province}` : ''}
                      {order.billing_address.postal_code ? ` ${order.billing_address.postal_code}` : ''}
                    </p>
                    <p>{order.billing_address.country_code?.toUpperCase()}</p>
                  </div>
                ) : (
                  <p className="text-secondary italic">Same as shipping address</p>
                )}
              </div>
            </div>

            <Divider />

            {/* Totals Summary */}
            <div className="flex justify-end text-sm">
              <div className="w-64 flex flex-col gap-2">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>{getAmount(order.item_total)}</span>
                </div>
                {(order.discount_total ?? 0) > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>- {getAmount(order.discount_total)}</span>
                  </div>
                )}
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span>{getAmount(order.shipping_total)}</span>
                </div>
                {(order.tax_total ?? 0) > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Tax</span>
                    <span>{getAmount(order.tax_total)}</span>
                  </div>
                )}
                <Divider className="my-1" />
                <div className="flex justify-between font-bold text-lg text-basic-primary">
                  <span>Total</span>
                  <span>{getAmount(order.total)}</span>
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex flex-col small:flex-row gap-3 justify-between items-center p-6 border-t-[0.5px]">
            <Button
              variant="tonal"
              onClick={handleGoHome}
              className="w-full small:w-auto"
            >
              Go to Homepage
            </Button>
            <div className="flex w-full small:w-auto gap-3 justify-end">
              <LocalizedClientLink
                href={`/account/orders/invoice/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm transition-colors text-sm w-full small:w-auto text-center"
              >
                Download Invoice
              </LocalizedClientLink>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
