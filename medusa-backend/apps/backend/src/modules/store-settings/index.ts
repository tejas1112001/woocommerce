import StoreSettingsModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const STORE_SETTINGS_MODULE = "storeSettingsModule"

export default Module(STORE_SETTINGS_MODULE, {
  service: StoreSettingsModuleService,
})
