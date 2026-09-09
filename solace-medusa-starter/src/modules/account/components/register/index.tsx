'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { passwordRequirements } from '@lib/constants'
import { signup } from '@lib/data/customer'
import { sendOTP } from '@lib/data/otp'
import { cn } from '@lib/util/cn'
import { validatePassword, ValidationError } from '@lib/util/validator'
import { LOGIN_VIEW } from '@modules/account/templates/login-template'
import ErrorMessage from '@modules/checkout/components/error-message'
import { SubmitButton } from '@modules/checkout/components/submit-button'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Checkbox } from '@modules/common/components/checkbox'
import { Heading } from '@modules/common/components/heading'
import { Input } from '@modules/common/components/input'
import { Label } from '@modules/common/components/label'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { toast } from '@modules/common/components/toast'
import { CheckCircleIcon, XCircleIcon } from '@modules/common/icons'
import OTPVerify from '@modules/account/components/otp-verify'

import LoginPrompt from './login-prompt'

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  /** When set, the registration form will redirect here after successful account
   *  creation instead of the generic /account page.  Used by the checkout guard. */
  redirectTo?: string
}

/** Phase of the multi-step registration flow. */
type RegistrationPhase = 'form' | 'email_exists' | 'otp' | 'creating'

// ─── Email-exists recovery banner ────────────────────────────────────────────
/**
 * Friendly inline card shown when the user tries to register with an email
 * that already has an account.  It offers a direct path to sign-in (including
 * preserving any checkout `redirectTo` context) so the user never has to
 * manually switch tabs or lose their cart.
 */
function EmailExistsBanner({
  email,
  onSignIn,
  onTryDifferent,
}: {
  email: string
  onSignIn: () => void
  onTryDifferent: () => void
}) {
  return (
    <Box className="flex w-full flex-col gap-6 bg-primary p-4 small:p-5">
      {/* Icon + heading */}
      <Box className="flex flex-col items-center gap-3 pt-2 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl">
          👤
        </span>
        <Heading as="h2" className="text-xl small:text-2xl">
          Account already exists
        </Heading>
        <p className="text-sm text-secondary max-w-xs">
          An account for{' '}
          <strong className="break-all text-primary">{email}</strong> already
          exists. Sign in to continue — your cart and checkout progress are
          saved.
        </p>
      </Box>

      {/* Primary CTA */}
      <Button className="w-full" onClick={onSignIn}>
        Sign in to my account
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-basic-primary" />
        <span className="text-xs text-secondary">or</span>
        <div className="h-px flex-1 bg-basic-primary" />
      </div>

      {/* Secondary CTA */}
      <Button variant="tonal" className="w-full" onClick={onTryDifferent}>
        Use a different email
      </Button>
    </Box>
  )
}

