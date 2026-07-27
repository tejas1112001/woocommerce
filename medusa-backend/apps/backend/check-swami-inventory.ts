import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkSwami({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: items } = await query.graph({
    entity: 'inventory_item',
    fields: ['id', 'sku'],
    filters: { sku: { $like: 'SWAMI-%' } }
  })
  
  console.log('Swami inventory items:', items.length)
}
