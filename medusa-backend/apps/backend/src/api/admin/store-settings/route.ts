import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { STORE_SETTINGS_MODULE } from "../../../modules/store-settings"
import StoreSettingsModuleService from "../../../modules/store-settings/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    let service: StoreSettingsModuleService
    try {
      service = req.scope.resolve(STORE_SETTINGS_MODULE)
    } catch {
      service = new StoreSettingsModuleService()
    }

    const settings = await service.getAllSettings(false)
    return res.json({ settings })
  } catch (error: any) {
    console.error("Error in GET /admin/store-settings:", error)
    return res.status(500).json({
      message: "Failed to fetch store settings",
      error: error.message || String(error),
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { settings?: Record<string, any> }
    if (!body || !body.settings) {
      return res.status(400).json({ message: "Invalid payload, 'settings' map required" })
    }

    let service: StoreSettingsModuleService
    try {
      service = req.scope.resolve(STORE_SETTINGS_MODULE)
    } catch {
      service = new StoreSettingsModuleService()
    }

    const secretKeys = new Set(["razorpay.key_secret", "razorpay.webhook_secret"])

    for (const [key, val] of Object.entries(body.settings)) {
      let strVal = ""
      let isSecret = secretKeys.has(key)

      if (typeof val === "object" && val !== null) {
        strVal = val.value !== undefined ? String(val.value) : ""
        if (val.is_secret !== undefined) isSecret = Boolean(val.is_secret)
      } else {
        strVal = String(val ?? "")
      }

      await service.setSetting(key, strVal, isSecret)
    }

    const updatedSettings = await service.getAllSettings(false)
    return res.json({
      message: "Store settings updated successfully",
      settings: updatedSettings,
    })
  } catch (error: any) {
    console.error("Error in POST /admin/store-settings:", error)
    return res.status(500).json({
      message: "Failed to update store settings",
      error: error.message || String(error),
    })
  }
}
