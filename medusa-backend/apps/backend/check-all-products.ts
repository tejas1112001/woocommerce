import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkProducts({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'created_at', 'updated_at'],
  })
  
  console.log('All products:', JSON.stringify(products, null, 2))
}
