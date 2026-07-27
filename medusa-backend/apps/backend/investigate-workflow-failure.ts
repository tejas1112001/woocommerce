import { Client } from 'pg';

async function investigateWorkflowFailure() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== INVESTIGATING WHY INVENTORY CREATION FAILS ===\n');

    // 1. Find ALL variants with manage_inventory=true but no inventory items
    console.log('1️⃣ Finding variants with manage_inventory=true but missing inventory:\n');

    const problematicVariants = await client.query(`
      SELECT 
        p.id as product_id,
        p.title as product_title,
        p.created_at as product_created,
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku,
        pv.manage_inventory,
        pv.created_at as variant_created,
        pv.updated_at as variant_updated
      FROM product p
      JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.deleted_at IS NULL 
      AND pv.deleted_at IS NULL
      AND pv.manage_inventory = true
      ORDER BY pv.created_at DESC
    `);

    console.log(`Found ${problematicVariants.rows.length} variants with manage_inventory=true:\n`);

    for (const v of problematicVariants.rows) {
      console.log(`📦 ${v.product_title} - ${v.variant_title || v.sku}`);
      console.log(`   Variant ID: ${v.variant_id}`);
      console.log(`   SKU: ${v.sku}`);
      console.log(`   Created: ${v.variant_created}`);
      console.log(`   Updated: ${v.variant_updated}`);

      // Check if inventory item exists
      const invItem = await client.query(`
        SELECT id, sku, title, created_at
        FROM inventory_item
        WHERE sku = $1 AND deleted_at IS NULL
      `, [v.sku]);

      if (invItem.rows.length > 0) {
        console.log(`   ✅ Inventory item EXISTS: ${invItem.rows[0].id}`);
        console.log(`      Created: ${invItem.rows[0].created_at}`);

        // Check if it's linked
        const link = await client.query(`
          SELECT id, variant_id, inventory_item_id, required_quantity, created_at
          FROM product_variant_inventory_item
          WHERE variant_id = $1 AND deleted_at IS NULL
        `, [v.variant_id]);

        if (link.rows.length > 0) {
          console.log(`   ✅ Link EXISTS: ${link.rows[0].id}`);
          console.log(`      Created: ${link.rows[0].created_at}`);
        } else {
          console.log(`   ❌ Link MISSING - Inventory item exists but not linked to variant!`);
          console.log(`      🔍 This indicates a workflow/module link failure`);
        }
      } else {
        console.log(`   ❌ Inventory item DOES NOT EXIST`);
        console.log(`      🔍 Workflow failed to create inventory item`);

        // Check if variant was created then updated
        const timeDiff = new Date(v.variant_updated).getTime() - new Date(v.variant_created).getTime();
        if (timeDiff > 1000) {
          console.log(`      ⚠️  Variant was updated ${Math.round(timeDiff/1000)}s after creation`);
          console.log(`      🔍 manage_inventory may have been changed AFTER creation`);
        }
      }
      console.log('');
    }

    // 2. Check module links configuration
    console.log('\n2️⃣ Checking Module Links Configuration:\n');

    try {
      const moduleLinkMigrations = await client.query(`
        SELECT * FROM link_module_migrations
        ORDER BY id DESC
        LIMIT 10
      `);

      console.log(`Found ${moduleLinkMigrations.rows.length} link migrations:`);
      moduleLinkMigrations.rows.forEach(m => {
        console.log(`   - ${m.name || m.id}`);
      });
    } catch (e: any) {
      console.log(`⚠️  Could not query migrations: ${e.message}`);
    }

    // 3. Check if there are any workflow execution records
    console.log('\n\n3️⃣ Checking Workflow Execution Records:\n');

    const workflowTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%workflow%'
      ORDER BY table_name
    `);

    if (workflowTables.rows.length > 0) {
      console.log('Workflow-related tables:');
      workflowTables.rows.forEach(t => console.log(`   - ${t.table_name}`));

      // Try to query workflow execution table
      for (const table of workflowTables.rows) {
        try {
          const count = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
          console.log(`   ${table.table_name}: ${count.rows[0].count} records`);
        } catch (e: any) {
          console.log(`   ${table.table_name}: Error querying - ${e.message}`);
        }
      }
    } else {
      console.log('❌ No workflow execution tables found');
      console.log('   🔍 This may indicate workflows are not being tracked');
    }

    // 4. Check event bus / subscriber execution
    console.log('\n\n4️⃣ Checking Event System:\n');

    const eventTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%event%' OR table_name LIKE '%message%')
      ORDER BY table_name
    `);

    if (eventTables.rows.length > 0) {
      console.log('Event-related tables:');
      eventTables.rows.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('⚠️  No event tables found');
    }

    // 5. Check for any errors in logs or workflow state
    console.log('\n\n5️⃣ Timeline Analysis - T-Shirt Product:\n');

    const tshirtTimeline = await client.query(`
      SELECT 
        'product' as entity,
        p.id,
        p.title,
        p.created_at as timestamp
      FROM product p
      WHERE p.title = 'T-Shirt''s'
      
      UNION ALL
      
      SELECT 
        'variant' as entity,
        pv.id,
        pv.title || ' (manage_inv=' || pv.manage_inventory || ')' as title,
        pv.created_at as timestamp
      FROM product_variant pv
      JOIN product p ON pv.product_id = p.id
      WHERE p.title = 'T-Shirt''s'
      
      UNION ALL
      
      SELECT 
        'inventory_item' as entity,
        ii.id,
        ii.sku || ' - ' || COALESCE(ii.title, 'untitled') as title,
        ii.created_at as timestamp
      FROM inventory_item ii
      WHERE ii.sku LIKE '%BLACK%' OR ii.sku LIKE '%WHITE%' OR ii.sku LIKE '%ORANGE%'
      
      UNION ALL
      
      SELECT 
        'link' as entity,
        pvii.id,
        'variant→inv link (req_qty=' || pvii.required_quantity || ')' as title,
        pvii.created_at as timestamp
      FROM product_variant_inventory_item pvii
      
      ORDER BY timestamp DESC
    `);

    console.log('Entity creation timeline:');
    tshirtTimeline.rows.forEach(row => {
      console.log(`   ${row.timestamp.toISOString()} | ${row.entity.padEnd(15)} | ${row.title}`);
    });

    // 6. Check the actual Medusa configuration
    console.log('\n\n6️⃣ Checking Medusa Module Configuration:\n');

    // Check if inventory module is properly registered
    const moduleCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('inventory_item', 'inventory_level', 'product_variant_inventory_item')
    `);

    console.log('Required inventory tables:');
    const requiredTables = ['inventory_item', 'inventory_level', 'product_variant_inventory_item'];
    requiredTables.forEach(table => {
      const exists = moduleCheck.rows.some(r => r.table_name === table);
      console.log(`   ${exists ? '✅' : '❌'} ${table}`);
    });

    // 7. Deep dive into variant creation pattern
    console.log('\n\n7️⃣ Pattern Analysis - How Were Variants Created:\n');

    const variantPattern = await client.query(`
      SELECT 
        pv.id,
        pv.title,
        pv.sku,
        pv.manage_inventory,
        pv.created_at,
        pv.updated_at,
        CASE 
          WHEN pv.created_at = pv.updated_at THEN 'created only'
          ELSE 'created then updated'
        END as creation_pattern,
        EXTRACT(EPOCH FROM (pv.updated_at - pv.created_at)) as seconds_diff
      FROM product_variant pv
      JOIN product p ON pv.product_id = p.id
      WHERE p.title = 'T-Shirt''s'
      AND pv.deleted_at IS NULL
      ORDER BY pv.created_at
    `);

    console.log('Variant creation patterns:\n');
    variantPattern.rows.forEach(v => {
      console.log(`${v.sku}:`);
      console.log(`   manage_inventory: ${v.manage_inventory}`);
      console.log(`   created: ${v.created_at}`);
      console.log(`   updated: ${v.updated_at}`);
      console.log(`   pattern: ${v.creation_pattern} (${v.seconds_diff}s diff)`);
      console.log('');
    });

    // DIAGNOSIS
    console.log('\n\n📋 DIAGNOSIS:\n');
    console.log('═════════════════════════════════════════\n');

    const manageTrue = problematicVariants.rows.filter(v => v.manage_inventory);
    const withInventory = await Promise.all(
      manageTrue.map(async v => {
        const inv = await client.query('SELECT id FROM inventory_item WHERE sku = $1', [v.sku]);
        return { variant: v, hasInventory: inv.rows.length > 0 };
      })
    );

    const missingInventory = withInventory.filter(v => !v.hasInventory);

    console.log(`Total variants with manage_inventory=true: ${manageTrue.length}`);
    console.log(`Variants MISSING inventory items: ${missingInventory.length}`);
    console.log('');

    if (missingInventory.length > 0) {
      console.log('🔴 CRITICAL FINDING:');
      console.log(`   ${missingInventory.length} variant(s) have manage_inventory=true but no inventory item!`);
      console.log('');
      console.log('POSSIBLE ROOT CAUSES:');
      console.log('');
      console.log('1. ADMIN UI CREATES VARIANTS WITHOUT WORKFLOW:');
      console.log('   - Admin UI might be directly inserting into database');
      console.log('   - Bypassing the createProductsWorkflow');
      console.log('   - No inventory creation workflow is triggered');
      console.log('');
      console.log('2. INVENTORY MODULE NOT INITIALIZED AT VARIANT CREATION:');
      console.log('   - Module linking happens after variant creation');
      console.log('   - Workflow expects module to be ready but it\'s not');
      console.log('');
      console.log('3. EVENT SUBSCRIBERS NOT FIRING:');
      console.log('   - variant.created event not triggering inventory creation');
      console.log('   - Subscriber may be missing or failing silently');
      console.log('');
      console.log('4. TIMING ISSUE IN ADMIN UI:');
      console.log('   - Variants created first with manage_inventory=false');
      console.log('   - Then updated to manage_inventory=true');
      console.log('   - But inventory creation only happens at CREATE time');
      console.log('');

      // Check the timing pattern
      const updatedAfterCreate = variantPattern.rows.filter(v => v.seconds_diff > 1);
      if (updatedAfterCreate.length > 0) {
        console.log('🔍 EVIDENCE FOUND:');
        console.log(`   ${updatedAfterCreate.length} variants were updated after creation`);
        console.log('   This suggests manage_inventory was changed POST-creation');
        console.log('   Medusa does NOT retroactively create inventory items on update!');
        console.log('');
      }
    }

    console.log('\nNEXT INVESTIGATION STEPS:');
    console.log('1. Check if Admin UI uses createProductsWorkflow or direct ORM');
    console.log('2. Check if inventory module subscribers exist');
    console.log('3. Check medusa-config.ts for module configuration');
    console.log('4. Review Medusa v2 documentation on inventory auto-creation');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

investigateWorkflowFailure();
