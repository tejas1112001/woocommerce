import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { STORE_SETTINGS_MODULE } from "../../modules/store-settings"
import StoreSettingsModuleService from "../../modules/store-settings/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    let storeName = ""

    // 1. Try to get store name from store-settings module first if configured
    try {
      let service: StoreSettingsModuleService
      try {
        service = req.scope.resolve(STORE_SETTINGS_MODULE)
      } catch {
        service = new StoreSettingsModuleService()
      }
      const customBrand = await service.getSetting("store.brand_name")
      if (customBrand && customBrand.trim() && customBrand.trim() !== "Solace E-Commerce Store") {
        storeName = customBrand.trim()
      }
    } catch {}

    // 2. Get store name from core store
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
      storeName = "Store"
    }

    return res.json({
      name: storeName,
    })
  } catch (err: any) {
    return res.json({
      name: "Store",
    })
  }
}
