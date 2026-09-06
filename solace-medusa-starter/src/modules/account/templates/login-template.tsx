'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'

import { cn } from '@lib/util/cn'
import ForgotPassword from '@modules/account/components/forgot-password'
import Login from '@modules/account/components/login'
import Register from '@modules/account/components/register'
import { Box } from '@modules/common/components/box'
import { Spinner } from '@modules/common/icons'

export enum LOGIN_VIEW {
  SIGN_IN = 'sign-in',
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot-password',
}

// ─── Inner component that safely uses useSearchParams() ──────────────────────
// Must be wrapped in <Suspense> to avoid blank screen on SSR in Next.js App Router.
const LoginTemplateInner = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')

  const redirectToParam = searchParams.get('redirectTo') ?? undefined

  const currentRouteWithoutMode = useMemo(() => {
    const paramsCopy = new URLSearchParams(searchParams as any)
    paramsCopy.delete('mode')
    const query = paramsCopy.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const redirectTo = redirectToParam ?? currentRouteWithoutMode

  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(
    mode === LOGIN_VIEW.REGISTER
      ? LOGIN_VIEW.REGISTER
      : mode === LOGIN_VIEW.FORGOT_PASSWORD
      ? LOGIN_VIEW.FORGOT_PASSWORD
      : LOGIN_VIEW.SIGN_IN
  )

  useEffect(() => {
    if (mode === LOGIN_VIEW.REGISTER) {
      setCurrentView(LOGIN_VIEW.REGISTER)
    } else if (mode === LOGIN_VIEW.SIGN_IN) {
      setCurrentView(LOGIN_VIEW.SIGN_IN)
    } else if (mode === LOGIN_VIEW.FORGOT_PASSWORD) {
      setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)
    }
  }, [mode])

  let Component = Login
  switch (currentView) {
    case LOGIN_VIEW.SIGN_IN:
      Component = Login
      break
    case LOGIN_VIEW.REGISTER:
      Component = Register
      break
    case LOGIN_VIEW.FORGOT_PASSWORD:
      Component = ForgotPassword
      break
    default:
      break
  }

  return (
    <Box className="flex w-full flex-col max-w-lg mx-auto py-4">
      {/* Top Segmented Tab Switcher */}
      <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6 border border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className={cn(
            'flex-1 rounded-lg py-2.5 text-center text-xs sm:text-sm font-bold transition-all duration-200',
            currentView === LOGIN_VIEW.SIGN_IN
              ? 'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className={cn(
            'flex-1 rounded-lg py-2.5 text-center text-xs sm:text-sm font-bold transition-all duration-200',
            currentView === LOGIN_VIEW.REGISTER
              ? 'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          )}
        >
          Create Account
        </button>
      </div>

      <Component setCurrentView={setCurrentView} redirectTo={redirectTo} />
    </Box>
  )
}

// ─── Loading skeleton shown while useSearchParams() resolves ─────────────────
const LoginTemplateFallback = () => (
  <Box className="flex w-full flex-col max-w-lg mx-auto py-4">
    {/* Skeleton tab switcher */}
    <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6 border border-neutral-200 dark:border-neutral-700 h-10 animate-pulse" />
    {/* Centered spinner */}
    <Box className="flex items-center justify-center py-16">
      <Spinner size={32} />
    </Box>
  </Box>
)

// ─── Public export — Suspense wrapper ensures no blank-screen flash ───────────
const LoginTemplate = () => (
  <Suspense fallback={<LoginTemplateFallback />}>
    <LoginTemplateInner />
  </Suspense>
)

export default LoginTemplate
