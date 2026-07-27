/**
 * Test if Medusa's product creation workflow automatically creates inventory items
 */
import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow } from '@medusajs/medusa/core-flows'

export default async function testProductCreation({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const testHandle = 'test-inventory-creation-' + Date.now()

  console.log('\n=== TESTING AUTOMATIC INVENTORY CREATION ===\n')

  // Get required dependencies
  const { data: salesChannels } = await query.graph({
    entity: 'sales_channel',
    fields: ['id', 'name'],
  })
  const defaultChannel = salesChannels?.[0]
  if (!defaultChannel) throw new Error('No sales channel found')

  const { data: shippingProfiles } = await query.graph({
    entity: 'shipping_profile',
    fields: ['id', 'type'],
  })
  const shippingProfile = shippingProfiles?.find((p) => p.type === 'default') ?? shippingProfiles?.[0]
  if (!shippingProfile) throw new Error('No shipping profile found')

  console.log('✅ Dependencies resolved:')
  console.log(`   Sales Channel: ${defaultChannel.name}`)
  console.log(`   Shipping Profile: ${shippingProfile.id}\n`)

  // Test 1: Create product with manage_inventory = true (explicit)
  console.log('TEST 1: Creating product with manage_inventory = TRUE\n')
  
  const { result: [product1] } = await createProductsWorkflow(container).run({
    input: {
      products: [{
        title: 'Test Product - Managed Inventory',
        handle: testHandle + '-managed',
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        options: [
          { title: 'Size', values: ['S', 'M'] }
        ],
        variants: [
          {
            title: 'Small',
            sku: 'TEST-MANAGED-S',
            manage_inventory: true,
            options: { Size: 'S' },
          },
          {
            title: 'Medium', 
            sku: 'TEST-MANAGED-M',
            manage_inventory: true,
            options: { Size: 'M' },
          }
        ],
        sales_channels: [{ id: defaultChannel.id }]
      }]
    }
  })

  console.log(`✅ Product created: ${product1.id}`)

  // Check if inventory items were created
  const { data: variants1 } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'manage_inventory', 'inventory_items.inventory_item_id', 'inventory_items.inventory.sku'],
    filters: { product_id: product1.id }
  })

  console.log('\nVariants created:')
  for (const v of variants1 ?? []) {
    console.log(`   ${v.sku}:`)
    console.log(`      manage_inventory: ${v.manage_inventory}`)
    console.log(`      inventory_items: ${v.inventory_items?.length || 0}`)
    if (v.inventory_items?.[0]) {
      console.log(`      inventory_item_id: ${v.inventory_items[0].inventory_item_id}`)
      console.log(`      inventory SKU: ${v.inventory_items[0].inventory?.sku}`)
    } else {
      console.log(`      ❌ NO INVENTORY ITEM CREATED!`)
    }
  }

  // Test 2: Create product without explicit manage_inventory (default behavior)
  console.log('\n\nTEST 2: Creating product WITHOUT explicit manage_inventory (default)\n')

  const { result: [product2] } = await createProductsWorkflow(container).run({
    input: {
      products: [{
        title: 'Test Product - Default Inventory',
        handle: testHandle + '-default',
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        options: [
          { title: 'Size', values: ['S', 'M'] }
        ],
        variants: [
          {
            title: 'Small',
            sku: 'TEST-DEFAULT-S',
            options: { Size: 'S' },
          },
          {
            title: 'Medium',
            sku: 'TEST-DEFAULT-M',
            options: { Size: 'M' },
          }
        ],
        sales_channels: [{ id: defaultChannel.id }]
      }]
    }
  })

  console.log(`✅ Product created: ${product2.id}`)

  const { data: variants2 } = await query.graph({
    entity: 'product_variant',
    fields: ['id', 'sku', 'manage_inventory', 'inventory_items.inventory_item_id', 'inventory_items.inventory.sku'],
    filters: { product_id: product2.id }
  })

  console.log('\nVariants created:')
  for (const v of variants2 ?? []) {
    console.log(`   ${v.sku}:`)
    console.log(`      manage_inventory: ${v.manage_inventory}`)
    console.log(`      inventory_items: ${v.inventory_items?.length || 0}`)
    if (v.inventory_items?.[0]) {
      console.log(`      inventory_item_id: ${v.inventory_items[0].inventory_item_id}`)
      console.log(`      inventory SKU: ${v.inventory_items[0].inventory?.sku}`)
    } else {
      console.log(`      ❌ NO INVENTORY ITEM CREATED!`)
    }
  }

  // Summary
  console.log('\n\n📋 DIAGNOSIS SUMMARY:')
  console.log('═════════════════════════════════════════\n')

  const hasInventoryTest1 = variants1?.every(v => v.inventory_items?.length > 0)
  const hasInventoryTest2 = variants2?.every(v => v.inventory_items?.length > 0)

  console.log(`Test 1 (manage_inventory=true):  ${hasInventoryTest1 ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Test 2 (default behavior):       ${hasInventoryTest2 ? '✅ PASS' : '❌ FAIL'}`)

  if (!hasInventoryTest1 && !hasInventoryTest2) {
    console.log('\n❌ CRITICAL ISSUE:')
    console.log('   Medusa is NOT automatically creating inventory items!')
    console.log('\n   Possible causes:')
    console.log('   1. Inventory module is not properly initialized')
    console.log('   2. Product-variant-inventory linking is broken')
    console.log('   3. Database migration issue')
    console.log('   4. Medusa core workflow bug')
  } else if (!hasInventoryTest2) {
    console.log('\n⚠️  ISSUE IDENTIFIED:')
    console.log('   Inventory items are only created when manage_inventory=true')
    console.log('   This means the Admin UI must have this toggle ON')
  } else {
    console.log('\n✅ Medusa is working correctly!')
    console.log('   Inventory items are automatically created')
  }

  console.log('\n\nCleaning up test products...')
  
  // Note: In production you'd delete these, but for diagnosis let's keep them
  console.log(`Test products created:`)
  console.log(`   - ${product1.handle}`)
  console.log(`   - ${product2.handle}`)
  console.log('\n✅ Test complete!\n')
}
