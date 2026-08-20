'use client'

import useToggleState from '@lib/hooks/use-toggle-state'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'

import ProfileEditDetails from '../profile-edit-details'
import ProfilePassword from '../profile-password'

const ProfileDetails = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer
}) => {
  const { state, toggle, close } = useToggleState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Profile info section */}
      <div className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 small:p-6 shadow-xs flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
          <div className="flex flex-col gap-0.5">
            <Heading as="h1" className="text-xl font-bold">
              Profile Details
            </Heading>
            <Text className="text-xs text-neutral-500 dark:text-neutral-400">
              Manage your personal information and contact details
            </Text>
          </div>
          <Button
            variant="tonal"
            size="sm"
            onClick={toggle}
            data-testid="edit-details-button"
          >
            Edit details
          </Button>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">First name</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white mt-1">
              {customer.first_name || '-'}
            </Text>
          </div>
          <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Last name</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white mt-1">
              {customer.last_name || '-'}
            </Text>
          </div>
          <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Email address</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white mt-1 truncate">
              {customer.email}
            </Text>
          </div>
          <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <Text className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Phone number</Text>
            <Text className="font-semibold text-neutral-900 dark:text-white mt-1">
              {customer.phone || '-'}
            </Text>
          </div>
        </div>

        <ProfileEditDetails
          customer={customer}
          open={state}
          closeModal={close}
          onOpenChange={toggle}
        />
      </div>

      {/* Password section */}
      <ProfilePassword customer={customer} />
    </div>
  )
}

export default ProfileDetails

