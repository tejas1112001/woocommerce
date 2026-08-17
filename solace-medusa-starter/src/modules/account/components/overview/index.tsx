import { HttpTypes } from '@medusajs/types'
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
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext?: string
}) => (
  <Box className="flex flex-1 flex-col gap-3 bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all duration-200">
    <Box className="flex items-center justify-between">
      <Text className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {label}
      </Text>
      <Box className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
        {icon}
      </Box>
    </Box>
    <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
      {value}
    </Text>
    {subtext && (
      <Text className="text-xs text-neutral-500 dark:text-neutral-400">
        {subtext}
      </Text>
    )}
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
      className="flex flex-col gap-6 small:gap-8"
    >
      {/* Welcome header card */}
      <Box className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 small:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <Box className="flex items-center gap-4">
          <Box className="w-12 h-12 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-lg flex items-center justify-center shadow-xs">
            {userInitials.toUpperCase()}
          </Box>
          <Box className="flex flex-col">
            <Heading as="h1" className="text-xl small:text-2xl font-bold">
              Welcome back, {customer.first_name || 'there'}
            </Heading>
            <Text className="text-sm text-secondary">{customer.email}</Text>
          </Box>
        </Box>
        <Button variant="tonal" size="sm" asChild>
          <LocalizedClientLink href="/account/profile">
            Edit profile
          </LocalizedClientLink>
        </Button>
      </Box>

      {/* Summary stats */}
      <Box className="grid grid-cols-1 small:grid-cols-3 gap-4">
        <StatCard
          icon={<UserIcon className="h-5 w-5" />}
          label="Account"
          value={fullName}
          subtext="Verified Member"
        />
        <StatCard
          icon={<BoxIcon className="h-5 w-5" />}
          label="Total orders"
          value={totalOrders}
          subtext={`${totalOrders === 1 ? '1 order' : `${totalOrders} orders`} placed`}
        />
        <StatCard
          icon={<ShippingIcon className="h-5 w-5" />}
          label="Pending shipments"
          value={pendingOrders}
          subtext={pendingOrders > 0 ? 'Active in transit' : 'All delivered'}
        />
      </Box>

      {/* Recent orders */}
      <Box className="flex flex-col gap-4">
        <Box className="flex items-center justify-between">
          <Heading as="h2" className="text-lg small:text-xl font-semibold">
            Recent orders
          </Heading>
          <Button
            variant="text"
            size="sm"
            asChild
            className="w-max"
            data-testid="view-all-orders-button"
          >
            <LocalizedClientLink href={`/account/orders`}>
              View all orders &rarr;
            </LocalizedClientLink>
          </Button>
        </Box>
        <Box className="flex flex-col gap-4">
          {orders && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Box className="py-10">
              <NoOrders />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Overview

