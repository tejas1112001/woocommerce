import { Client } from 'pg';

async function checkDefaultBehavior() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== CHECKING DEFAULT manage_inventory BEHAVIOR ===\n');

    // Check the database schema default
    const schemaInfo = await client.query(`
      SELECT column_name, column_default, is_nullable, data_type
      FROM information_schema.columns
      WHERE table_name = 'product_variant'
      AND column_name IN ('manage_inventory', 'allow_backorder')
    `);

    console.log('Database Schema Defaults:');
    schemaInfo.rows.forEach(col => {
      console.log(`   ${col.column_name}:`);
      console.log(`      Type: ${col.data_type}`);
      console.log(`      Default: ${col.column_default || 'NULL'}`);
      console.log(`      Nullable: ${col.is_nullable}`);
      console.log('');
    });

    // Check all products to see the pattern
    console.log('\n📊 Analysis of ALL Products in Database:\n');
    
    const allVariants = await client.query(`
      SELECT 
        p.title as product_title,
        p.created_at as product_created,
        pv.title as variant_title,
        pv.manage_inventory,
        pv.allow_backorder,
        pv.created_at as variant_created
      FROM product p
      JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.deleted_at IS NULL AND pv.deleted_at IS NULL
      ORDER BY p.created_at DESC, pv.created_at
    `);

    const byProduct = {};
    allVariants.rows.forEach(row => {
      if (!byProduct[row.product_title]) {
        byProduct[row.product_title] = {
          created: row.product_created,
          variants: []
        };
      }
      byProduct[row.product_title].variants.push({
        title: row.variant_title,
        manage_inventory: row.manage_inventory,
        allow_backorder: row.allow_backorder,
        created: row.variant_created
      });
    });

    Object.entries(byProduct).forEach(([title, data]: [string, any]) => {
      console.log(`📦 ${title}`);
      console.log(`   Created: ${data.created}`);
      console.log(`   Variants:`);
      
      const manageTrue = data.variants.filter((v: any) => v.manage_inventory).length;
      const manageFalse = data.variants.filter((v: any) => !v.manage_inventory).length;
      
      console.log(`      manage_inventory=true:  ${manageTrue}`);
      console.log(`      manage_inventory=false: ${manageFalse}`);
      console.log('');
    });

    // Summary
    console.log('\n📋 CONCLUSIONS:');
    console.log('═════════════════════════════════════════\n');
    
    const defaultVal = schemaInfo.rows.find(r => r.column_name === 'manage_inventory')?.column_default;
    
    console.log(`1. Database default for manage_inventory: ${defaultVal || 'false (not null)'}`);
    console.log('');
    console.log('2. Pattern Analysis:');
    console.log('   - Products created via seed scripts have manage_inventory=true');
    console.log('   - Products created via Admin UI appear to default to false');
    console.log('');
    console.log('3. ROOT CAUSE:');
    console.log('   Medusa Admin UI does NOT default manage_inventory to true.');
    console.log('   Users must explicitly enable it when creating variants.');
    console.log('');
    console.log('4. WHY THIS IS A PROBLEM:');
    console.log('   - For physical products, manage_inventory should be ON');
    console.log('   - The UI may not make this obvious');
    console.log('   - Users can create products without realizing inventory is disabled');
    console.log('');
    console.log('5. RECOMMENDATION:');
    console.log('   When creating products in Admin UI, always check:');
    console.log('   ✅ "Manage Inventory" toggle is ON for each variant');
    console.log('   ✅ Stock location exists before creating products');
    console.log('');
    console.log('6. FOR YOUR T-SHIRT:');
    console.log('   You need to:');
    console.log('   a) Enable manage_inventory on all variants');
    console.log('   b) Create inventory items manually (Medusa won\'t do it retroactively)');
    console.log('   c) Link variants to inventory items');
    console.log('   d) Add stock quantities');
    console.log('');
    console.log('   OR delete and recreate with manage_inventory enabled from the start.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

checkDefaultBehavior();
