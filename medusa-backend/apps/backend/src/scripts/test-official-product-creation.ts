/**
 * Test official Medusa product creation workflow
 * This tests if inventory items are created automatically when using official workflows
 * 
 * Run with: npx medusa exec src/scripts/test-official-product-creation.ts
 */
import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function testOfficialProductCreation({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const inventoryModule = container.resolve(Modules.INVENTORY)

  logger.info('\n=== TESTING OFFICIAL MEDUSA PRODUCT CREATION ===\n')

  // Get dependencies
  const { data: salesChannels } = await query.graph({
    entity: 'sales_channel',
    fields: ['id', 'name'],
  })
  const defaultChannel = salesChannels?.[0]
  if (!defaultChannel) {
    logger.error('No sales channel found')
    return
  }

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'type'],
  })
  const shippingProfile = shippingProfiles?.find((p) => p.type === 'default') ?? shippingProfiles?.[0]
  if (!shippingProfile) {
    logger.error('No shipping profile found')
    return
  }

  const testHandle = 'test-inventory-auto-' + Date.now()

  logger.info('Creating product with variants using createProductsWorkflow...\n')

  // TEST 1: Create product with manage_inventory=true (no inventory_items specified)
  logger.info('TEST 1: manage_inventory=true, NO inventory_items field\n')

  try {
    const { result: [product1] } = await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: 'Test Auto Inventory - No Field',
          handle: testHandle + '-no-field',
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            { title: 'Size', values: ['S', 'M'] }
          ],
          variants: [
            {
              title: 'Small',
              sku: 'TEST-AUTO-NO-FIELD-S',
              manage_inventory: true,
              // NOT specifying inventory_items
            },
            {
              title: 'Medium',
              sku: 'TEST-AUTO-NO-FIELD-M',
              manage_inventory: true,
              // NOT specifying inventory_items
            }
          ],
          sales_channels: [{ id: defaultChannel.id }]
        }]
      }
    })

    logger.info(`✅ Product created: ${product1.id}\n`)

    // Check variants
    const { data: variants1 } = await query.graph({
      entity: 'product_variant',
      fields: ['id', 'sku', 'manage_inventory', 'inventory_items.inventory_item_id'],
      filters: { product_id: product1.id }
    })

    logger.info('Checking variants:')
    for (const v of variants1 ?? []) {
      logger.info(`  ${v.sku}:`)
      logger.info(`    manage_inventory: ${v.manage_inventory}`)
      logger.info(`    inventory_items: ${v.inventory_items?.length || 0}`)
      
      if (v.inventory_items?.length > 0) {
        const invItemId = v.inventory_items[0].inventory_item_id
        logger.info(`    ✅ Inventory item auto-created: ${invItemId}`)
        
        // Check if it's a valid inventory item
        const invItems = await inventoryModule.listInventoryItems({ id: invItemId })
        if (invItems.length > 0) {
          logger.info(`    ✅ Inventory item exists in module: ${invItems[0].sku}`)
        }
      } else {
        logger.warn(`    ❌ NO inventory item created!`)
      }
    }

  } catch (error: any) {
    logger.error('Test 1 failed:', error.message)
  }

  // TEST 2: Create product with manage_inventory=true and empty inventory_items array
  logger.info('\n\nTEST 2: manage_inventory=true, EMPTY inventory_items array\n')

  try {
    const { result: [product2] } = await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: 'Test Auto Inventory - Empty Array',
          handle: testHandle + '-empty-array',
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            { title: 'Size', values: ['S', 'M'] }
          ],
          variants: [
            {
              title: 'Small',
              sku: 'TEST-AUTO-EMPTY-S',
              manage_inventory: true,
              inventory_items: [], // Empty array
            },
            {
              title: 'Medium',
              sku: 'TEST-AUTO-EMPTY-M',
              manage_inventory: true,
              inventory_items: [], // Empty array
            }
          ],
          sales_channels: [{ id: defaultChannel.id }]
        }]
      }
    })

    logger.info(`✅ Product created: ${product2.id}\n`)

    const { data: variants2 } = await query.graph({
      entity: 'product_variant',
      fields: ['id', 'sku', 'manage_inventory', 'inventory_items.inventory_item_id'],
      filters: { product_id: product2.id }
    })

    logger.info('Checking variants:')
    for (const v of variants2 ?? []) {
      logger.info(`  ${v.sku}:`)
      logger.info(`    manage_inventory: ${v.manage_inventory}`)
      logger.info(`    inventory_items: ${v.inventory_items?.length || 0}`)
      
      if (v.inventory_items?.length > 0) {
        logger.info(`    ✅ Inventory item auto-created`)
      } else {
        logger.warn(`    ❌ NO inventory item created!`)
      }
    }

  } catch (error: any) {
    logger.error('Test 2 failed:', error.message)
  }

  // TEST 3: Create product with manage_inventory=false
  logger.info('\n\nTEST 3: manage_inventory=false (control test)\n')

  try {
    const { result: [product3] } = await createProductsWorkflow(container).run({
      input: {
        products: [{
          title: 'Test Auto Inventory - False',
          handle: testHandle + '-false',
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            { title: 'Size', values: ['S'] }
          ],
          variants: [
            {
              title: 'Small',
              sku: 'TEST-AUTO-FALSE-S',
              manage_inventory: false,
            }
          ],
          sales_channels: [{ id: defaultChannel.id }]
        }]
      }
    })

    logger.info(`✅ Product created: ${product3.id}\n`)

    const { data: variants3 } = await query.graph({
      entity: 'product_variant',
      fields: ['id', 'sku', 'manage_inventory', 'inventory_items.inventory_item_id'],
      filters: { product_id: product3.id }
    })

    logger.info('Checking variants:')
    for (const v of variants3 ?? []) {
      logger.info(`  ${v.sku}:`)
      logger.info(`    manage_inventory: ${v.manage_inventory}`)
      logger.info(`    inventory_items: ${v.inventory_items?.length || 0}`)
      
      if (v.inventory_items?.length === 0) {
        logger.info(`    ✅ Correctly NO inventory item (expected behavior)`)
      } else {
        logger.warn(`    ⚠️  Unexpected: inventory item was created`)
      }
    }

  } catch (error: any) {
    logger.error('Test 3 failed:', error.message)
  }

  // SUMMARY
  logger.info('\n\n═══════════════════════════════════════')
  logger.info('SUMMARY - OFFICIAL WORKFLOW BEHAVIOR')
  logger.info('═══════════════════════════════════════\n')

  logger.info('This test uses the OFFICIAL createProductsWorkflow')
  logger.info('exactly as documented by Medusa.\n')

  logger.info('Expected behavior according to Medusa docs:')
  logger.info('  - manage_inventory=true + inventory_items set → Create inventory')
  logger.info('  - manage_inventory=true + inventory_items NOT set → ???')
  logger.info('  - manage_inventory=false → NO inventory\n')

  logger.info('Check the results above to see what actually happens.')
  logger.info('If Test 1 creates inventory items automatically, then Admin UI has a bug.')
  logger.info('If Test 1 does NOT create inventory items, then this is expected behavior.\n')

  logger.info('✅ Test complete!\n')
}
