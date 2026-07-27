import { Client } from 'pg';

async function diagnoseInventoryUI() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    console.log('\n=== DIAGNOSING INVENTORY UI ISSUE ===\n');

    // 1. Check Stock Locations
    console.log('1️⃣ STOCK LOCATIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const locations = await client.query(`
      SELECT id, name, created_at, deleted_at
      FROM stock_location
      WHERE deleted_at IS NULL
    `);
    
    if (locations.rows.length === 0) {
      console.log('❌ NO STOCK LOCATIONS FOUND!');
      console.log('\n⚠️  THIS IS THE PROBLEM!');
      console.log('\nWITHOUT A STOCK LOCATION, YOU CANNOT:');
      console.log('   - Add inventory to variants');
      console.log('   - See inventory management options in Admin UI');
      console.log('   - Manage stock levels');
      console.log('\n✅ SOLUTION:');
      console.log('   1. Go to Medusa Admin: http://localhost:9000/app');
      console.log('   2. Click "Settings" in the left sidebar');
      console.log('   3. Click "Locations"');
      console.log('   4. Click "+ Create Location" button');
      console.log('   5. Fill in:');
      console.log('      - Name: Main Warehouse');
      console.log('      - Address: Your address');
      console.log('   6. Click "Save"');
      console.log('\n   After creating location, inventory options will appear!\n');
    } else {
      console.log(`✅ Found ${locations.rows.length} location(s):\n`);
      locations.rows.forEach(loc => {
        console.log(`   📍 ${loc.name}`);
        console.log(`      ID: ${loc.id}`);
        console.log(`      Created: ${loc.created_at}`);
        console.log('');
      });
    }

    // 2. Check T-Shirt Product
    console.log('\n2️⃣ T-SHIRT PRODUCT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const products = await client.query(`
      SELECT id, title, handle, status
      FROM product
      WHERE title = 'T-Shirt''s' AND deleted_at IS NULL
    `);

    if (products.rows.length === 0) {
      console.log('❌ Product "T-Shirt\'s" not found');
    } else {
      const product = products.rows[0];
      console.log(`✅ Product Found: ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Status: ${product.status}`);

      // Check variants
      console.log('\n3️⃣ VARIANTS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const variants = await client.query(`
        SELECT 
          pv.id,
          pv.title,
          pv.sku,
          pv.manage_inventory,
          pv.allow_backorder,
          pv.inventory_item_id
        FROM product_variant pv
        WHERE pv.product_id = $1 AND pv.deleted_at IS NULL
        ORDER BY pv.created_at
      `, [product.id]);

      console.log(`Found ${variants.rows.length} variant(s):\n`);

      for (const variant of variants.rows) {
        console.log(`   📦 ${variant.title || 'Untitled Variant'}`);
        console.log(`      ID: ${variant.id}`);
        console.log(`      SKU: ${variant.sku || 'No SKU'}`);
        console.log(`      Manage Inventory: ${variant.manage_inventory}`);
        console.log(`      Inventory Item ID: ${variant.inventory_item_id || '❌ NOT LINKED'}`);

        // Check if inventory item exists
        if (variant.inventory_item_id) {
          const invItem = await client.query(`
            SELECT id, sku, title
            FROM inventory_item
            WHERE id = $1 AND deleted_at IS NULL
          `, [variant.inventory_item_id]);

          if (invItem.rows.length > 0) {
            console.log(`      Inventory Item: ✅ EXISTS`);

            // Check inventory levels
            const levels = await client.query(`
              SELECT 
                il.location_id,
                sl.name as location_name,
                ili.stocked_quantity,
                ili.reserved_quantity,
                ili.incoming_quantity
              FROM inventory_level il
              JOIN inventory_level_inventory ili ON il.id = ili.id
              JOIN stock_location sl ON il.location_id = sl.id
              WHERE il.inventory_item_id = $1 AND il.deleted_at IS NULL
            `, [variant.inventory_item_id]);

            if (levels.rows.length > 0) {
              console.log(`      Stock Levels: ✅ CONFIGURED`);
              levels.rows.forEach(level => {
                console.log(`         → ${level.location_name}: ${level.stocked_quantity} units`);
              });
            } else {
              console.log(`      Stock Levels: ⚠️  NO STOCK ADDED YET`);
              if (locations.rows.length > 0) {
                console.log(`         (You can add stock in Admin UI)`);
              }
            }
          } else {
            console.log(`      Inventory Item: ❌ INVALID REFERENCE`);
          }
        } else {
          console.log(`      ⚠️  NO INVENTORY ITEM LINKED!`);
        }
        console.log('');
      }
    }

    // 4. Check Sales Channels
    console.log('\n4️⃣ SALES CHANNELS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const channels = await client.query(`
      SELECT id, name, is_disabled
      FROM sales_channel
      WHERE deleted_at IS NULL
    `);

    if (channels.rows.length > 0) {
      console.log(`✅ Found ${channels.rows.length} channel(s):\n`);
      channels.rows.forEach(ch => {
        console.log(`   📺 ${ch.name} ${ch.is_disabled ? '[DISABLED]' : '[ACTIVE]'}`);
      });
    }

    // 5. Summary and Next Steps
    console.log('\n\n📋 SUMMARY & NEXT STEPS:');
    console.log('═════════════════════════════════════════\n');

    if (locations.rows.length === 0) {
      console.log('🔴 CRITICAL: No stock locations found');
      console.log('\n   This is why you cannot add inventory!');
      console.log('\n   IMMEDIATE ACTION REQUIRED:');
      console.log('   → Create a stock location in Admin → Settings → Locations');
      console.log('');
    } else {
      console.log('✅ Stock locations exist');
      
      if (products.rows.length > 0) {
        const variants = await client.query(`
          SELECT COUNT(*) as count
          FROM product_variant
          WHERE product_id = $1 AND deleted_at IS NULL AND inventory_item_id IS NULL
        `, [products.rows[0].id]);

        if (parseInt(variants.rows[0].count) > 0) {
          console.log('⚠️  Some variants are missing inventory items');
          console.log('');
        } else {
          console.log('✅ All variants have inventory items');
          console.log('\n   You should now be able to:');
          console.log('   1. Go to Products → T-Shirt\'s');
          console.log('   2. Click on any variant');
          console.log('   3. Find "Inventory items" section');
          console.log('   4. Click three dots (...) → Manage Inventory');
          console.log('   5. Select location and add stock quantity');
          console.log('');
        }
      }
    }

    console.log('\n═════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

diagnoseInventoryUI();
