/**
 * Order Status Formatting Utilities
 * Converts technical order/fulfillment statuses to customer-friendly labels
 */

/**
 * Maps technical order statuses to customer-friendly labels
 * Uses active, positive language instead of technical terms
 */
export const getCustomerFriendlyOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Processing',
    completed: 'Completed',
    canceled: 'Cancelled',
    cancelled: 'Cancelled', // Handle both spellings
    requires_action: 'Action Required',
  }
  return statusMap[status.toLowerCase()] || status
}

/**
 * Maps technical fulfillment statuses to customer-friendly labels
 * Hides internal states like "not_fulfilled" in favor of customer-facing terms
 */
export const getCustomerFriendlyFulfillmentStatus = (
  status?: string
): string => {
  if (!status) return 'Preparing'

  const statusMap: Record<string, string> = {
    not_fulfilled: 'Preparing',
    fulfilled: 'Shipped',
    partially_fulfilled: 'Partially Shipped',
    shipped: 'Shipped',
    delivered: 'Delivered',
    canceled: 'Cancelled',
    cancelled: 'Cancelled', // Handle both spellings
  }
  return statusMap[status.toLowerCase()] || status
}

/**
 * Existing functions - keep for backward compatibility
 */
export function getOrderStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'archived':
      return 'Archived'
    case 'canceled':
      return 'Cancelled'
    case 'requires_action':
      return 'Requires action'
    default:
      return status
  }
}

export function getFulfillmentStatus(status: string): string {
  switch (status) {
    case 'not_fulfilled':
      return 'Not fulfilled'
    case 'fulfilled':
      return 'Fulfilled'
    case 'partially_fulfilled':
      return 'Partially fulfilled'
    case 'returned':
      return 'Returned'
    case 'partially_returned':
      return 'Partially returned'
    case 'shipped':
      return 'Shipped'
    case 'partially_shipped':
      return 'Partially shipped'
    case 'canceled':
      return 'Cancelled'
    case 'requires_action':
      return 'Requires action'
    default:
      return status
  }
}
