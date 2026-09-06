import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OTP_VERIFICATION_MODULE } from "../../../../modules/otp-verification"

/**
 * POST /store/otp/verify
 * Verify OTP code for email
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, code } = req.body as { email: string; code: string }

  // Validate input
  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: "Email and verification code are required",
    })
  }

  // Validate OTP format (6 digits)
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({
      success: false,
      message: "Verification code must be 6 digits",
    })
  }

  try {
    const otpService = req.scope.resolve(OTP_VERIFICATION_MODULE)

    // Verify OTP
    const result = await otpService.verifyOTPCode(
      email.toLowerCase(),
      code
    )

    if (!result.success) {
      return res.status(400).json(result)
    }

    req.scope.resolve("logger").info(`OTP verified for ${email}`)

    return res.status(200).json(result)
  } catch (error: any) {
    req.scope.resolve("logger").error(`OTP verify error: ${error.message}`)

    return res.status(500).json({
      success: false,
      message: "Failed to verify code. Please try again.",
    })
  }
}
