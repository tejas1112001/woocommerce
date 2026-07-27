import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function checkTshirt({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const { data: products } = await query.graph({
    entity: 'product',
    fields: [
      'id',
      'title',
      'handle',
      'status',
      'sales_channels.id',
      'sales_channels.name',
      'variants.id',
      'variants.title',
      'variants.manage_inventory',
      'variants.prices.id',
      'variants.prices.amount',
      'variants.prices.currency_code',
    ],
    filters: {
      handle: 't-shirt'
    }
  })
  
  console.log('T-shirt Product details:', JSON.stringify(products, null, 2))
}
