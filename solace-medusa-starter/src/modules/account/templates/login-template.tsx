'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  usePathname,
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import ForgotPassword from '@modules/account/components/forgot-password'
import Login from '@modules/account/components/login'
import Register from '@modules/account/components/register'
import { Box } from '@modules/common/components/box'

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
}

const LoginTemplate = () => {
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode')

  // `redirectTo` is set by the checkout guard in proxy.ts when an unauthenticated
  // user tries to access /checkout. After a successful login or registration the
  // server actions (login / signup) will redirect to this URL instead of /account.
  const redirectToParam = searchParams.get('redirectTo') ?? undefined

  const currentRouteWithoutMode = useMemo(() => {
    const paramsCopy = new URLSearchParams(searchParams as any)
    paramsCopy.delete('mode')

    const query = paramsCopy.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const redirectTo = redirectToParam ?? currentRouteWithoutMode
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(
    (mode as LOGIN_VIEW) || LOGIN_VIEW.SIGN_IN
  )

  useEffect(() => {
    if (mode) {
      const countryCode = params.countryCode ?? ''
      const query = redirectToParam
        ? `?redirectTo=${encodeURIComponent(redirectToParam)}`
        : ''
      const newUrl = `/${countryCode}/account${query}`
      router.replace(newUrl)
    }
  }, [mode, params.countryCode, redirectToParam, router])

  let Component = Login
  switch (currentView) {
    case 'sign-in':
      Component = Login
      break
    case 'register':
      Component = Register
      break
    case 'forgot-password':
      Component = ForgotPassword
      break
    default:
      break
  }

  return (
    <Box className="flex w-full">
      {/* Pass redirectTo so the Login / Register forms can embed it as a hidden
          field and the server actions can redirect back to checkout after auth. */}
      <Component setCurrentView={setCurrentView} redirectTo={redirectTo} />
    </Box>
  )
}

export default LoginTemplate
