'use client'

import { useState } from 'react'

import useToggleState from '@lib/hooks/use-toggle-state'
import { cn } from '@lib/util/cn'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Text } from '@modules/common/components/text'
import { PlusIcon, ShippingIcon } from '@modules/common/icons'

import AddressList from '../address-list'
import AddressModalForm from '../address-modal-form'

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const [addressToEdit, setAddressToEdit] =
    useState<HttpTypes.StoreCustomerAddress | null>(null)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)

  const {
    state: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useToggleState(false)

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true)
    setAddressToEdit(null)
    openDialog()
  }

  const handleEditAddress = (address: HttpTypes.StoreCustomerAddress) => {
    setIsAddingNewAddress(false)
    setAddressToEdit(address)
    openDialog()
  }

  const hasNoAddresses = customer.addresses.length === 0

  return (
    <>
      <AddressModalForm
        region={region}
        closeDialog={closeDialog}
        isOpenDialog={isDialogOpen}
        address={addressToEdit}
        isAddingNewAddress={isAddingNewAddress}
      />

      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <Heading as="h1" className="text-xl small:text-2xl font-bold">
            Shipping Addresses
          </Heading>
          <Button
            variant="tonal"
            className={cn(
              'hidden medium:flex',
              hasNoAddresses && 'medium:hidden'
            )}
            size="sm"
            leftIcon={<PlusIcon />}
            onClick={handleAddNewAddress}
            data-testid="add-new-address-button"
          >
            Add new address
          </Button>
        </div>

        {hasNoAddresses ? (
          <div className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center shadow-xs flex flex-col items-center gap-4 max-w-lg mx-auto w-full">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
              <ShippingIcon className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                No saved shipping addresses
              </p>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                You currently have no saved shipping addresses. Add an address to
                make checkout quicker and easier.
              </Text>
            </div>
            <Button
              variant="filled"
              size="sm"
              className="mt-2 w-full max-w-xs"
              onClick={handleAddNewAddress}
            >
              Add address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {customer.addresses.map((address) => (
              <AddressList
                address={address}
                openDialog={() => handleEditAddress(address)}
                key={address.id}
                setAddressToEdit={setAddressToEdit}
                region={region}
              />
            ))}
          </div>
        )}

        <Button
          variant="tonal"
          className={cn('w-full medium:hidden', hasNoAddresses && 'hidden')}
          size="sm"
          leftIcon={<PlusIcon />}
          onClick={handleAddNewAddress}
          data-testid="add-new-address-button"
        >
          Add new address
        </Button>
      </div>
    </>
  )
}

export default AddressBook

