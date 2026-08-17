import { model } from "@medusajs/framework/utils"

const StoreSetting = model.define("store_setting", {
  id: model.id().primaryKey(),
  key: model.text(),
  value: model.text(),
  is_secret: model.boolean().default(false),
})

export default StoreSetting
