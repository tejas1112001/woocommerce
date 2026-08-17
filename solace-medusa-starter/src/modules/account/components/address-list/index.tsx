'use client'

import { useMemo } from 'react'

import { HttpTypes } from '@medusajs/types'
import AddressActions from '@modules/checkout/components/address-actions'
import { Badge } from '@modules/common/components/badge'

type AddressListProps = {
  address: HttpTypes.StoreCustomerAddress
  openDialog: (open: boolean) => void
  setAddressToEdit: (address: HttpTypes.StoreCustomerAddress) => void
  region: HttpTypes.StoreRegion
}

const AddressList: React.FC<AddressListProps> = ({
  address,
  openDialog,
  setAddressToEdit,
  region,
}) => {
  const country = useMemo(() => {
    return region.countries?.find((c) => c.iso_2 === address.country_code)
  }, [address.country_code, region.countries])

  return (
    <div className="bg-primary border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex items-start justify-between gap-4 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-neutral-900 dark:text-white text-base">
            {address.first_name} {address.last_name}
          </p>
          {address.is_default_shipping && (
            <Badge variant="green" label="Default Address" />
          )}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-0.5">
          <p className="font-medium text-neutral-800 dark:text-neutral-200">
            {address.company && `${address.company}, `}
            {address.address_1}
          </p>
          <p>
            {address.city}, {address.postal_code}
          </p>
          <p>{country?.display_name}</p>
          {address.phone && (
            <p className="text-xs text-neutral-500 mt-1">Phone: {address.phone}</p>
          )}
        </div>
      </div>
      <div>
        <AddressActions
          id={address.id}
          setOpen={openDialog}
          onEdit={() => setAddressToEdit(address)}
        />
      </div>
    </div>
  )
}

export default AddressList

