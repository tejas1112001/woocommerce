import { Module } from "@medusajs/framework/utils"
import OtpVerificationService from "./services/otp-verification-service"

export const OTP_VERIFICATION_MODULE = "otpVerification"

export default Module(OTP_VERIFICATION_MODULE, {
  service: OtpVerificationService,
})
