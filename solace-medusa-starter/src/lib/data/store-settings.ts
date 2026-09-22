import { cache } from 'react'

export interface StoreSettingsData {
  name: string
  logo_url: string
  support_email: string
  support_phone: string
  default_currency: string
}

const DEFAULT_SETTINGS: StoreSettingsData = {
  name: 'Swami Om Enterprises',
  logo_url: '/logo/logo.png',
  support_email: 'support@swamiomenterprises.in',
  support_phone: '+91 7385677447',
  default_currency: 'INR',
}

export const getStoreSettings = cache(async function (): Promise<StoreSettingsData> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    process.env.MEDUSA_BACKEND_URL ||
    'http://127.0.0.1:9000'

  try {
    const res = await fetch(`${backendUrl}/store-info`, {
      next: {
        tags: ['store-settings'],
        revalidate: 60, // revalidate every 60 seconds
      },
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return DEFAULT_SETTINGS
    }

    const data = await res.json()
    return {
      name: data.name || DEFAULT_SETTINGS.name,
      logo_url: data.logo_url && data.logo_url.trim() ? data.logo_url.trim() : DEFAULT_SETTINGS.logo_url,
      support_email: data.support_email || DEFAULT_SETTINGS.support_email,
      support_phone: data.support_phone || DEFAULT_SETTINGS.support_phone,
      default_currency: data.default_currency || DEFAULT_SETTINGS.default_currency,
    }
  } catch (err) {
    console.warn('[store-settings] Failed to fetch store settings from backend, using defaults:', err)
    return DEFAULT_SETTINGS
  }
})
