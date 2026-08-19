'use client'

import React, { createContext, useCallback } from 'react'

import { isPaypal, isStripe } from '@lib/constants'
import { getLocalizedPath } from '@lib/util/urls'
import { HttpTypes } from '@medusajs/types'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { loadStripe } from '@stripe/stripe-js'
import { useParams, useRouter } from 'next/navigation'

import StripeWrapper from './stripe-wrapper'

type WrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

export const StripeContext = createContext(false)
export const CheckoutContext = createContext<{
  completedOrder: any | null
  onOrderCompleted: (order: any) => void
} | null>(null)

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || 'in'

  // Navigate to the dedicated order-confirmed page instead of showing an
  // in-page modal. The modal approach caused a 404 because placeOrder() calls
  // revalidateTag('cart') + removeCartId(), which triggers a Next.js
  // re-render of checkout/page.tsx → fetchCart() returns null → notFound().
  const onOrderCompleted = useCallback(
    (order: any) => {
      router.push(getLocalizedPath(`/order/confirmed/${order.id}`, countryCode))
    },
    [router, countryCode]
  )

  const content = (
    <CheckoutContext.Provider
      value={{
        completedOrder: null,
        onOrderCompleted,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === 'pending'
  )

  if (
    isStripe(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeContext.Provider value={true}>
        <StripeWrapper
          paymentSession={paymentSession}
          stripeKey={stripeKey}
          stripePromise={stripePromise}
        >
          {content}
        </StripeWrapper>
      </StripeContext.Provider>
    )
  }

  if (
    isPaypal(paymentSession?.provider_id) &&
    paypalClientId !== undefined &&
    cart
  ) {
    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
          currency: cart?.currency_code.toUpperCase(),
          intent: 'authorize',
          components: 'buttons',
        }}
      >
        {content}
      </PayPalScriptProvider>
    )
  }

  return content
}

export default Wrapper

