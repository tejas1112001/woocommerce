import { Client } from 'pg';

async function enableInventoryManagement() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== ENABLING INVENTORY MANAGEMENT FOR T-SHIRT VARIANTS ===\n');

    // Get product
    const product = await client.query(`
      SELECT id, title FROM product WHERE title = 'T-Shirt''s' AND deleted_at IS NULL
    `);

    if (product.rows.length === 0) {
      console.log('❌ Product "T-Shirt\'s" not found');
      return;
    }

    console.log(`✅ Found product: ${product.rows[0].title}\n`);

    // Get all variants
    const variants = await client.query(`
      SELECT id, title, sku, manage_inventory
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
      ORDER BY variant_rank
    `, [product.rows[0].id]);

    console.log(`Found ${variants.rows.length} variants\n`);

    // Update each variant
    let updated = 0;
    for (const variant of variants.rows) {
      if (!variant.manage_inventory) {
        console.log(`🔧 Enabling inventory management for: ${variant.title}`);
        
        await client.query(`
          UPDATE product_variant
          SET 
            manage_inventory = true,
            updated_at = NOW()
          WHERE id = $1
        `, [variant.id]);
        
        updated++;
        console.log(`   ✅ Updated`);
      } else {
        console.log(`✓ ${variant.title} - Already enabled`);
      }
    }

    console.log(`\n✅ Done! Updated ${updated} variant(s)\n`);

    // Verify the changes
    console.log('🔍 Verifying changes...\n');
    const verified = await client.query(`
      SELECT id, title, sku, manage_inventory
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
      ORDER BY variant_rank
    `, [product.rows[0].id]);

    console.log('Current status:');
    verified.rows.forEach(v => {
      console.log(`   ${v.manage_inventory ? '✅' : '❌'} ${v.title}`);
    });

    console.log('\n📋 NEXT STEPS:');
    console.log('═════════════════════════════════════════\n');
    console.log('1. Refresh your Admin UI page (F5)');
    console.log('2. Go to Products → T-Shirt\'s');
    console.log('3. Click on any variant');
    console.log('4. Scroll to "Inventory" or "Inventory items" section');
    console.log('5. You should now see options to:');
    console.log('   - Manage Inventory');
    console.log('   - Add to Location');
    console.log('   - Set stock quantities');
    console.log('');
    console.log('✅ The inventory management options will now be visible!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

enableInventoryManagement();
