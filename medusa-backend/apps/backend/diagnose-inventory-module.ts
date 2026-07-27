import { Client } from 'pg';

async function diagnoseInventoryModule() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== DEEP DIAGNOSIS: INVENTORY MODULE ===\n');

    // 1. Check if inventory module tables exist
    console.log('1️⃣ Checking Inventory Module Tables:\n');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%inventory%'
      ORDER BY table_name
    `);

    console.log('Inventory-related tables:');
    tables.rows.forEach(t => console.log(`   ✅ ${t.table_name}`));

    // 2. Check link tables for product-variant-inventory
    console.log('\n\n2️⃣ Checking Link Tables:\n');
    
    const linkTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'link%'
      ORDER BY table_name
    `);

    console.log('Link tables:');
    linkTables.rows.forEach(t => console.log(`   ✅ ${t.table_name}`));

    // 3. Check if ANY products have inventory items linked
    console.log('\n\n3️⃣ Checking Product-Inventory Links:\n');

    // First, find the correct link table
    const linkTableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (
        table_name LIKE '%variant%inventory%' OR
        table_name LIKE '%product%inventory%'
      )
    `);

    if (linkTableCheck.rows.length > 0) {
      console.log('Found link table(s):');
      linkTableCheck.rows.forEach(t => console.log(`   - ${t.table_name}`));

      // Try to query the link table
      for (const row of linkTableCheck.rows) {
        console.log(`\nChecking ${row.table_name}:`);
        try {
          const linkData = await client.query(`
            SELECT * FROM ${row.table_name} LIMIT 5
          `);
          console.log(`   Found ${linkData.rowCount} link(s)`);
          if (linkData.rows.length > 0) {
            console.log('   Sample data:');
            console.log(JSON.stringify(linkData.rows[0], null, 2));
          }
        } catch (e: any) {
          console.log(`   Error: ${e.message}`);
        }
      }
    } else {
      console.log('❌ No variant-inventory link table found!');
      console.log('   This could be the root cause.');
    }

    // 4. Check existing products that DO have inventory (like Swami)
    console.log('\n\n4️⃣ Checking Products with Inventory:\n');

    const productsWithInventory = await client.query(`
      SELECT DISTINCT p.id, p.title, p.created_at
      FROM product p
      JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.deleted_at IS NULL 
      AND pv.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT 10
    `);

    console.log(`Found ${productsWithInventory.rows.length} products:\n`);
    
    for (const prod of productsWithInventory.rows) {
      console.log(`📦 ${prod.title} (${prod.id})`);
      console.log(`   Created: ${prod.created_at}`);

      // Check variants
      const variants = await client.query(`
        SELECT id, title, sku, manage_inventory
        FROM product_variant
        WHERE product_id = $1 AND deleted_at IS NULL
        LIMIT 3
      `, [prod.id]);

      console.log(`   Variants (${variants.rowCount}):`);
      for (const v of variants.rows) {
        console.log(`      - ${v.title || v.sku}`);
        console.log(`        manage_inventory: ${v.manage_inventory}`);

        // Try to find inventory items by SKU
        const invItem = await client.query(`
          SELECT id, sku, title
          FROM inventory_item
          WHERE sku = $1 AND deleted_at IS NULL
        `, [v.sku]);

        if (invItem.rows.length > 0) {
          console.log(`        ✅ Inventory item exists: ${invItem.rows[0].id}`);
        } else {
          console.log(`        ❌ No inventory item found`);
        }
      }
      console.log('');
    }

    // 5. Check Medusa version and configuration
    console.log('\n5️⃣ Checking System Configuration:\n');

    // Check for migrations table
    const migrations = await client.query(`
      SELECT name, execution_time
      FROM mikro_orm_migrations
      ORDER BY execution_time DESC
      LIMIT 5
    `);

    console.log('Recent migrations:');
    migrations.rows.forEach(m => {
      console.log(`   - ${m.name} (${m.execution_time})`);
    });

    // 6. Test creating inventory item manually
    console.log('\n\n6️⃣ Testing Manual Inventory Creation:\n');

    const testSku = 'TEST-INVENTORY-' + Date.now();
    console.log(`Creating test inventory item with SKU: ${testSku}`);

    try {
      const newInvItem = await client.query(`
        INSERT INTO inventory_item (id, sku, title, created_at, updated_at)
        VALUES (
          gen_random_uuid()::text,
          $1,
          'Test Inventory Item',
          NOW(),
          NOW()
        )
        RETURNING id, sku
      `, [testSku]);

      console.log(`   ✅ Successfully created: ${newInvItem.rows[0].id}`);
      
      // Clean up
      await client.query(`DELETE FROM inventory_item WHERE sku = $1`, [testSku]);
      console.log(`   ✅ Cleaned up test item`);

    } catch (e: any) {
      console.log(`   ❌ Failed: ${e.message}`);
    }

    // 7. Summary
    console.log('\n\n📋 ROOT CAUSE ANALYSIS:');
    console.log('═════════════════════════════════════════\n');

    const tshirtCheck = productsWithInventory.rows.find(p => p.title === "T-Shirt's");
    if (tshirtCheck) {
      const tshirtVariants = await client.query(`
        SELECT manage_inventory, COUNT(*) as count
        FROM product_variant
        WHERE product_id = $1 AND deleted_at IS NULL
        GROUP BY manage_inventory
      `, [tshirtCheck.id]);

      console.log('T-Shirt\'s Product Analysis:');
      tshirtVariants.rows.forEach(row => {
        console.log(`   manage_inventory=${row.manage_inventory}: ${row.count} variants`);
      });

      const hasManaged = tshirtVariants.rows.some(r => r.manage_inventory === true);
      const hasUnmanaged = tshirtVariants.rows.some(r => r.manage_inventory === false);

      console.log('\n🔍 ROOT CAUSE:');
      if (hasUnmanaged && !hasManaged) {
        console.log('   ❌ ALL variants have manage_inventory = FALSE');
        console.log('\n   When manage_inventory is FALSE:');
        console.log('   - Medusa does NOT create inventory items');
        console.log('   - Admin UI hides inventory management options');
        console.log('   - No stock can be assigned');
        console.log('\n   This is BY DESIGN in Medusa.');
        console.log('   Some products (digital goods, services) don\'t need inventory.');
        console.log('\n   HOW IT HAPPENED:');
        console.log('   - The Admin UI has a "Manage Inventory" toggle when creating variants');
        console.log('   - This toggle was OFF (or not visible) when creating T-Shirt');
        console.log('   - Without this toggle ON, no inventory workflow runs');
        console.log('\n   ✅ SOLUTION:');
        console.log('   - This is NOT a bug in Medusa');
        console.log('   - The toggle must be ON when creating products');
        console.log('   - For existing products: Update manage_inventory to true');
        console.log('   - Then manually create/link inventory items');
      } else {
        console.log('   manage_inventory is mixed or all true - different issue');
      }
    }

    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

diagnoseInventoryModule();
