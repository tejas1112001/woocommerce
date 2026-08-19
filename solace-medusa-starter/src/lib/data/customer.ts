'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { sdk } from '@lib/config'
import { getLocalizedPath } from '@lib/util/urls'

import { getAuthHeaders, removeAuthToken, setAuthToken, removeCartId } from './cookies'

export async function getCustomer() {
  const authHeaders = await getAuthHeaders()

  // No-op if not authenticated
  if (!('authorization' in authHeaders)) {
    return null
  }

  return await sdk.store.customer
    .retrieve({}, { next: { tags: ['customer'] }, ...authHeaders })
    .then(({ customer }) => customer)
    .catch(() => null)
}

export async function updateCustomer(
  _currentState: {
    success: boolean
    error: string | null
  },
  formData: FormData
) {
  const authHeaders = await getAuthHeaders()

  const body = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: formData.get('phone') as string,
  }

  return await sdk.store.customer
    .update(body, {}, authHeaders)
    .then(() => {
      revalidateTag('customer', 'max')
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export async function signup(
  _currentState: unknown,
  formData: FormData
): Promise<string | null> {
  const password = formData.get('password') as string
  const customerForm = {
    email: formData.get('email') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: formData.get('phone') as string,
  }

  // `redirectTo` is an optional hidden field injected by the checkout guard so
  // newly registered customers land on the checkout page they came from instead
  // of the generic /account dashboard.
  // Always decode — the proxy uses searchParams.set() which auto-encodes, and the
  // server-side guard uses manual string concat + encodeURIComponent; decodeURIComponent
  // is safe to call on an already-decoded path (no-op).
  const rawRedirectTo = (formData.get('redirectTo') as string) || null
  const redirectTo = rawRedirectTo ? decodeURIComponent(rawRedirectTo) : null

  try {
    const token = await sdk.auth.register('customer', 'emailpass', {
      email: customerForm.email,
      password: password,
    })

    const customHeaders = { authorization: `Bearer ${token}` }

    await sdk.store.customer.create(customerForm, {}, customHeaders)

    const loginToken = await sdk.auth.login('customer', 'emailpass', {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)
    revalidateTag('customer', 'max')
  } catch (error: any) {
    return error.toString()
  }

  // If the user came from a protected page (e.g. checkout), send them back there.
  redirect(redirectTo ?? '/account')
}

export async function forgotPassword(
  _currentState: unknown,
  formData: FormData
) {
  const email = formData.get('email') as string
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/emailpass/reset-password`,
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
        }),
      }
    )
  } catch (error: any) {
    return error.toString()
  }
}

export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string
  const password = formData.get('new_password') as string

  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/emailpass/update?token=${token}`,
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    )
  } catch (error: any) {
    return error.toString()
  }
}

export async function login(
  _currentState: unknown,
  formData: FormData
): Promise<string | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // `redirectTo` is an optional hidden field injected by the checkout guard so
  // authenticated users land back on the page they were trying to reach instead
  // of the generic /account dashboard.
  // Always decode — see signup for rationale.
  const rawRedirectTo = (formData.get('redirectTo') as string) || null
  const redirectTo = rawRedirectTo ? decodeURIComponent(rawRedirectTo) : null

  try {
    const token = await sdk.auth.login('customer', 'emailpass', {
      email,
      password,
    })
    await setAuthToken(token as string)
    revalidateTag('customer', 'max')
  } catch (error: any) {
    return error.toString()
  }

  // Redirect happens outside try/catch so it throws the redirect signal correctly.
  // If the user came from a protected page (e.g. checkout), send them back there.
  redirect(redirectTo ?? '/account')
}

export async function updateCustomerPassword(
  _currentState: { success: boolean; error: string | null },
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const email_raw = formData.get('email') as string
  const old_password = formData.get('old_password') as string
  const new_password = formData.get('new_password') as string
  const confirm_password = formData.get('confirm_password') as string

  if (new_password !== confirm_password) {
    return { success: false, error: 'New passwords do not match' }
  }

  if (new_password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  try {
    // Verify old password by attempting a login
    await sdk.auth.login('customer', 'emailpass', {
      email: email_raw,
      password: old_password,
    })

    // Update password via the auth update endpoint
    const authHeaders = await getAuthHeaders()
    const token = (authHeaders as any)['authorization']?.replace('Bearer ', '')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/emailpass/update`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: email_raw, password: new_password }),
      }
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return {
        success: false,
        error: body?.message ?? 'Failed to update password',
      }
    }

    return { success: true, error: null }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message ?? 'Current password is incorrect',
    }
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()
  await removeAuthToken()
  await removeCartId()
  revalidateTag('auth', 'max')
  revalidateTag('customer', 'max')
  revalidateTag('cart', 'max')
  redirect(getLocalizedPath('/account', countryCode))
}

export const addCustomerAddress = async (
  _currentState: {
    success: boolean
    error: string | null
  },
  formData: FormData
): Promise<any> => {
  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
    address_name:
      (formData.get('address_name') as string) ?? 'shipping_address',
    is_default_shipping:
      formData.get('is_default_shipping') === 'on' ||
      formData.get('is_default_shipping') === 'true'
        ? true
        : false,
  }

  const authHeaders = await getAuthHeaders()

  return sdk.store.customer
    .createAddress(address, {}, authHeaders)
    .then(() => {
      revalidateTag('customer', 'max')
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const authHeaders = await getAuthHeaders()

  await sdk.store.customer
    .deleteAddress(addressId, authHeaders)
    .then(() => {
      revalidateTag('customer', 'max')
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) ?? (formData.get('id') as string)

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
    is_default_shipping:
      formData.get('is_default_shipping') === 'on' ||
      formData.get('is_default_shipping') === 'true'
        ? true
        : false,
  }

  const authHeaders = await getAuthHeaders()

  return sdk.store.customer
    .updateAddress(addressId, address, {}, authHeaders)
    .then(() => {
      revalidateTag('customer', 'max')
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
