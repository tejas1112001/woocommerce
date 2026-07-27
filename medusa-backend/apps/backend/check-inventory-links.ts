import { Client } from 'pg';

async function checkInventoryLinks() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== CHECKING T-SHIRT INVENTORY SETUP ===\n');

    // Get product
    const product = await client.query(`
      SELECT id, title FROM product WHERE title = 'T-Shirt''s' AND deleted_at IS NULL
    `);

    if (product.rows.length === 0) {
      console.log('Product not found');
      return;
    }

    console.log(`Product: ${product.rows[0].title}`);
    console.log(`ID: ${product.rows[0].id}\n`);

    // Get all variants
    const variants = await client.query(`
      SELECT id, title, sku, manage_inventory
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
      ORDER BY variant_rank
    `, [product.rows[0].id]);

    console.log(`Found ${variants.rows.length} variants:\n`);

    for (const variant of variants.rows) {
      console.log(`📦 Variant: ${variant.title}`);
      console.log(`   ID: ${variant.id}`);
      console.log(`   SKU: ${variant.sku}`);
      console.log(`   Manage Inventory: ${variant.manage_inventory ? '✅ YES' : '❌ NO (THIS IS THE PROBLEM!)'}`);

      // Check for inventory item link
      const linkCheck = await client.query(`
        SELECT * FROM link_product_variant_inventory_item
        WHERE variant_id = $1
      `, [variant.id]);

      if (linkCheck.rows.length > 0) {
        console.log(`   Inventory Link: ✅ EXISTS`);
        const invItemId = linkCheck.rows[0].inventory_item_id;
        console.log(`   Inventory Item ID: ${invItemId}`);

        // Check inventory levels
        const levels = await client.query(`
          SELECT 
            il.id,
            il.location_id,
            sl.name as location_name,
            il.stocked_quantity,
            il.reserved_quantity
          FROM inventory_level il
          JOIN stock_location sl ON il.location_id = sl.id
          WHERE il.inventory_item_id = $1 AND il.deleted_at IS NULL
        `, [invItemId]);

        if (levels.rows.length > 0) {
          console.log(`   Stock Levels:`);
          levels.rows.forEach(level => {
            console.log(`      → ${level.location_name}: ${level.stocked_quantity} units (${level.reserved_quantity} reserved)`);
          });
        } else {
          console.log(`   Stock Levels: ⚠️  NO STOCK ASSIGNED`);
        }
      } else {
        console.log(`   Inventory Link: ❌ NOT LINKED`);
      }
      console.log('');
    }

    // Summary
    console.log('\n📋 DIAGNOSIS:');
    console.log('═══════════════════════════════════════\n');
    
    const needsFixing = variants.rows.filter(v => !v.manage_inventory);
    if (needsFixing.length > 0) {
      console.log(`❌ PROBLEM FOUND: ${needsFixing.length} variant(s) have manage_inventory = false`);
      console.log('\nThis prevents you from:');
      console.log('   - Adding inventory in the Admin UI');
      console.log('   - Seeing inventory management options');
      console.log('   - Managing stock levels\n');
      console.log('✅ SOLUTION:');
      console.log('   Option 1: In Admin UI when creating/editing variants,');
      console.log('            make sure "Manage Inventory" toggle is ON');
      console.log('');
      console.log('   Option 2: I can create a script to fix this automatically');
      console.log('');
    } else {
      console.log('✅ All variants have manage_inventory enabled');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkInventoryLinks();
