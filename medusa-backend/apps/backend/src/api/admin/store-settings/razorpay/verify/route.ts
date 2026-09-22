import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_SETTINGS_MODULE } from "../../../../../modules/store-settings"
import StoreSettingsModuleService from "../../../../../modules/store-settings/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    let service: StoreSettingsModuleService
    try {
      service = req.scope.resolve(STORE_SETTINGS_MODULE)
    } catch {
      service = new StoreSettingsModuleService()
    }

    const body = req.body as { key_id?: string; key_secret?: string }
    
    let keyId = body.key_id
    let keySecret = body.key_secret

    if (!keyId || keyId.includes("••••••••")) {
      keyId = await service.getSetting("razorpay.key_id", false)
    }

    if (!keySecret || keySecret.includes("••••••••")) {
      keySecret = await service.getSetting("razorpay.key_secret", true)
    }

    if (!keyId || !keySecret) {
      return res.status(400).json({
        status: "missing_credentials",
        connected: false,
        message: "Razorpay Key ID and Key Secret must be provided.",
      })
    }

    // Call Razorpay orders test endpoint with Basic Auth
    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64")
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders?count=1", {
      headers: {
        Authorization: authHeader,
      },
    })

    if (razorpayRes.ok) {
      return res.json({
        status: "connected",
        connected: true,
        message: "Successfully connected to Razorpay API!",
      })
    }

    if (razorpayRes.status === 401) {
      return res.status(400).json({
        status: "invalid_credentials",
        connected: false,
        message: "Authentication failed. Key ID or Key Secret is invalid.",
      })
    }

    const errData = await razorpayRes.json().catch(() => ({}))
    return res.status(400).json({
      status: "error",
      connected: false,
      message: errData.error?.description || `Razorpay returned status ${razorpayRes.status}`,
    })
  } catch (error: any) {
    console.error("Error testing Razorpay connection:", error)
    return res.status(500).json({
      status: "server_error",
      connected: false,
      message: error.message || String(error),
    })
  }
}
