import { Client } from 'pg'

async function checkInventoryDetailed() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // Check the complete inventory chain for test-product
    console.log('=== COMPLETE INVENTORY CHAIN ===\n')

    // 1. Product
    const product = await client.query(`
      SELECT id, title, handle, status
      FROM product
      WHERE handle = 'test-product' AND deleted_at IS NULL
    `)
    console.log('1. Product:')
    console.log(product.rows[0])
    const productId = product.rows[0].id

    // 2. Variants
    const variants = await client.query(`
      SELECT id, title, sku, product_id, manage_inventory
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
    `, [productId])
    console.log('\n2. Variants:')
    console.log(variants.rows)

    for (const variant of variants.rows) {
      console.log(`\n3. Checking inventory for variant: ${variant.title}`)
      console.log('   Variant ID:', variant.id)

      // 3. Inventory item link
      const invItemLink = await client.query(`
        SELECT variant_id, inventory_item_id, required_quantity
        FROM product_variant_inventory_item
        WHERE variant_id = $1 AND deleted_at IS NULL
      `, [variant.id])
      
      if (invItemLink.rows.length === 0) {
        console.log('   ❌ NO inventory item link found!')
        continue
      }
      
      console.log('   ✅ Inventory item link:')
      console.log('      ', invItemLink.rows[0])
      
      const inventoryItemId = invItemLink.rows[0].inventory_item_id

      // 4. Inventory item
      const invItem = await client.query(`
        SELECT id, sku, requires_shipping
        FROM inventory_item
        WHERE id = $1 AND deleted_at IS NULL
      `, [inventoryItemId])
      
      if (invItem.rows.length === 0) {
        console.log('   ❌ Inventory item not found!')
        continue
      }
      
      console.log('   ✅ Inventory item:')
      console.log('      ', invItem.rows[0])

      // 5. Inventory levels
      const invLevels = await client.query(`
        SELECT 
          il.id,
          il.inventory_item_id,
          il.location_id,
          il.stocked_quantity,
          il.reserved_quantity,
          il.incoming_quantity,
          il.deleted_at,
          sl.name as location_name
        FROM inventory_level il
        JOIN stock_location sl ON il.location_id = sl.id
        WHERE il.inventory_item_id = $1
      `, [inventoryItemId])
      
      console.log('   📊 Inventory levels:')
      if (invLevels.rows.length === 0) {
        console.log('      ❌ NO inventory levels found!')
      } else {
        invLevels.rows.forEach(level => {
          const status = level.deleted_at ? '❌ DELETED' : '✅ ACTIVE'
          const available = parseInt(level.stocked_quantity) - parseInt(level.reserved_quantity)
          console.log(`      ${status}`)
          console.log('         Location:', level.location_name)
          console.log('         Stocked:', level.stocked_quantity)
          console.log('         Reserved:', level.reserved_quantity)
          console.log('         Available:', available)
          console.log('         Deleted at:', level.deleted_at || 'null')
        })
      }
    }

    // Check stock locations
    console.log('\n\n=== STOCK LOCATIONS ===')
    const locations = await client.query(`
      SELECT id, name, address_id, deleted_at
      FROM stock_location
    `)
    locations.rows.forEach(loc => {
      const status = loc.deleted_at ? '❌ DELETED' : '✅ ACTIVE'
      console.log(`${status} ${loc.name} (${loc.id})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

checkInventoryDetailed()
