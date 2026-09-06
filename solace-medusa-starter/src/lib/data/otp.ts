'use server'

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

/**
 * Get headers with publishable API key
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (PUBLISHABLE_KEY) {
    headers['x-publishable-api-key'] = PUBLISHABLE_KEY
  }
  
  return headers
}

/**
 * Structured error codes returned by the OTP backend routes.
 * EMAIL_EXISTS — the email is already registered; offer sign-in instead.
 */
export type OTPErrorCode = 'EMAIL_EXISTS' | string

export type SendOTPResult = {
  success: boolean
  message: string
  expiresAt?: string
  /** Structured error code for programmatic handling on the frontend. */
  errorCode?: OTPErrorCode
}

/**
 * Send OTP to email.
 * On failure the result carries an optional `errorCode` so callers can
 * distinguish "email already exists" from generic send errors and render
 * appropriate UI (e.g., offer the user a direct "Sign in" path).
 */
export async function sendOTP(email: string): Promise<SendOTPResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/otp/send`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to send verification code',
        errorCode: data.errorCode,
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    }
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  email: string,
  code: string
): Promise<{
  success: boolean
  message: string
  token?: string
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/otp/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to verify code',
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    }
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string): Promise<SendOTPResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/store/otp/resend`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to resend verification code',
        errorCode: data.errorCode,
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
    }
  }
}
