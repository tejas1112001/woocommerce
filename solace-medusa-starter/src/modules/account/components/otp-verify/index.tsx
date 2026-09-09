'use client'

import { useState, useEffect, useRef } from 'react'
import { verifyOTP, resendOTP } from '@lib/data/otp'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { toast } from '@modules/common/components/toast'

type Props = {
  email: string
  onVerified: (token: string) => void
  onBack: () => void
  /**
   * ISO-8601 string returned by the OTP send/resend API (expiresAt).
   * When provided, the countdown is computed from this timestamp so it
   * accurately reflects the remaining time on the server-side OTP record
   * rather than always starting at a fixed 10 minutes.
   */
  expiresAt?: string
}

/** Compute seconds remaining until a given ISO expiry timestamp. */
function secondsUntil(isoString: string): number {
  return Math.max(0, Math.round((new Date(isoString).getTime() - Date.now()) / 1000))
}

const OTPVerify = ({ email, onVerified, onBack, expiresAt }: Props) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialise the countdown from the server-provided expiresAt when available,
  // falling back to the default 10 minutes (600s) for backwards compatibility.
  const [timeLeft, setTimeLeft] = useState(() =>
    expiresAt ? secondsUntil(expiresAt) : 600
  )

  // Resend cooldown — user must wait 60 s between resend requests.
  const [canResend, setCanResend] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ── OTP expiry countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setError(
            'Verification code expired. Click "Resend Code" below to get a new one.'
          )
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // ── Resend cooldown countdown ─────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits are filled
    if (value && index === 5 && newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)

    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)

    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()

    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  // ── Verify ────────────────────────────────────────────────────────────────
  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyOTP(email, otpCode)

      if (result.success && result.token) {
        toast('success', 'Email verified successfully!')
        onVerified(result.token)
      } else {
        setError(result.message)
        setOtp(Array(6).fill(''))
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Failed to verify code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  // ── Resend ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)
    setError(null)

    try {
      const result = await resendOTP(email)

      if (result.success) {
        toast('success', 'New verification code sent!')
        setOtp(Array(6).fill(''))

        // Reset expiry timer — use server-provided expiresAt when available
        setTimeLeft(result.expiresAt ? secondsUntil(result.expiresAt) : 600)

        setCanResend(false)
        setResendCooldown(60)
        inputRefs.current[0]?.focus()
      } else {
        setError(result.message)
      }
    } catch {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  // ── Formatting ────────────────────────────────────────────────────────────
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Whether the code entry box should accept input
  const isCodeExpired = timeLeft === 0
  const inputDisabled = isVerifying || isCodeExpired

  // Resend is available once the 60-second cooldown has elapsed.
  // Importantly, it remains available even when the OTP has expired so the
  // user can recover without having to go back and re-enter their details.
  const resendDisabled = !canResend || isResending

  return (
    <Box className="flex w-full flex-col items-center gap-6">
      <Box className="flex w-full flex-col gap-6 bg-primary p-4 small:p-5">
        {/* Header */}
        <Box className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold small:text-2xl">
            Verify Your Email
          </h2>
          <p className="text-sm text-secondary">
            We&apos;ve sent a 6-digit verification code to{' '}
            <strong>{email}</strong>
          </p>
        </Box>

        {/* OTP Input */}
        <Box className="flex flex-col gap-4">
          <Box className="flex justify-center gap-2 small:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`h-12 w-12 rounded-md border-2 text-center text-xl font-bold small:h-14 small:w-14 small:text-2xl ${
                  error
                    ? 'border-red-500 bg-red-50'
                    : digit
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                } focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                disabled={inputDisabled}
              />
            ))}
          </Box>

          {/* Error Message */}
          {error && (
            <Box className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </Box>
          )}

          {/* Timer */}
          <Box className="flex justify-between text-sm">
            <span className={timeLeft < 60 ? 'text-red-600 font-medium' : 'text-secondary'}>
              {timeLeft > 0 ? (
                <>⏱ Expires in {formatTime(timeLeft)}</>
              ) : (
                <>⏱ Code expired — request a new one below</>
              )}
            </span>
          </Box>
        </Box>

        {/* Verify Button — hidden when expired to encourage resend */}
        {!isCodeExpired && (
          <Button
            onClick={() => handleVerify()}
            disabled={otp.some((digit) => !digit) || isVerifying}
            isLoading={isVerifying}
            className="w-full"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </Button>
        )}

        {/* Resend + Back */}
        <Box className="flex flex-col gap-2">
          <Button
            onClick={handleResend}
            disabled={resendDisabled}
            variant="ghost"
            className="w-full"
          >
            {isResending
              ? 'Sending...'
              : canResend
              ? 'Resend Code'
              : `Resend in ${resendCooldown}s`}
          </Button>

          <button
            onClick={onBack}
            className="text-sm text-secondary hover:text-primary"
            disabled={isVerifying}
          >
            ← Change email address
          </button>
        </Box>

        {/* Help Text */}
        <Box className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-semibold">💡 Tip:</p>
          <p className="mt-1">
            Check your spam folder if you don&apos;t see the email. The code is
            valid for 10 minutes.
          </p>
        </Box>
      </Box>
    </Box>
  )
}

export default OTPVerify
