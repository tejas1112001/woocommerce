import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkMissing({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: variants } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'manage_inventory', 'inventory_items.*'],
  })
  
  const missing = variants.filter(v => v.manage_inventory && (!v.inventory_items || v.inventory_items.length === 0))
  
  console.log('Variants missing inventory items:', missing.length)
  console.log(JSON.stringify(missing, null, 2))
}
