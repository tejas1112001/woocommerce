import { MedusaService } from "@medusajs/framework/utils"
import StoreSetting from "./models/store-setting"
import { encrypt, decrypt, maskSecret, isMasked } from "./utils/crypto"
import fs from "fs"
import path from "path"

const FALLBACK_FILE_PATH = path.resolve(process.cwd(), "static", "store-settings-store.json")

interface SettingPayload {
  key: string
  value: string
  is_secret?: boolean
}

class StoreSettingsModuleService extends MedusaService({
  StoreSetting,
}) {
  private readFallbackStore(): Record<string, { value: string; is_secret: boolean }> {
    try {
      if (fs.existsSync(FALLBACK_FILE_PATH)) {
        const raw = fs.readFileSync(FALLBACK_FILE_PATH, "utf-8")
        return JSON.parse(raw)
      }
    } catch (e) {
      console.warn("Failed to read fallback store settings file:", e)
    }
    return {}
  }

  private writeFallbackStore(data: Record<string, { value: string; is_secret: boolean }>) {
    try {
      const dir = path.dirname(FALLBACK_FILE_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
    } catch (e) {
      console.warn("Failed to write fallback store settings file:", e)
    }
  }

  async getSetting(key: string, decryptSecret: boolean = false): Promise<string> {
    // 1. Check DB first
    try {
      const settings = await (this as any).listStoreSettings({ key })
      if (settings && settings.length > 0) {
        const setting = settings[0]
        if (setting.is_secret) {
          return decryptSecret ? decrypt(setting.value) : maskSecret(decrypt(setting.value))
        }
        return setting.value
      }
    } catch (err) {
      // Table might not exist yet before migration
    }

    // 2. Check Fallback File
    const fallback = this.readFallbackStore()
    if (fallback[key]) {
      const item = fallback[key]
      if (item.is_secret) {
        const raw = decrypt(item.value)
        return decryptSecret ? raw : maskSecret(raw)
      }
      return item.value
    }

    // 3. Environment Variable Defaults
    if (key === "razorpay.mode") {
      return process.env.RAZORPAY_MODE || "test"
    }
    if (key === "razorpay.key_id") {
      return process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_ID || ""
    }
    if (key === "razorpay.key_secret") {
      const sec = process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_SECRET || ""
      return decryptSecret ? sec : maskSecret(sec)
    }
    if (key === "razorpay.webhook_secret") {
      const sec = process.env.RAZORPAY_TEST_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || ""
      return decryptSecret ? sec : maskSecret(sec)
    }
    if (key === "razorpay.auto_capture") {
      return process.env.RAZORPAY_AUTO_CAPTURE || "true"
    }

    // General Store Setting defaults
    if (key === "store.maintenance_mode") return "false"
    if (key === "store.brand_name") return "Solace E-Commerce Store"
    if (key === "store.support_email") return "support@solace-store.com"

    return ""
  }

  async getAllSettings(includeDecryptedSecrets: boolean = false): Promise<Record<string, { value: string; is_secret: boolean; raw_masked?: string }>> {
    const keys = [
      "razorpay.mode",
      "razorpay.key_id",
      "razorpay.key_secret",
      "razorpay.webhook_secret",
      "razorpay.auto_capture",
      "store.maintenance_mode",
      "store.brand_name",
      "store.support_email",
      "store.support_phone",
      "store.default_currency",
    ]

    const secretKeys = new Set(["razorpay.key_secret", "razorpay.webhook_secret"])
    const result: Record<string, { value: string; is_secret: boolean; raw_masked?: string }> = {}

    for (const key of keys) {
      const isSecret = secretKeys.has(key)
      const val = await this.getSetting(key, includeDecryptedSecrets)
      result[key] = {
        value: val,
        is_secret: isSecret,
      }
    }

    return result
  }

  async setSetting(key: string, value: string, isSecret: boolean = false): Promise<void> {
    let finalValue = value

    // If it's a secret key and the user provided a masked value, don't overwrite with mask
    if (isSecret) {
      if (isMasked(value)) {
        // Skip updating secret if user didn't modify masked string
        return
      }
      finalValue = encrypt(value)
    }

    // 1. Try updating database record
    let dbUpdated = false
    try {
      const existing = await (this as any).listStoreSettings({ key })
      if (existing && existing.length > 0) {
        await (this as any).updateStoreSettings({
          id: existing[0].id,
          value: finalValue,
          is_secret: isSecret,
        })
      } else {
        await (this as any).createStoreSettings({
          key,
          value: finalValue,
          is_secret: isSecret,
        })
      }
      dbUpdated = true
    } catch (err) {
      console.warn(`Could not save setting '${key}' to DB (migration pending), storing in fallback file:`, err)
    }

    // 2. Always sync to fallback file as well for high availability
    const store = this.readFallbackStore()
    store[key] = {
      value: finalValue,
      is_secret: isSecret,
    }
    this.writeFallbackStore(store)
  }
}

export default StoreSettingsModuleService
