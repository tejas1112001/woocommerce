'use client'

import React, { startTransition, useActionState, useState } from 'react'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { initiatePaymentSession, setAddresses } from '@lib/data/cart'
import { useCheckoutForms } from '@lib/hooks/use-checkout-forms'
import compareAddresses from '@lib/util/addresses'
import { HttpTypes } from '@medusajs/types'
import { useToggleState } from '@medusajs/ui'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import Divider from '@modules/common/components/divider'
import { Heading } from '@modules/common/components/heading'
import { Stepper } from '@modules/common/components/stepper'
import { Text } from '@modules/common/components/text'
import { Spinner } from '@modules/common/icons'

import BillingAddress from '../billing_address'
import ErrorMessage from '../error-message'
import ShippingAddress from '../shipping-address'
import { SubmitButton } from '../submit-button'

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeStep = searchParams.get('step')
  const isAddressCompleted = !!(
    cart?.shipping_address?.first_name &&
    cart?.shipping_address?.last_name &&
    cart?.shipping_address?.address_1 &&
    cart?.shipping_address?.city &&
    cart?.shipping_address?.country_code &&
    cart?.shipping_address?.postal_code &&
    cart?.shipping_address?.phone &&
    cart?.email
  )

  const isOpen = !isAddressCompleted || activeStep === 'address'

  const handleEdit = () => {
    router.push(pathname + '?step=address')
  }

  const { state: sameAsShipping, toggle: originalToggleSameAsShipping } =
    useToggleState(
      cart?.shipping_address && cart?.billing_address
        ? compareAddresses(cart?.billing_address, cart?.shipping_address)
        : true
    )

  const initialValues = {
    shipping_address: {
      first_name:
        cart?.shipping_address?.first_name || customer?.first_name || '',
      last_name:
        cart?.shipping_address?.last_name || customer?.last_name || '',
      address_1: cart?.shipping_address?.address_1 || '',
      company: cart?.shipping_address?.company || '',
      postal_code: cart?.shipping_address?.postal_code || '',
      city: cart?.shipping_address?.city || '',
      country_code:
        cart?.shipping_address?.country_code ||
        params.countryCode ||
        '',
      province: cart?.shipping_address?.province || '',
      phone: cart?.shipping_address?.phone || '',
    },
    billing_address: {
      first_name:
        cart?.billing_address?.first_name || customer?.first_name || '',
      last_name:
        cart?.billing_address?.last_name || customer?.last_name || '',
      address_1: cart?.billing_address?.address_1 || '',
      company: cart?.billing_address?.company || '',
      postal_code: cart?.billing_address?.postal_code || '',
      city: cart?.billing_address?.city || '',
      country_code:
        cart?.billing_address?.country_code ||
        cart?.shipping_address?.country_code ||
        '',
      province: cart?.billing_address?.province || '',
      phone: cart?.billing_address?.phone || '',
    },
    email: cart?.email || customer?.email || '',
    same_as_shipping: sameAsShipping,
  }

  const checkout = useCheckoutForms(initialValues)
  const [formError, formAction] = useActionState(setAddresses, null)
  const [isPending, setIsPending] = useState(false)

  const toggleSameAsShipping = (value: boolean) => {
    originalToggleSameAsShipping()
    checkout.setFieldValue('same_as_shipping', value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = await checkout.validateForm()

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsPending(true)
    const formData = new FormData()

    Object.entries(checkout.values.shipping_address).forEach(([key, value]) => {
      formData.append(`shipping_address.${key}`, value as string)
    })

    Object.entries(checkout.values.billing_address).forEach(([key, value]) => {
      formData.append(`billing_address.${key}`, value as string)
    })

    formData.append('email', checkout.values.email)
    formData.append('same_as_shipping', checkout.values.same_as_shipping ? 'on' : 'off')

    const activeSession = cart?.payment_collection?.payment_sessions?.find(
      (paymentSession: any) => paymentSession.status === 'pending'
    )

    if (activeSession) {
      try {
        await initiatePaymentSession(cart, {
          provider_id: activeSession.provider_id,
        })
      } catch (error) {
        console.error('Payment session refresh error:', error)
      }
    }

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Box className="bg-primary p-5">
      <Box className="mb-6 flex flex-row items-center justify-between">
        <Heading
          as="h2"
          className="flex flex-row items-center gap-x-4 text-2xl"
        >
          {isOpen ? (
            <Stepper state="focussed">1</Stepper>
          ) : (
            <Stepper state="completed" />
          )}
          Shipping address
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Button
            variant="tonal"
            size="sm"
            onClick={handleEdit}
            data-testid="edit-address-button"
          >
            Edit
          </Button>
        )}
      </Box>
      {isOpen ? (
        <form onSubmit={handleSubmit}>
          <Box>
            <ShippingAddress
              customer={customer}
              cart={cart}
              formik={checkout}
              checked={sameAsShipping}
              onChange={toggleSameAsShipping}
            />
            {!sameAsShipping && (
              <div>
                <Divider className="my-6" />
                <Heading as="h2" className="pb-6 text-2xl">
                  Billing address
                </Heading>
                <BillingAddress
                  cart={cart}
                  formik={checkout}
                />
              </div>
            )}
            <SubmitButton
              isLoading={isPending}
              className="mt-6"
              data-testid="submit-address-button"
              disabled={!checkout.isValid}
            >
              Proceed to delivery
            </SubmitButton>
            {formError && (
              <ErrorMessage
                error={formError}
                data-testid="address-error-message"
              />
            )}
          </Box>
        </form>
      ) : (
        <Box>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex w-full flex-col items-start gap-x-1">
                  {/* Shipping Address */}
                  <div
                    className="flex flex-col p-4"
                    data-testid="shipping-address-summary"
                  >
                    <Text size="lg" className="text-basic-primary">
                      Shipping Address
                    </Text>
                    <Text className="text-secondary">
                      {cart.shipping_address.first_name}{' '}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="text-secondary">
                      {cart.shipping_address.company &&
                        `${cart.shipping_address.company}, `}
                      {cart.shipping_address.address_1},{' '}
                      {cart.shipping_address.postal_code},{' '}
                      {cart.shipping_address.city},{' '}
                      {cart.shipping_address.country_code?.toUpperCase()}
                      {cart.shipping_address?.province &&
                        `, ${cart.shipping_address.province}`}
                      ,
                    </Text>
                    <Text className="text-secondary">
                      {cart.email}, {cart.shipping_address?.phone}
                    </Text>
                  </div>
                  {/* Billing Address */}
                  <div
                    className="flex flex-col p-4"
                    data-testid="billing-address-summary"
                  >
                    <Text size="lg" className="text-basic-primary">
                      Billing Address
                    </Text>
                    {sameAsShipping ? (
                      <Text className="text-secondary">
                        Same as shipping address
                      </Text>
                    ) : (
                      <>
                        <Text className="text-secondary">
                          {cart.billing_address.first_name}{' '}
                          {cart.billing_address.last_name}
                        </Text>
                        <Text className="text-secondary">
                          {cart.billing_address.address_1},{' '}
                          {cart.billing_address.postal_code},{' '}
                          {cart.billing_address.city},{' '}
                          {cart.billing_address.country_code?.toUpperCase()}
                          {cart.billing_address?.province &&
                            `, ${cart.billing_address.province}`}
                          ,
                        </Text>
                        <Text className="text-secondary">
                          {cart.billing_address?.phone}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </Box>
      )}
    </Box>
  )
}
export default Addresses
