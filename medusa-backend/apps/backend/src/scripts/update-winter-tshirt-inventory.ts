import { ExecArgs } from '@medusajs/framework/types'
import {
  ContainerRegistrationKeys,
  Modules,
} from '@medusajs/framework/utils'
import {
  createInventoryLevelsWorkflow,
  updateInventoryLevelsWorkflow,
} from '@medusajs/medusa/core-flows'

const WINTER_TSHIRT_HANDLE = 'winter-t-shirt'
const STOCK_QUANTITY = 10

export default async function updateWinterTshirtInventory({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'handle', 'variants.id', 'variants.sku'],
    filters: { handle: WINTER_TSHIRT_HANDLE },
  })

  const product = products?.[0]
  const variant = product?.variants?.[0]

  if (!product || !variant) {
    throw new Error(`Product not found: ${WINTER_TSHIRT_HANDLE}`)
  }

  const { data: variantInventoryLinks } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'inventory_items.inventory_item_id'],
    filters: { id: variant.id },
  })

  const inventoryItemId =
    variantInventoryLinks?.[0]?.inventory_items?.[0]?.inventory_item_id

  if (!inventoryItemId) {
    throw new Error(
      `No inventory item linked to variant ${variant.id}. Enable "Manage inventory" in Admin.`
    )
  }

  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
  })

  const stockLocation =
    stockLocations?.find((loc) =>
      loc.name?.toLowerCase().includes('main warehouse')
    ) ?? stockLocations?.[0]

  if (!stockLocation) {
    throw new Error('No stock location found')
  }

  const { data: existingLevels } = await query.graph({
    entity: 'inventory_level',
    fields: ['id', 'inventory_item_id', 'location_id', 'stocked_quantity'],
    filters: {
      inventory_item_id: inventoryItemId,
      location_id: stockLocation.id,
    },
  })

  const existingLevel = existingLevels?.[0]

  if (existingLevel) {
    await updateInventoryLevelsWorkflow(container).run({
      input: {
        updates: [
          {
            id: existingLevel.id,
            inventory_item_id: inventoryItemId,
            location_id: stockLocation.id,
            stocked_quantity: STOCK_QUANTITY,
          },
        ],
      },
    })
    logger.info(
      `Updated inventory for "${WINTER_TSHIRT_HANDLE}" to ${STOCK_QUANTITY} at ${stockLocation.name}`
    )
  } else {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: [
          {
            inventory_item_id: inventoryItemId,
            location_id: stockLocation.id,
            stocked_quantity: STOCK_QUANTITY,
          },
        ],
      },
    })
    logger.info(
      `Created inventory level for "${WINTER_TSHIRT_HANDLE}" with ${STOCK_QUANTITY} units at ${stockLocation.name}`
    )
  }
}