// ─── Register component ───────────────────────────────────────────────────────
const Register = ({ setCurrentView, redirectTo }: Props) => {
  const router = useRouter()

  const [isReadAgreements, setIsReadAgreements] = useState(false)
  const [localMessage, setLocalMessage] = useState<string | null>(null)
  const [message, formAction, isPending] = useActionState(signup, null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // ── Multi-step flow state ────────────────────────────────────────────────
  const [phase, setPhase] = useState<RegistrationPhase>('form')
  const [formDataState, setFormDataState] = useState<FormData | null>(null)
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  /** ISO timestamp returned by the OTP send/resend API — passed to OTPVerify for accurate countdown. */
  const [otpExpiresAt, setOtpExpiresAt] = useState<string | undefined>(undefined)
  /**
   * Email that triggered the "account already exists" state.
   * Used to populate the EmailExistsBanner with the exact address the user typed.
   */
  const [existingEmail, setExistingEmail] = useState<string>('')

  /**
   * Stable ref to the current redirectTo value so the client-side fallback
   * navigator always has access even after the form is unmounted (OTP phase).
   */
  const redirectToRef = useRef<string | undefined>(redirectTo)
  useEffect(() => {
    redirectToRef.current = redirectTo
  }, [redirectTo])

  // ── Form submit — validate → check email → send OTP ─────────────────────
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const errors: ValidationError[] = []

    if (!formData.get('first_name'))
      errors.push({ field: 'first_name', message: 'Please enter your first name' })
    if (!formData.get('last_name'))
      errors.push({ field: 'last_name', message: 'Please enter your last name' })
    if (!formData.get('email'))
      errors.push({ field: 'email', message: 'Please enter your email' })
    if (!formData.get('password'))
      errors.push({ field: 'password', message: 'Please enter your password' })

    if (!isReadAgreements) {
      errors.push({
        field: 'is_read_agreements',
        message: 'Please agree to Terms & Conditions and Privacy Policy',
      })
    }

    const password = formData.get('password') as string
    const passwordErrors = validatePassword(password)
    passwordErrors.forEach((msg) => errors.push({ field: 'password', message: msg }))

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setIsSendingOTP(true)

    const email = (formData.get('email') as string).toLowerCase().trim()
    const otpResult = await sendOTP(email)

    setIsSendingOTP(false)

    if (otpResult.success) {
      setFormDataState(formData)
      setOtpExpiresAt(otpResult.expiresAt)
      setPhase('otp')
      toast('success', 'Verification code sent to your email!')
    } else if (otpResult.errorCode === 'EMAIL_EXISTS') {
      // ── Early interception: show friendly recovery banner ──
      setExistingEmail(email)
      setPhase('email_exists')
    } else {
      toast('error', otpResult.message)
    }
  }

  // ── OTP verified → dispatch signup server action ─────────────────────────
  const handleOTPVerified = (verificationToken: string) => {
    if (!formDataState) return
    // Clone the formData so we don't mutate the original
    const fd = new FormData()
    formDataState.forEach((value, key) => {
      fd.set(key, value)
    })
    fd.set('verification_token', verificationToken)
    // Ensure redirectTo is present — use the ref as a safety net in case
    // the hidden field was somehow not captured in the original formData.
    if (redirectToRef.current && !fd.get('redirectTo')) {
      fd.set('redirectTo', redirectToRef.current)
    }
    setPhase('creating')
    startTransition(() => {
      formAction(fd)
    })
  }

  const handleBackFromOTP = () => {
    setPhase('form')
    setFormDataState(null)
    setOtpExpiresAt(undefined)
  }

  // ── Handle server action response ────────────────────────────────────────
  useEffect(() => {
    if (message && typeof message === 'string') {
      setLocalMessage(message)
    }
  }, [message])

  useEffect(() => {
    if (!localMessage) return

    if (localMessage.startsWith('EMAIL_EXISTS:')) {
      // Structured prefix set by the signup server action — extract email.
      const emailFromMessage = localMessage.replace('EMAIL_EXISTS:', '').trim()
      setExistingEmail(emailFromMessage || existingEmail)
      // Reset to form phase first so React reconciles cleanly, then show banner.
      setPhase('email_exists')
      setLocalMessage(null)
      return
    }

    // Legacy fallback — Medusa sometimes surfaces the error with this substring.
    if (
      localMessage.toLowerCase().includes('identity with email') ||
      localMessage.toLowerCase().includes('already exists')
    ) {
      setExistingEmail(existingEmail || '')
      setPhase('email_exists')
      setLocalMessage(null)
      return
    }

    if (localMessage.includes('Password should be a string')) {
      setLocalMessage(null)
      return
    }

    toast('error', localMessage)
    setLocalMessage(null)
    // If there was an error during account creation, go back to the form
    if (phase === 'creating') {
      setPhase('form')
    }
  }, [localMessage])

  // ── Client-side fallback navigation after successful signup ──────────────
  // The server action calls redirect() which should navigate automatically.
  // This fallback fires if the server redirect doesn't cause navigation
  // (e.g., due to cookie/session race conditions in development).
  useEffect(() => {
    if (phase === 'creating' && !isPending && message === null) {
      const destination = redirectToRef.current ?? '/account'
      const timer = setTimeout(() => {
        window.location.href = destination
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [phase, isPending, message])

  // ── Email-exists banner — before OTP is even sent ────────────────────────
  if (phase === 'email_exists') {
    return (
      <Box className="flex w-full flex-col items-center gap-6" data-testid="register-page">
        <EmailExistsBanner
          email={existingEmail}
          onSignIn={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          onTryDifferent={() => {
            setPhase('form')
            setExistingEmail('')
            setFormDataState(null)
          }}
        />
      </Box>
    )
  }

  // ── OTP verification screen ───────────────────────────────────────────────
  if (phase === 'otp' && formDataState) {
    return (
      <OTPVerify
        email={formDataState.get('email') as string}
        onVerified={handleOTPVerified}
        onBack={handleBackFromOTP}
        expiresAt={otpExpiresAt}
      />
    )
  }

  // ── Creating account screen ───────────────────────────────────────────────
  if (phase === 'creating') {
    return (
      <Box className="flex w-full flex-col items-center gap-6" data-testid="register-page">
        <Box className="flex w-full flex-col items-center gap-6 bg-primary p-8 small:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Heading as="h2" className="text-xl small:text-2xl text-center">
            Email Verified!
          </Heading>
          <p className="text-sm text-secondary text-center">
            Creating your account and redirecting you to checkout...
          </p>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Please wait...
          </div>
        </Box>
      </Box>
    )
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <Box
      className="flex w-full flex-col items-center gap-6"
      data-testid="register-page"
    >
      <Box className="flex w-full flex-col gap-6 bg-primary p-4 small:p-5">
        <Heading as="h2" className="text-xl small:text-2xl">
          Create account
        </Heading>
        <form className="flex w-full flex-col" onSubmit={handleSubmit}>
          <Box className="flex w-full flex-col gap-y-4">
            {/* Hidden field — carries the checkout redirect URL through the server
                action so newly registered customers return to checkout, not /account. */}
            {redirectTo && (
              <input type="hidden" name="redirectTo" value={redirectTo} />
            )}
            <Box className="grid grid-cols-1 gap-4 small:grid-cols-2">
              <Input
                label="First Name"
                name="first_name"
                required
                autoComplete="given-name"
                error={
                  validationErrors.find((e) => e.field === 'first_name')?.message
                }
                data-testid="first-name-input"
              />
              <Input
                label="Last Name"
                name="last_name"
                required
                autoComplete="family-name"
                error={
                  validationErrors.find((e) => e.field === 'last_name')?.message
                }
                data-testid="last-name-input"
              />
            </Box>
            <Box className="grid grid-cols-1 gap-4 small:grid-cols-2">
              <Input
                label="Email"
                name="email"
                required
                type="email"
                autoComplete="email"
                error={
                  validationErrors.find((e) => e.field === 'email')?.message
                }
                data-testid="email-input"
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
                data-testid="phone-input"
              />
            </Box>
            <Input
              label="Password"
              name="password"
              required
              type="password"
              autoComplete="new-password"
              error={
                validationErrors.find((e) => e.field === 'password')?.message
              }
              data-testid="password-input"
            />
            <Box className="flex flex-col gap-y-2 border border-basic-primary p-4">
              {passwordRequirements.map((item, id) => {
                const isValid = !validationErrors.some((e) => e.message === item)
                return (
                  <Box
                    key={id}
                    className={cn('flex items-center gap-2 text-secondary', {
                      'border-negative': !isValid,
                    })}
                  >
                    {isValid ? (
                      <CheckCircleIcon />
                    ) : (
                      <XCircleIcon className="text-negative" />
                    )}
                    <Label
                      size="sm"
                      className={cn({ 'text-negative': !isValid })}
                    >
                      {item}
                    </Label>
                  </Box>
                )
              })}
            </Box>
          </Box>
          <Box className="mt-6 flex items-center gap-x-2">
            <Checkbox
              id="is_read_agreements"
              name="is_read_agreements"
              checked={isReadAgreements}
              onChange={() => setIsReadAgreements(!isReadAgreements)}
              className={cn({
                'border-negative': validationErrors.find(
                  (e) => e.field === 'is_read_agreements'
                )?.message,
              })}
            />
            <Label
              htmlFor="is_read_agreements"
              className="cursor-pointer !text-md"
            >
              I read and agree to Terms & Conditions and Privacy Policy.
            </Label>
          </Box>
          {validationErrors.find((e) => e.field === 'is_read_agreements') && (
            <ErrorMessage
              error={
                validationErrors.find((e) => e.field === 'is_read_agreements')
                  ?.message
              }
              data-testid="agreements-error"
            />
          )}
          <SubmitButton
            className="mt-6 w-full"
            data-testid="register-button"
            disabled={isSendingOTP}
          >
            {isSendingOTP
              ? 'Sending verification code...'
              : 'Continue'}
          </SubmitButton>
        </form>
      </Box>
      <LoginPrompt setCurrentView={setCurrentView} />
    </Box>
  )
}

export default Register
