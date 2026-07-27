import { Client } from 'pg';

async function checkSM01() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== CHECKING "sm-01" INVENTORY ITEM ===\n');

    // Check inventory_item table
    console.log('1️⃣ Looking in inventory_item table...\n');
    const invItems = await client.query(`
      SELECT id, sku, title, created_at
      FROM inventory_item
      WHERE sku ILIKE '%sm-01%' OR id ILIKE '%sm-01%' OR title ILIKE '%sm-01%'
      ORDER BY created_at DESC
    `);

    if (invItems.rows.length > 0) {
      console.log(`✅ Found ${invItems.rows.length} inventory item(s):\n`);
      invItems.rows.forEach(item => {
        console.log(`   📦 Title: ${item.title || 'No title'}`);
        console.log(`      ID: ${item.id}`);
        console.log(`      SKU: ${item.sku || 'No SKU'}`);
        console.log(`      Created: ${item.created_at}`);
        console.log('');
      });
    } else {
      console.log('   ❌ No inventory items found with "sm-01"\n');
    }

    // Check all inventory items
    console.log('2️⃣ All existing inventory items:\n');
    const allInvItems = await client.query(`
      SELECT id, sku, title
      FROM inventory_item
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT 20
    `);

    if (allInvItems.rows.length > 0) {
      console.log(`Found ${allInvItems.rows.length} inventory item(s):\n`);
      allInvItems.rows.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title || 'Untitled'}`);
        console.log(`      ID: ${item.id}`);
        console.log(`      SKU: ${item.sku || 'No SKU'}`);
        console.log('');
      });
    }

    // Check T-Shirt variants and their SKUs
    console.log('3️⃣ T-Shirt Variants and their SKUs:\n');
    const variants = await client.query(`
      SELECT pv.id, pv.title, pv.sku
      FROM product_variant pv
      JOIN product p ON pv.product_id = p.id
      WHERE p.title = 'T-Shirt''s' AND pv.deleted_at IS NULL
      ORDER BY pv.variant_rank
    `);

    if (variants.rows.length > 0) {
      console.log(`Found ${variants.rows.length} T-Shirt variant(s):\n`);
      variants.rows.forEach((v, index) => {
        console.log(`   ${index + 1}. ${v.title}`);
        console.log(`      Variant ID: ${v.id}`);
        console.log(`      SKU: ${v.sku || 'No SKU set'}`);
        
        // Check if this variant has a matching inventory item
        const matchingInv = allInvItems.rows.find(inv => inv.sku === v.sku);
        if (matchingInv) {
          console.log(`      ✅ Has matching inventory item: ${matchingInv.id}`);
        } else {
          console.log(`      ❌ No matching inventory item found`);
        }
        console.log('');
      });
    }

    console.log('\n📋 EXPLANATION:');
    console.log('═════════════════════════════════════════\n');
    console.log('"sm-01" is likely:');
    console.log('   - An inventory item ID (auto-generated)');
    console.log('   - OR a SKU from an old/test product');
    console.log('   - Shows as "null" because it has no title set\n');
    console.log('This happens when Medusa creates inventory items');
    console.log('automatically without proper SKU/title mapping.\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkSM01();
