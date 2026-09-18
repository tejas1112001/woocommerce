import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util/cn'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BoxIcon, ShippingIcon, UserIcon } from '@modules/common/icons'

import OrderCard from '../order-card'
import { NoOrders, OrderType } from '../order-overview'

type OverviewProps = {
  customer: HttpTypes.StoreCustomer
  orders: OrderType[] | null
  totalOrders: number
}

const StatCard = ({
  icon,
  label,
  value,
  subtext,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext?: string
  className?: string
}) => (
  <Box
    className={cn(
      'flex flex-col justify-between bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 small:p-5 shadow-xs hover:shadow-md transition-all duration-200 gap-2 small:gap-3',
      className
    )}
  >
    <Box className="flex items-center justify-between gap-2">
      <Text className="text-[11px] small:text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate">
        {label}
      </Text>
      <Box className="flex h-7 w-7 small:h-9 small:w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
        {icon}
      </Box>
    </Box>
    <Box className="flex flex-col gap-0.5">
      <Text className="text-base small:text-2xl font-bold text-neutral-900 dark:text-white truncate">
        {value}
      </Text>
      {subtext && (
        <Text className="text-[11px] small:text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {subtext}
        </Text>
      )}
    </Box>
  </Box>
)

const Overview = ({ customer, orders, totalOrders }: OverviewProps) => {
  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
    'Customer'

  const userInitials =
    (customer.first_name?.[0] || '') + (customer.last_name?.[0] || '') || 'C'

  const pendingOrders =
    orders?.filter(
      (o) => o.status === 'pending' || o.fulfillment_status === 'not_fulfilled'
    ).length ?? 0

  return (
    <Box
      data-testid="overview-page-wrapper"
      className="flex flex-col gap-4 small:gap-6"
    >
      {/* Welcome header card */}
      <Box className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 small:p-6 shadow-xs flex items-center justify-between gap-3">
        <Box className="flex items-center gap-3 small:gap-4 min-w-0">
          <Box className="w-10 h-10 small:w-12 small:h-12 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm small:text-lg flex items-center justify-center shadow-xs flex-shrink-0">
            {userInitials.toUpperCase()}
          </Box>
          <Box className="flex flex-col min-w-0">
            <Heading as="h1" className="!text-sm small:!text-xl !font-bold text-neutral-900 dark:text-white truncate">
              Welcome back, {customer.first_name || 'there'}
            </Heading>
            <Text className="text-xs small:text-sm text-secondary truncate">
              {customer.email}
            </Text>
          </Box>
        </Box>
        <Button
          variant="tonal"
          size="sm"
          asChild
          className="flex-shrink-0 text-xs small:text-sm h-8 small:h-9 px-3 small:px-4 font-medium"
        >
          <LocalizedClientLink href="/account/profile">
            Edit profile
          </LocalizedClientLink>
        </Button>
      </Box>

      {/* Summary stats */}
      <Box className="grid grid-cols-2 small:grid-cols-3 gap-2.5 small:gap-4">
        <StatCard
          icon={<UserIcon className="h-4 w-4 small:h-5 small:w-5" />}
          label="Account"
          value={fullName}
          subtext="Verified Member"
          className="col-span-2 small:col-span-1"
        />
        <StatCard
          icon={<BoxIcon className="h-4 w-4 small:h-5 small:w-5" />}
          label="Total orders"
          value={totalOrders}
          subtext={`${totalOrders === 1 ? '1 order' : `${totalOrders} orders`} placed`}
          className="col-span-1"
        />
        <StatCard
          icon={<ShippingIcon className="h-4 w-4 small:h-5 small:w-5" />}
          label="Pending shipments"
          value={pendingOrders}
          subtext={pendingOrders > 0 ? 'Active in transit' : 'All delivered'}
          className="col-span-1"
        />
      </Box>

      {/* Recent orders */}
      <Box className="flex flex-col gap-3 small:gap-4">
        <Box className="flex items-center justify-between">
          <Heading as="h2" className="!text-sm small:!text-lg !font-bold text-neutral-900 dark:text-white">
            Recent orders
          </Heading>
          <Button
            variant="text"
            size="sm"
            asChild
            className="w-max text-xs small:text-sm h-auto p-0 hover:bg-transparent"
            data-testid="view-all-orders-button"
          >
            <LocalizedClientLink href={`/account/orders`}>
              View all orders &rarr;
            </LocalizedClientLink>
          </Button>
        </Box>
        <Box className="flex flex-col gap-3 small:gap-4">
          {orders && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Box className="py-8 bg-primary rounded-xl border border-neutral-200 dark:border-neutral-800 text-center">
              <NoOrders />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Overview

