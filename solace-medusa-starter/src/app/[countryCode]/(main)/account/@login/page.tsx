import { Metadata } from 'next'
import { Suspense } from 'react'
import { Spinner } from '@modules/common/icons'
import LoginTemplate from '@modules/account/templates/login-template'

export const metadata: Metadata = {
  title: 'Customer Sign In & Account Registration',
  description: 'Sign in to your Swami Om Enterprises account or create a new account to track orders and save shipping details.',
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Spinner size={36} />
        </div>
      }
    >
      <LoginTemplate />
    </Suspense>
  )
}
