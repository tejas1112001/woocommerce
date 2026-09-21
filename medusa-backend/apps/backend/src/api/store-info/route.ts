import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { STORE_SETTINGS_MODULE } from "../../modules/store-settings"
import StoreSettingsModuleService from "../../modules/store-settings/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Cache at edge/CDN for 5 minutes, allow stale while revalidating
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600")

    let storeName = ""
    let logoUrl = ""
    let supportEmail = ""
    let supportPhone = ""
    let defaultCurrency = "INR"

    let service: StoreSettingsModuleService
    try {
      service = req.scope.resolve(STORE_SETTINGS_MODULE)
    } catch {
      service = new StoreSettingsModuleService()
    }

    try {
      const customBrand = await service.getSetting("store.brand_name")
      if (customBrand && customBrand.trim() && customBrand.trim() !== "Solace E-Commerce Store") {
        storeName = customBrand.trim()
      }
      logoUrl = await service.getSetting("store.logo_url")
      supportEmail = await service.getSetting("store.support_email")
      supportPhone = await service.getSetting("store.support_phone")
      defaultCurrency = (await service.getSetting("store.default_currency")) || "INR"
    } catch (e) {
      console.warn("Error fetching store settings in /store-info:", e)
    }

    // 2. Fallback to core store name if not specified in store-settings
    if (!storeName) {
      try {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
        const { data: stores } = await query.graph({
          entity: "store",
          fields: ["id", "name"],
        })
        if (stores && stores.length > 0 && stores[0].name) {
          storeName = stores[0].name
        }
      } catch {
        try {
          const storeService = req.scope.resolve(Modules.STORE)
          const stores = await storeService.listStores({}, { select: ["id", "name"] })
          if (stores && stores.length > 0 && stores[0].name) {
            storeName = stores[0].name
          }
        } catch {}
      }
    }

    if (!storeName) {
      storeName = "Swami Om Enterprises"
    }

    return res.json({
      name: storeName,
      logo_url: logoUrl || "",
      support_email: supportEmail || "support@swamiomenterprises.in",
      support_phone: supportPhone || "+91 7385677447",
      default_currency: defaultCurrency || "INR",
    })
  } catch (err: any) {
    return res.json({
      name: "Swami Om Enterprises",
      logo_url: "",
      support_email: "support@swamiomenterprises.in",
      support_phone: "+91 7385677447",
      default_currency: "INR",
    })
  }
}
