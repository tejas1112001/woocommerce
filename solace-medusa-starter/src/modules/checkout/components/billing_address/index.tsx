import React, { ChangeEventHandler } from 'react'

import { FormikErrorsType } from '@lib/hooks/use-checkout-forms'
import { HttpTypes } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Input } from '@modules/common/components/input'
import { FormikErrors } from 'formik'

import CountrySelect from '../country-select'

const BillingAddress = ({
  cart,
  formik,
}: {
  cart: HttpTypes.StoreCart | null
  formik: any
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik

  return (
    <>
      <Box className="grid grid-cols-1 gap-2 small:gap-4 xl:grid-cols-2">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={values.billing_address.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.first_name || formik.formSubmitCount > 0)
              ? errors?.billing_address?.first_name
              : undefined
          }
          data-testid="billing-first-name-input"
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={values.billing_address.last_name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.last_name || formik.formSubmitCount > 0)
              ? errors?.billing_address?.last_name
              : undefined
          }
          data-testid="billing-last-name-input"
        />
        <Input
          label="Company name (optional)"
          name="billing_address.company"
          value={values.billing_address.company}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={values.billing_address.address_1}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.address_1 || formik.formSubmitCount > 0)
              ? errors?.billing_address?.address_1
              : undefined
          }
          data-testid="billing-address-input"
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={values.billing_address.postal_code}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.postal_code || formik.formSubmitCount > 0)
              ? errors?.billing_address?.postal_code
              : undefined
          }
          data-testid="billing-postal-input"
        />
        <Input
          label="City"
          name="billing_address.city"
          autoComplete="address-level2"
          value={values.billing_address.city}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.city || formik.formSubmitCount > 0)
              ? errors?.billing_address?.city
              : undefined
          }
          data-testid="billing-city-input"
        />
        <CountrySelect
          label="Country"
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={values.billing_address.country_code}
          onChange={
            handleChange as unknown as ChangeEventHandler<HTMLSelectElement>
          }
          onBlur={handleBlur}
          error={
            (touched.billing_address?.country_code || formik.formSubmitCount > 0)
              ? errors?.billing_address?.country_code
              : undefined
          }
          data-testid="billing-country-select"
        />
        <Input
          label="State / Province (optional)"
          name="billing_address.province"
          autoComplete="address-level1"
          value={values.billing_address.province}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="billing-province-input"
        />
        <Input
          label="Phone number"
          name="billing_address.phone"
          autoComplete="tel"
          value={values.billing_address.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          error={
            (touched.billing_address?.phone || formik.formSubmitCount > 0)
              ? errors?.billing_address?.phone
              : undefined
          }
          data-testid="billing-phone-input"
        />
      </Box>
    </>
  )
}

export default BillingAddress
