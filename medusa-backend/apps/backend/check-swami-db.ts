import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkSwamiDb({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: variants } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'manage_inventory'],
    filters: { sku: { $like: 'SWAMI-%' } }
  })
  
  console.log('Swami variants:', JSON.stringify(variants, null, 2))
}
