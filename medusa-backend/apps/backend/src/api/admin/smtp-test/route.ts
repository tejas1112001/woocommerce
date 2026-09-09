import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import nodemailer from "nodemailer"

type SmtpTestRequest = MedusaRequest<{
  to: string
}>

export const POST = async (req: SmtpTestRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
  const storeSettingsService = req.scope.resolve("storeSettingsModule")

  try {
    const { to } = req.body

    if (!to) {
      return res.status(400).json({
        message: "Email address is required",
      })
    }

    // Get SMTP settings from store settings
    const host = await storeSettingsService.getSetting("smtp.host", true)
    const port = await storeSettingsService.getSetting("smtp.port", true)
    const user = await storeSettingsService.getSetting("smtp.user", true)
    const password = await storeSettingsService.getSetting("smtp.password", true)
    const fromEmail = await storeSettingsService.getSetting("smtp.from_email", true)
    const fromName = await storeSettingsService.getSetting("smtp.from_name", true)

    if (!host || !user || !password) {
      return res.status(400).json({
        message: "SMTP configuration is incomplete. Please configure SMTP settings first.",
      })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || "587"),
      secure: false,
      auth: {
        user,
        pass: password,
      },
    })

    // Verify connection
    await transporter.verify()

    // Send test email
    const info = await transporter.sendMail({
      from: `${fromName || "Store Admin"} <${fromEmail || user}>`,
      to,
      subject: "✅ SMTP Test Email - Configuration Successful",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #16a34a;">✅ SMTP Configuration Test Successful!</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your SMTP email configuration is working correctly. This test email confirms that your store can send emails successfully.
            </p>
            <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 20px 0;">
              <strong style="color: #16a34a;">Configuration Details:</strong>
              <ul style="color: #666; margin: 10px 0;">
                <li>SMTP Host: ${host}</li>
                <li>SMTP Port: ${port}</li>
                <li>From: ${fromName || "Store Admin"}</li>
                <li>From Email: ${fromEmail || user}</li>
              </ul>
            </div>
            <p style="color: #666;">
              <strong>What this means:</strong>
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>✅ OTP verification emails will be delivered</li>
              <li>✅ Order confirmation emails will work</li>
              <li>✅ All transactional emails are functional</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              Test email sent from Medusa Admin at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
      text: `
SMTP Configuration Test Successful!

Your SMTP email configuration is working correctly.

Configuration Details:
- SMTP Host: ${host}
- SMTP Port: ${port}
- From: ${fromName || "Store Admin"} <${fromEmail || user}>

What this means:
✅ OTP verification emails will be delivered
✅ Order confirmation emails will work
✅ All transactional emails are functional

Test email sent from Medusa Admin at ${new Date().toLocaleString()}
      `,
    })

    logger.info(`Test email sent successfully to ${to}, Message ID: ${info.messageId}`)

    return res.status(200).json({
      message: "Test email sent successfully",
      messageId: info.messageId,
      to,
    })
  } catch (error: any) {
    logger.error("Failed to send test email:", error)
    return res.status(500).json({
      message: error.message || "Failed to send test email",
    })
  }
}
