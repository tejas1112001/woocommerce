import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkAllInventory({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: items } = await query.graph({
    entity: 'inventory_item',
    fields: ['id', 'sku'],
  })
  
  console.log('Total inventory items:', items.length)
  console.log('All inventory items:', JSON.stringify(items, null, 2))
}
