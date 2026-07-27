import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function testCreateProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { result } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Test Product 2',
          options: [{ title: 'Size', values: ['S'] }],
          variants: [
            {
              title: 'S',
              sku: 'TEST-S-2',
              options: { Size: 'S' },
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
    filters: { sku: 'TEST-S-2' }
  })
  logger.info(`Inventory Items for TEST-S-2: ${items.length}`)
}
