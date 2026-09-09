import { model } from "@medusajs/framework/utils"

/**
 * OTP Verification Model
 * Stores OTP codes for email verification during registration
 */
const OtpVerification = model.define("otp_verification", {
  id: model.id().primaryKey(),
  email: model.text().unique(),
  otp_code: model.text(),
  attempts: model.number().default(0),
  expires_at: model.dateTime(),
  verified: model.boolean().default(false),
  resend_count: model.number().default(0),
  last_resend_at: model.dateTime().nullable(),
  ip_address: model.text().nullable(),
  user_agent: model.text().nullable(),
})

export default OtpVerification
