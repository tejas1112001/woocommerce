'use client'

import { useRef, useState, useTransition } from 'react'

import { login } from '@lib/data/customer'
import { ValidationError } from '@lib/util/validator'
import { LOGIN_VIEW } from '@modules/account/templates/login-template'
import { SubmitButton } from '@modules/checkout/components/submit-button'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Heading } from '@modules/common/components/heading'
import { Input } from '@modules/common/components/input'
import { toast } from '@modules/common/components/toast'

import RegisterPrompt from './register-prompt'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  /** When set, the login form will redirect here after successful authentication
   *  instead of the generic /account page. Used by the checkout guard. */
  redirectTo?: string
}

const Login = ({ setCurrentView, redirectTo }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  const redirectToRef = useRef<string | undefined>(redirectTo)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const errors: ValidationError[] = []

    const email = (formData.get('email') as string || '').trim()
    const password = formData.get('password') as string

    // Validate email and password inputs
    if (!email) {
      errors.push({ field: 'email', message: 'Please enter your email address' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' })
    }

    if (!password) {
      errors.push({ field: 'password', message: 'Please enter your password' })
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setServerError(null)

    startTransition(async () => {
      const res = await login(null, formData)
      if (res && typeof res === 'string') {
        setServerError(res)
        if (res === 'ACCOUNT_NOT_FOUND') {
          toast('error', 'Account not found. Please create an account to continue.')
        } else if (res === 'INCORRECT_PASSWORD') {
          toast('error', 'Incorrect password. Please try again or reset your password.')
        } else if (!res.includes('Password should be a string')) {
          toast('error', res)
        }
      }
    })
  }

  return (
    <Box
      className="flex w-full flex-col items-center gap-6"
      data-testid="login-page"
    >
      <Box className="flex w-full flex-col gap-6 bg-primary p-4 small:p-5 rounded-2xl border border-gray-100 shadow-sm">
        <Heading as="h2" className="text-xl small:text-2xl font-bold">
          Log in
        </Heading>

        {/* ── Friendly Alert Boxes ────────────────────────────────────────── */}
        {serverError === 'ACCOUNT_NOT_FOUND' && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-sm text-amber-950 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <span className="text-base">⚠️</span>
              <span>Account not found</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Account not found. Please create an account to continue.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
              className="self-start text-xs font-extrabold text-amber-900 underline hover:text-amber-950 mt-1 cursor-pointer"
            >
              Create an account now →
            </button>
          </div>
        )}

        {serverError === 'INCORRECT_PASSWORD' && (
          <div className="rounded-xl bg-red-50 border border-red-300 p-4 text-sm text-red-950 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-red-900">
              <span className="text-base">🔒</span>
              <span>Incorrect password</span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              Incorrect password. Please try again or reset your password.
            </p>
            <button
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
              className="self-start text-xs font-extrabold text-red-900 underline hover:text-red-950 mt-1 cursor-pointer"
            >
              Reset password →
            </button>
          </div>
        )}

        {serverError &&
          serverError !== 'ACCOUNT_NOT_FOUND' &&
          serverError !== 'INCORRECT_PASSWORD' &&
          !serverError.includes('Password should be a string') && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 font-medium">
              {serverError}
            </div>
          )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4">
            {/* Hidden field — carries the checkout redirect URL through the server action */}
            {redirectTo && (
              <input type="hidden" name="redirectTo" value={redirectTo} />
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={
                validationErrors.find((error) => error.field === 'email')
                  ?.message
              }
              data-testid="email-input"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              error={
                validationErrors.find((error) => error.field === 'password')
                  ?.message
              }
              data-testid="password-input"
            />
          </div>
          <Box className="flex flex-col gap-4">
            <SubmitButton
              data-testid="sign-in-button"
              className="mt-6 w-full"
              isLoading={isPending}
            >
              Log in & Continue
            </SubmitButton>
            <Button
              variant="text"
              className="w-full text-xs text-gray-600 hover:text-gray-900 font-semibold"
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
            >
              Forgot password?
            </Button>
          </Box>
        </form>
      </Box>
      <RegisterPrompt setCurrentView={setCurrentView} />
    </Box>
  )
}

export default Login
