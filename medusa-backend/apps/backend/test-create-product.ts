import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function testCreateProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { result } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Test Product',
          options: [{ title: 'Size', values: ['S'] }],
          variants: [
            {
              title: 'S',
              sku: 'TEST-S',
              options: { Size: 'S' },
              manage_inventory: true, // Let's try explicitly true
            },
          ],
        },
      ],
    },
  })

  logger.info(`Created product: ${result[0].id}`)
  
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: items } = await query.graph({
    entity: 'inventory_item',
    fields: ['id', 'sku'],
  })
  logger.info(`Total Inventory Items: ${items.length}`)
}
