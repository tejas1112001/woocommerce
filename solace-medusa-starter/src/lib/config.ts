import Medusa from '@medusajs/js-sdk'

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = 'http://127.0.0.1:9000'

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Log configuration in development mode to help debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Medusa SDK Configuration:')
  console.log('- Backend URL:', MEDUSA_BACKEND_URL)
  console.log('- Publishable Key:', PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 20)}...` : 'NOT SET')
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: PUBLISHABLE_KEY,
})
