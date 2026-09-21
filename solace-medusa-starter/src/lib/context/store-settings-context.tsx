'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { StoreSettingsData } from '@lib/data/store-settings'

interface StoreSettingsContextType {
  settings: StoreSettingsData
  logoUrl: string
  storeName: string
  supportEmail: string
  supportPhone: string
  defaultCurrency: string
  refreshSettings: () => Promise<void>
}

const DEFAULT_SETTINGS: StoreSettingsData = {
  name: 'Swami Om Enterprises',
  logo_url: '/logo/logo.png',
  support_email: 'support@swamiomenterprises.in',
  support_phone: '+91 7385677447',
  default_currency: 'INR',
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  logoUrl: '/logo/logo.png',
  storeName: 'Swami Om Enterprises',
  supportEmail: 'support@swamiomenterprises.in',
  supportPhone: '+91 7385677447',
  defaultCurrency: 'INR',
  refreshSettings: async () => {},
})

export function StoreSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings?: StoreSettingsData | null
}) {
  const [settings, setSettings] = useState<StoreSettingsData>(
    initialSettings || DEFAULT_SETTINGS
  )

  const refreshSettings = useCallback(async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000'
      const res = await fetch(`${backendUrl}/store-info`, {
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        const data = await res.json()
        setSettings({
          name: data.name || DEFAULT_SETTINGS.name,
          logo_url:
            data.logo_url && data.logo_url.trim()
              ? data.logo_url.trim()
              : DEFAULT_SETTINGS.logo_url,
          support_email: data.support_email || DEFAULT_SETTINGS.support_email,
          support_phone: data.support_phone || DEFAULT_SETTINGS.support_phone,
          default_currency:
            data.default_currency || DEFAULT_SETTINGS.default_currency,
        })
      }
    } catch (e) {
      console.warn('Failed to refresh store settings client-side:', e)
    }
  }, [])

  // Sync if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  const logoUrl = settings.logo_url && settings.logo_url.trim() ? settings.logo_url.trim() : DEFAULT_SETTINGS.logo_url

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        logoUrl,
        storeName: settings.name || DEFAULT_SETTINGS.name,
        supportEmail: settings.support_email || DEFAULT_SETTINGS.support_email,
        supportPhone: settings.support_phone || DEFAULT_SETTINGS.support_phone,
        defaultCurrency: settings.default_currency || DEFAULT_SETTINGS.default_currency,
        refreshSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext)
}
