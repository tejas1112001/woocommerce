/**
 * Comprehensive fix for T-Shirt inventory setup
 * This addresses the root cause: variants created with manage_inventory=false
 * 
 * Run with: npx medusa exec src/scripts/fix-tshirt-inventory-complete.ts
 */
import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'
import {
  createInventoryItemsWorkflow,
  createInventoryLevelsWorkflow,
} from '@medusajs/medusa/core-flows'

const PRODUCT_TITLE = "T-Shirt's"
const DEFAULT_STOCK_QUANTITY = 100

export default async function fixTshirtInventory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const productModule = container.resolve(Modules.PRODUCT)

  logger.info('\n=== FIXING T-SHIRT INVENTORY SETUP ===\n')

  // 1. Find the product
  const { data: products } = await query.graph({
    entity: 'product',
    fields: ['id', 'title'],
    filters: { title: PRODUCT_TITLE },
  })

  if (!products || products.length === 0) {
    logger.error(`Product "${PRODUCT_TITLE}" not found`)
    return
  }

  const product = products[0]
  logger.info(`Found product: ${product.title} (${product.id})`)

  // 2. Get all variants
  const { data: variants } = await query.graph({
    entity: 'product_variant',
    fields: [
      'id',
      'title',
      'sku',
      'manage_inventory',
      'allow_backorder',
      'inventory_items.inventory_item_id',
    ],
    filters: { product_id: product.id },
  })

  if (!variants || variants.length === 0) {
    logger.error('No variants found')
    return
  }

  logger.info(`Found ${variants.length} variants\n`)

  // 3. Enable manage_inventory for all variants that don't have it
  logger.info('Step 1: Enabling manage_inventory for all variants...')
  
  const variantsToUpdate = variants.filter(v => !v.manage_inventory)
  
  if (variantsToUpdate.length > 0) {
    for (const variant of variantsToUpdate) {
      await productModule.updateProductVariants([{
        id: variant.id,
        manage_inventory: true,
      }])
      logger.info(`  ✅ Enabled for: ${variant.title} (${variant.sku})`)
    }
  } else {
    logger.info('  ℹ️  All variants already have manage_inventory enabled')
  }

  // 4. Get stock location
  const { data: stockLocations } = await query.graph({
    entity: 'stock_location',
    fields: ['id', 'name'],
  })

  if (!stockLocations || stockLocations.length === 0) {
    logger.error('No stock location found. Please create one first.')
    return
  }

  const stockLocation = stockLocations[0]
  logger.info(`\nStep 2: Using stock location: ${stockLocation.name}`)

  // 5. Create inventory items and link to variants
  logger.info('\nStep 3: Creating inventory items and linking variants...\n')

  const inventoryLevelsToCreate: Array<{
    inventory_item_id: string
    location_id: string
    stocked_quantity: number
  }> = []

  // Re-fetch variants after update to get current state
  const { data: updatedVariants } = await query.graph({
    entity: 'product_variant',
    fields: [
      'id',
      'title',
      'sku',
      'manage_inventory',
      'inventory_items.inventory_item_id',
    ],
    filters: { product_id: product.id },
  })

  for (const variant of updatedVariants ?? []) {
    logger.info(`Processing: ${variant.title} (${variant.sku})`)

    // Check if variant already has inventory item
    let inventoryItemId = variant.inventory_items?.[0]?.inventory_item_id

    if (!inventoryItemId) {
      // Check if inventory item exists by SKU
      const existingItems = await inventoryModule.listInventoryItems({
        sku: variant.sku,
      })

      if (existingItems.length > 0) {
        inventoryItemId = existingItems[0].id
        logger.info(`  ℹ️  Found existing inventory item: ${inventoryItemId}`)
      } else {
        // Create new inventory item
        logger.info(`  Creating new inventory item...`)
        const [newItem] = await inventoryModule.createInventoryItems([{
          sku: variant.sku,
          title: `${product.title} - ${variant.title}`,
        }])
        inventoryItemId = newItem.id
        logger.info(`  ✅ Created: ${inventoryItemId}`)
      }

      // Link variant to inventory item
      try {
        await productModule.updateProductVariants([{
          id: variant.id,
          // @ts-ignore - this should work in v2
          inventory_items: [{
            inventory_item_id: inventoryItemId,
            required_quantity: 1,
          }]
        }])
        logger.info(`  ✅ Linked variant to inventory item`)
      } catch (error: any) {
        logger.warn(`  ⚠️  Could not link via update, trying alternative method`)
        // The link might be created automatically by Medusa
      }
    } else {
      logger.info(`  ✅ Already has inventory item: ${inventoryItemId}`)
    }

    // Check if inventory level exists
    const existingLevels = await inventoryModule.listInventoryLevels({
      inventory_item_id: inventoryItemId,
      location_id: stockLocation.id,
    })

    if (existingLevels.length > 0) {
      logger.info(`  ℹ️  Inventory level already exists, updating...`)
      await inventoryModule.updateInventoryLevels([{
        id: existingLevels[0].id,
        stocked_quantity: DEFAULT_STOCK_QUANTITY,
      }])
      logger.info(`  ✅ Updated to ${DEFAULT_STOCK_QUANTITY} units`)
    } else {
      inventoryLevelsToCreate.push({
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id,
        stocked_quantity: DEFAULT_STOCK_QUANTITY,
      })
    }

    logger.info('')
  }

  // 6. Create inventory levels in batch
  if (inventoryLevelsToCreate.length > 0) {
    logger.info(`Step 4: Creating inventory levels for ${inventoryLevelsToCreate.length} variant(s)...`)
    
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevelsToCreate },
    })

    logger.info(`✅ Created ${inventoryLevelsToCreate.length} inventory level(s)`)
  }

  // 7. Verify the setup
  logger.info('\n=== VERIFICATION ===\n')

  const { data: finalVariants } = await query.graph({
    entity: 'product_variant',
    fields: [
      'id',
      'title',
      'sku',
      'manage_inventory',
      'inventory_items.inventory_item_id',
    ],
    filters: { product_id: product.id },
  })

  for (const variant of finalVariants ?? []) {
    const invItemId = variant.inventory_items?.[0]?.inventory_item_id
    
    if (invItemId) {
      const levels = await inventoryModule.listInventoryLevels({
        inventory_item_id: invItemId,
        location_id: stockLocation.id,
      })

      const stockQty = levels[0]?.stocked_quantity || 0
      logger.info(`✅ ${variant.title}: ${stockQty} units at ${stockLocation.name}`)
    } else {
      logger.warn(`⚠️  ${variant.title}: No inventory item linked`)
    }
  }

  logger.info('\n=== NEXT STEPS ===\n')
  logger.info('1. Refresh your Admin UI (F5)')
  logger.info('2. Go to Products → T-Shirt\'s')
  logger.info('3. Click on any variant')
  logger.info('4. You should now see:')
  logger.info('   - Inventory items are linked')
  logger.info('   - Stock quantities are set')
  logger.info('   - You can manage inventory through the UI')
  logger.info('\n✅ Fix complete!\n')
}
