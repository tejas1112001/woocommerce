'use server'

import { sdk } from '@lib/config'

import { getAuthHeaders } from './cookies'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), ms)
  )
  return Promise.race([promise, timeout])
}

export async function retrieveOrder(id: string) {
  const authHeaders = await getAuthHeaders()

  if (!('authorization' in authHeaders)) return null

  return withTimeout(
    sdk.store.order
      .retrieve(
        id,
        { fields: '*payment_collections.payments,+fulfillment_status' },
        { next: { tags: ['order'] }, ...authHeaders }
      )
      .then(({ order }) => order),
    8000
  ).catch(() => null)
}

export async function listOrders(limit: number = 10, offset: number = 0) {
  const authHeaders = await getAuthHeaders()

  if (!('authorization' in authHeaders)) {
    return { orders: [], count: 0 }
  }

  return withTimeout(
    sdk.store.order
      .list(
        { limit, offset },
        { next: { tags: ['order'] }, ...authHeaders }
      )
      .then(({ orders, count }) => ({ orders, count })),
    8000
  ).catch(() => ({ orders: [], count: 0 }))
}

/**
 * Cancel an order
 * @param orderId - The ID of the order to cancel
 * @returns Success status and message
 */
export async function cancelOrder(orderId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const authHeaders = await getAuthHeaders()

    if (!('authorization' in authHeaders)) {
      return {
        success: false,
        message: 'You must be logged in to cancel an order.',
      }
    }

    // Retrieve the order first to validate it belongs to the customer
    const order = await retrieveOrder(orderId)

    if (!order) {
      return {
        success: false,
        message: 'Order not found.',
      }
    }

    // Check if order is already cancelled
    if (order.status === 'canceled') {
      return {
        success: false,
        message: 'This order has already been cancelled.',
      }
    }

    // Check if order has been fulfilled
    const fulfillmentStatus = (order as any).fulfillment_status
    if (
      fulfillmentStatus &&
      fulfillmentStatus !== 'not_fulfilled' &&
      fulfillmentStatus !== 'canceled'
    ) {
      return {
        success: false,
        message:
          'This order cannot be cancelled as it has already been processed for shipment.',
      }
    }

    // Cancel the order using Medusa SDK / custom endpoint
    if (typeof (sdk.store.order as any).cancel === 'function') {
      await (sdk.store.order as any).cancel(orderId, {}, authHeaders)
    } else {
      await sdk.client.fetch(`/store/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: authHeaders as Record<string, string>,
      })
    }

    // Revalidate the order cache
    const { revalidateTag } = await import('next/cache')
    revalidateTag('order', 'max')

    return {
      success: true,
      message:
        'Your order has been cancelled successfully. If you made a prepaid payment, a refund will be processed within 5-7 business days.',
    }
  } catch (error: any) {
    console.error('[Order] Cancellation failed:', {
      orderId,
      error: error.message,
      timestamp: new Date().toISOString(),
    })

    // Handle specific error cases
    if (error.message?.includes('not found')) {
      return {
        success: false,
        message: 'Order not found.',
      }
    }

    if (error.message?.includes('already')) {
      return {
        success: false,
        message: 'This order has already been cancelled.',
      }
    }

    if (error.message?.includes('cannot be cancelled')) {
      return {
        success: false,
        message: 'This order cannot be cancelled at this time.',
      }
    }

    return {
      success: false,
      message:
        'Failed to cancel the order. Please contact support if this issue persists.',
    }
  }
}
