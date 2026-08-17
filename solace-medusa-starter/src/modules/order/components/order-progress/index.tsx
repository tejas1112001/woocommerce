'use client'

import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { getCustomerFriendlyOrderStatus } from '@lib/util/format-order'
import { Box } from '@modules/common/components/box'
import { Text } from '@modules/common/components/text'
import { Badge } from '@modules/common/components/badge'

type OrderProgressProps = {
  order: HttpTypes.StoreOrder & { status: string }
}

type StepState = 'completed' | 'current' | 'inactive'

interface Step {
  id: string
  label: string
  state: StepState
  date: string | null
  icon: React.ReactNode
}

const formatDate = (dateStr?: string | Date | null): string | null => {
  if (!dateStr) return null
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

// Custom SVG Icons for Tracker Steps
const PlacedIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
)

const PaymentIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
)

const PreparingIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
)

const ShippedIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6 0a1 1 0 102 0m-2 0a1 1 0 112 0m6 0a1 1 0 102 0m-2 0a1 1 0 112 0"
    />
  </svg>
)

const DeliveredIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

const CheckMarkIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const OrderProgress: React.FC<OrderProgressProps> = ({ order }) => {
  const isCancelled =
    order.status?.toLowerCase() === 'canceled' ||
    order.status?.toLowerCase() === 'cancelled' ||
    (order as any).fulfillment_status?.toLowerCase() === 'canceled'

  const paymentStatus = (
    order.payment_collections?.[0]?.status ??
    order.payment_status ??
    ''
  ).toLowerCase()
  const isPaid =
    ['captured', 'authorized', 'paid'].includes(paymentStatus) ||
    order.status?.toLowerCase() === 'completed'

  const fulfillmentStatus = (
    (order as any).fulfillment_status ?? ''
  ).toLowerCase()
  const fulfillments = (order as any).fulfillments || []

  const isShipped =
    ['shipped', 'delivered'].includes(fulfillmentStatus) ||
    order.status?.toLowerCase() === 'completed' ||
    fulfillments.some((f: any) => f.shipped_at || f.delivered_at)

  const isDelivered =
    fulfillmentStatus === 'delivered' ||
    order.status?.toLowerCase() === 'completed' ||
    fulfillments.some((f: any) => f.delivered_at)

  const isPreparing =
    isPaid &&
    !isShipped &&
    !isDelivered &&
    (fulfillments.length > 0 ||
      ['not_fulfilled', 'fulfilled', 'partially_fulfilled', ''].includes(
        fulfillmentStatus
      ))

  // Determine step states
  // Step 1: Order Placed
  const step1State: StepState = 'completed'
  const step1Date = formatDate(order.created_at)

  // Step 2: Payment Confirmed
  let step2State: StepState = 'inactive'
  if (isPaid) {
    step2State = 'completed'
  } else if (!isCancelled) {
    step2State = 'current'
  }
  const step2Date = isPaid
    ? formatDate(
        order.payment_collections?.[0]?.updated_at ?? order.created_at
      )
    : null

  // Step 3: Preparing
  let step3State: StepState = 'inactive'
  if (isShipped || isDelivered) {
    step3State = 'completed'
  } else if (isPreparing && !isCancelled) {
    step3State = 'current'
  } else if (isPaid && !isCancelled) {
    step3State = 'completed'
  }
  const step3Date =
    step3State !== 'inactive'
      ? formatDate(fulfillments[0]?.created_at ?? order.created_at)
      : null

  // Step 4: Shipped
  let step4State: StepState = 'inactive'
  if (isDelivered) {
    step4State = 'completed'
  } else if (isShipped && !isCancelled) {
    step4State = 'current'
  }
  const step4Date =
    isShipped || isDelivered
      ? formatDate(fulfillments[0]?.shipped_at ?? fulfillments[0]?.created_at)
      : null

  // Step 5: Delivered
  let step5State: StepState = 'inactive'
  if (isDelivered) {
    step5State = 'completed'
  } else if (isShipped && !isCancelled && !isDelivered) {
    step5State = 'inactive'
  }
  const step5Date = isDelivered
    ? formatDate(
        fulfillments[0]?.delivered_at ?? order.updated_at ?? order.created_at
      )
    : null

  const steps: Step[] = [
    {
      id: 'placed',
      label: 'Order Placed',
      state: step1State,
      date: step1Date,
      icon: <PlacedIcon />,
    },
    {
      id: 'payment',
      label: 'Payment Confirmed',
      state: step2State,
      date: step2Date,
      icon: <PaymentIcon />,
    },
    {
      id: 'preparing',
      label: 'Preparing',
      state: step3State,
      date: step3Date,
      icon: <PreparingIcon />,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      state: step4State,
      date: step4Date,
      icon: <ShippedIcon />,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      state: step5State,
      date: step5Date,
      icon: <DeliveredIcon />,
    },
  ]

  // Calculate progress percentage for connector line
  const lastCompletedIndex = steps.reduce(
    (acc, step, idx) => (step.state === 'completed' ? idx : acc),
    0
  )
  const currentStepIndex = steps.findIndex((step) => step.state === 'current')
  const activeProgressIndex =
    currentStepIndex !== -1 ? currentStepIndex : lastCompletedIndex

  const progressPercentage = isCancelled
    ? 0
    : Math.min(100, Math.max(0, (activeProgressIndex / (steps.length - 1)) * 100))

  const friendlyStatus = getCustomerFriendlyOrderStatus(order.status)

  return (
    <Box className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 small:p-6 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <Box className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/60">
        <Box className="flex items-center gap-2.5">
          <Box className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
          <Text className="text-base font-semibold text-primary">
            Order Progress
          </Text>
        </Box>
        <Box className="flex items-center gap-2">
          <Text className="text-xs text-secondary hidden small:inline">
            Status:
          </Text>
          <Badge
            label={isCancelled ? 'Cancelled' : friendlyStatus}
            variant={isCancelled ? 'red' : isDelivered ? 'green' : 'brand'}
          />
        </Box>
      </Box>

      {/* Cancelled Banner if Order is Cancelled */}
      {isCancelled && (
        <Box className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Text className="text-sm font-medium text-red-700 dark:text-red-400">
            This order has been cancelled.
          </Text>
        </Box>
      )}

      {/* Mobile Swipe Hint */}
      <Box className="flex items-center justify-end sm:hidden px-1 -mb-2">
        <Text className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          <span>Swipe to track</span>
          <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Text>
      </Box>

      {/* Responsive Horizontal Tracker (Scrollable on mobile with segmented lines and generous padding) */}
      <Box className="w-full relative py-1">
        {/* Scrollable Container */}
        <Box className="overflow-x-auto no-scrollbar touch-pan-x py-2 px-2 sm:px-4">
          <Box className="flex items-start justify-between min-w-[580px] sm:min-w-full w-full px-4 sm:px-6">
            {steps.map((step, index) => {
              const isComp = step.state === 'completed'
              const isCurr = step.state === 'current'
              const isLast = index === steps.length - 1
              const nextStep = !isLast ? steps[index + 1] : null
              const isNextActive = nextStep?.state === 'completed' || nextStep?.state === 'current'

              return (
                <React.Fragment key={step.id}>
                  {/* Step Node Column */}
                  <Box
                    className="flex flex-col items-center text-center flex-shrink-0 w-24 sm:w-28 relative z-10"
                    aria-current={isCurr ? 'step' : undefined}
                  >
                    {/* Circle Node */}
                    <Box
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                        isComp
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md ring-4 ring-white dark:ring-neutral-950'
                          : isCurr
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg ring-4 ring-neutral-900/20 dark:ring-white/20'
                            : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 border border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {step.icon}

                      {/* Completed Checkmark Badge Overlay */}
                      {isComp && (
                        <Box className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-neutral-950">
                          <CheckMarkIcon className="w-2.5 h-2.5" />
                        </Box>
                      )}
                    </Box>

                    {/* Step Label */}
                    <Text
                      className={`text-xs small:text-sm mt-3 leading-tight transition-colors text-center ${
                        isComp
                          ? 'font-semibold text-neutral-900 dark:text-white'
                          : isCurr
                            ? 'font-bold text-neutral-900 dark:text-white'
                            : 'font-medium text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      {step.label}
                    </Text>

                    {/* Step Date */}
                    <Text
                      className={`text-[11px] mt-1 text-center ${
                        step.date && (isComp || isCurr)
                          ? 'text-neutral-500 dark:text-neutral-400 font-normal'
                          : 'text-transparent select-none'
                      }`}
                    >
                      {step.date || '---'}
                    </Text>
                  </Box>

                  {/* Segmented Connector Line between steps */}
                  {!isLast && (
                    <Box
                      className={`flex-1 h-0.5 mt-5 min-w-[28px] sm:min-w-[40px] transition-all duration-500 ${
                        isNextActive
                          ? 'bg-neutral-900 dark:bg-white'
                          : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default OrderProgress


