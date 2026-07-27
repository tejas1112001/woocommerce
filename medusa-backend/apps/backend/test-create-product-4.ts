import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function testCreateProduct({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { result } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: 'Test Product 4',
          options: [{ title: 'Size', values: ['S', 'M'] }],
          variants: [
            {
              title: 'S',
              sku: 'TEST-S-4',
              options: { Size: 'S' },
            },
            {
              title: 'M',
              sku: 'TEST-M-4',
              options: { Size: 'M' },
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
    filters: { sku: { $like: 'TEST-%-4' } }
  })
  logger.info(`Inventory Items for TEST-4: ${items.length}`)
}
