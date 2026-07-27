import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkInventory({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: items } = await query.graph({
    entity: 'inventory_item',
    fields: ['id', 'sku'],
  })

  console.log("Total Inventory Items:", items.length)
  
  const { data: links } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'inventory_items.*', 'inventory_items.inventory_item_id'],
  })
  
  console.log("Variant links:", JSON.stringify(links, null, 2))
}
