'use server'

import { cache } from 'react'

import { sdk } from '@lib/config'
import { getAuthHeaders } from './cookies'

// Shipping actions
export const listCartPaymentMethods = cache(async function (regionId: string) {
  return sdk.store.payment
    .listPaymentProviders(
      { region_id: regionId },
      { next: { tags: ['payment_providers'] } }
    )
    .then(({ payment_providers }) => payment_providers)
    .catch(() => {
      return null
    })
})

/**
 * verifyRazorpayPayment
 *
 * Server action that calls the backend payment-verification endpoint.
 * The backend re-computes the HMAC-SHA256 signature using the secret key
 * (which lives only on the server) and confirms the payment was genuine.
 *
 * WHY IT MUST BE A SERVER ACTION:
 * - The backend URL is server-side (no CORS issue)
 * - We forward the auth cookie so Medusa can identify the customer
 * - The secret key is never sent to the browser
 *
 * @returns { verified: true } on success, throws on failure
 */
export async function verifyRazorpayPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}: {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}): Promise<{ verified: boolean }> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

  const authHeaders = await getAuthHeaders()

  const response = await fetch(
    `${backendUrl}/store/custom/razorpay-verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth token so the backend can identify the customer session
        ...('authorization' in authHeaders
          ? { Authorization: authHeaders.authorization }
          : {}),
        // Required Medusa publishable key header
        'x-publishable-api-key':
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
    }
  )

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      body?.error ||
        `Payment verification failed with status ${response.status}`
    )
  }

  return response.json()
}

