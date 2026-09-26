/**
 * Payment Error Message Utilities
 * Maps technical payment errors to user-friendly messages
 */

export interface PaymentError {
  message?: string
  error?: {
    description?: string
    code?: string
    source?: string
    step?: string
    reason?: string
  }
}

/**
 * Converts technical Razorpay/payment errors into customer-friendly messages
 */
export const getCustomerFriendlyError = (error: PaymentError): string => {
  const message = error?.message?.toLowerCase() || ''
  const description = error?.error?.description?.toLowerCase() || ''
  const code = error?.error?.code?.toLowerCase() || ''
  const reason = error?.error?.reason?.toLowerCase() || ''

  // International card not allowed / cross-border restriction
  if (
    reason.includes('international') ||
    description.includes('international') ||
    code === 'international_transaction_not_allowed'
  ) {
    return 'International cards are not supported for this store. Please use an Indian domestic card (for testing: Visa 4100 2800 0000 1007), UPI, or Netbanking.'
  }

  // Network errors
  if (
    message.includes('network') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    code === 'network_error'
  ) {
    return 'Network error. Please check your internet connection and try again.'
  }

  // Timeout errors
  if (
    message.includes('timeout') ||
    description.includes('timeout') ||
    code === 'gateway_error'
  ) {
    return 'Payment request timed out. Please try again.'
  }

  // Invalid card details
  if (description.includes('invalid') || code === 'invalid_card') {
    return 'Invalid card details. Please check your card information and try again.'
  }

  // Card expired
  if (description.includes('expired') || code === 'expired_card') {
    return 'Your card has expired. Please use a different card.'
  }

  // Card declined
  if (
    description.includes('declined') ||
    code === 'card_declined'
  ) {
    return 'Your card was declined. Please try a different payment method or contact your bank.'
  }

  // Insufficient funds
  if (
    description.includes('insufficient') ||
    code === 'insufficient_funds'
  ) {
    return 'Insufficient funds. Please check your account balance or use a different card.'
  }

  // Authentication/verification errors
  if (
    description.includes('authentication') ||
    description.includes('verification') ||
    code === 'authentication_failed'
  ) {
    return 'Payment authentication failed. Please try again or use a different payment method.'
  }

  // Processing errors
  if (code === 'processing_error') {
    return 'Payment processing error. Please try again in a few moments.'
  }

  // Generic bank error
  if (description.includes('bank') || code === 'bank_error') {
    return 'Bank declined the transaction. Please contact your bank or try a different payment method.'
  }

  // Razorpay service errors
  if (description.includes('razorpay')) {
    return 'Payment service is temporarily unavailable. Please try again shortly.'
  }

  // If Razorpay provided a specific description, show it
  if (error?.error?.description) {
    return error.error.description
  }

  // Generic fallback
  return 'Payment failed. Please try again or contact support if the problem persists.'
}

/**
 * Message shown when payment succeeds but order creation fails on the frontend.
 *
 * WHY THIS IS SAFE:
 * Even when cart.complete() times out on the browser side, the Razorpay webhook
 * (payment.captured → processPaymentWorkflow → completeCartAfterPaymentStep) will
 * create the order automatically on the backend. The customer WILL receive a
 * confirmation email once that happens — typically within seconds to a few minutes.
 *
 * Critical: do NOT say "contact support — we will complete manually."
 * That was inaccurate and alarming. The system handles recovery automatically.
 */
export const getNetworkFailureMessage = (paymentId: string): string => {
  const shortId = paymentId.slice(0, 20)
  return (
    `Your payment was successful (ID: ${shortId}...). ` +
    `Your order is being created — you will receive a confirmation email shortly. ` +
    `Do NOT pay again. ` +
    `If you do not receive an email within 10 minutes, please contact support with Payment ID: ${shortId}...`
  )
}

/**
 * Message shown when customer cancels the payment modal
 */
export const getCancellationMessage = (): string => {
  return 'Payment was cancelled. Your order was not placed. You can retry payment when ready.'
}
