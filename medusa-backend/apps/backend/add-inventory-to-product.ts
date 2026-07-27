import { Client } from 'pg'

async function addInventoryToProduct() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // CONFIGURATION - CHANGE THESE VALUES
    const PRODUCT_HANDLE = 'test-product'  // Your product handle
    const QUANTITY_TO_ADD = 100            // How many units to add
    const LOCATION_NAME = 'Main Warehouse' // Stock location name

    // 1. Get the product
    const product = await client.query(`
      SELECT id, title, handle
      FROM product
      WHERE handle = $1 AND deleted_at IS NULL
    `, [PRODUCT_HANDLE])

    if (product.rows.length === 0) {
      console.log(`❌ Product "${PRODUCT_HANDLE}" not found!`)
      return
    }

    console.log('✅ Found product:', product.rows[0].title)
    const productId = product.rows[0].id

    // 2. Get product variants
    const variants = await client.query(`
      SELECT id, title, sku
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
    `, [productId])

    if (variants.rows.length === 0) {
      console.log('❌ No variants found for this product!')
      return
    }

    console.log(`\n📋 Found ${variants.rows.length} variant(s):`)
    variants.rows.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.title || 'Default'} (SKU: ${v.sku || 'N/A'})`)
    })

    // For this example, we'll add inventory to the first variant
    // In production, you might want to loop through all variants
    const variantId = variants.rows[0].id
    console.log(`\n➡️  Adding inventory to: ${variants.rows[0].title || 'Default'}`)

    // 3. Get or create inventory item for this variant
    let inventoryItem = await client.query(`
      SELECT ii.id, ii.sku
      FROM inventory_item ii
      JOIN product_variant_inventory_item pvii ON ii.id = pvii.inventory_item_id
      WHERE pvii.variant_id = $1 AND ii.deleted_at IS NULL
    `, [variantId])

    let inventoryItemId

    if (inventoryItem.rows.length === 0) {
      console.log('⚠️  No inventory item found. Creating one...')
      
      // Create inventory item
      const newItem = await client.query(`
        INSERT INTO inventory_item (id, sku, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, NOW(), NOW())
        RETURNING id
      `, [variants.rows[0].sku || `INV-${variantId.slice(0, 8)}`])
      
      inventoryItemId = newItem.rows[0].id
      
      // Link it to the variant
      await client.query(`
        INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, 1, NOW(), NOW())
      `, [variantId, inventoryItemId])
      
      console.log('✅ Created inventory item:', inventoryItemId)
    } else {
      inventoryItemId = inventoryItem.rows[0].id
      console.log('✅ Using existing inventory item:', inventoryItemId)
    }

    // 4. Get stock location
    const location = await client.query(`
      SELECT id, name
      FROM stock_location
      WHERE name = $1 AND deleted_at IS NULL
    `, [LOCATION_NAME])

    if (location.rows.length === 0) {
      console.log(`\n❌ Stock location "${LOCATION_NAME}" not found!`)
      console.log('\nAvailable locations:')
      const allLocations = await client.query(`
        SELECT name FROM stock_location WHERE deleted_at IS NULL
      `)
      allLocations.rows.forEach(loc => console.log(`  - ${loc.name}`))
      return
    }

    const locationId = location.rows[0].id
    console.log(`✅ Using stock location: ${LOCATION_NAME}`)

    // 5. Get or create inventory level
    const existingLevel = await client.query(`
      SELECT id, stocked_quantity, reserved_quantity
      FROM inventory_level
      WHERE inventory_item_id = $1 AND location_id = $2 AND deleted_at IS NULL
    `, [inventoryItemId, locationId])

    if (existingLevel.rows.length === 0) {
      // Create new inventory level
      await client.query(`
        INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, 0, NOW(), NOW())
      `, [inventoryItemId, locationId, QUANTITY_TO_ADD])
      
      console.log(`\n✅ Added ${QUANTITY_TO_ADD} units to inventory`)
    } else {
      // Update existing inventory level
      const currentStock = parseInt(existingLevel.rows[0].stocked_quantity)
      const newStock = currentStock + QUANTITY_TO_ADD
      
      await client.query(`
        UPDATE inventory_level
        SET stocked_quantity = $1, updated_at = NOW()
        WHERE id = $2
      `, [newStock, existingLevel.rows[0].id])
      
      console.log(`\n✅ Updated inventory: ${currentStock} → ${newStock} units`)
    }

    // 6. Verify the inventory
    const verification = await client.query(`
      SELECT 
        p.title as product_title,
        pv.title as variant_title,
        pv.sku,
        sl.name as location_name,
        il.stocked_quantity,
        il.reserved_quantity,
        (il.stocked_quantity - il.reserved_quantity) as available_quantity
      FROM inventory_level il
      JOIN inventory_item ii ON il.inventory_item_id = ii.id
      JOIN product_variant_inventory_item pvii ON ii.id = pvii.inventory_item_id
      JOIN product_variant pv ON pvii.variant_id = pv.id
      JOIN product p ON pv.product_id = p.id
      JOIN stock_location sl ON il.location_id = sl.id
      WHERE p.handle = $1 AND il.deleted_at IS NULL
    `, [PRODUCT_HANDLE])

    console.log('\n📊 CURRENT INVENTORY SUMMARY:')
    console.log('─'.repeat(80))
    verification.rows.forEach(row => {
      console.log(`Product: ${row.product_title}`)
      console.log(`Variant: ${row.variant_title || 'Default'}`)
      console.log(`SKU: ${row.sku || 'N/A'}`)
      console.log(`Location: ${row.location_name}`)
      console.log(`Stocked: ${row.stocked_quantity}`)
      console.log(`Reserved: ${row.reserved_quantity}`)
      console.log(`Available: ${row.available_quantity}`)
      console.log('─'.repeat(80))
    })

    console.log('\n🎉 Inventory update complete!')
    console.log('\n💡 The product should now be purchasable on the storefront.')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

addInventoryToProduct()
