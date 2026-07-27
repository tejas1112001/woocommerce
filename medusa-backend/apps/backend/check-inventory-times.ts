import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkInventoryTimes({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: items } = await query.graph({
    entity: 'inventory_item',
    fields: ['id', 'sku', 'created_at'],
  })
  
  console.log('Items created times:', JSON.stringify(items, null, 2))
}
