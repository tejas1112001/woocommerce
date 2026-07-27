import { MedusaAppLoader } from "@medusajs/framework";
import * as dotenv from "dotenv";

dotenv.config();

async function checkInventorySetup() {
  const { medusaApp } = await MedusaAppLoader.loadAsync();

  try {
    const query = medusaApp.query;

    console.log("\n=== CHECKING INVENTORY SETUP ===\n");

    // 1. Check if inventory module is enabled
    console.log("1️⃣ Checking Inventory Module...");
    const inventoryModule = medusaApp.modules.inventoryService;
    console.log(inventoryModule ? "   ✅ Inventory module is enabled" : "   ❌ Inventory module NOT found");

    // 2. Check stock locations
    console.log("\n2️⃣ Checking Stock Locations...");
    const locations = await query.graph({
      entity: "stock_location",
      fields: ["id", "name", "address.*"]
    });
    
    if (!locations || locations.length === 0) {
      console.log("   ❌ NO STOCK LOCATIONS FOUND!");
      console.log("   ⚠️  This is why you can't add inventory!");
      console.log("\n   TO FIX: Go to Admin → Settings → Locations → Create Location");
    } else {
      console.log(`   ✅ Found ${locations.length} location(s):`);
      locations.forEach((loc: any) => {
        console.log(`      - ${loc.name} (${loc.id})`);
      });
    }

    // 3. Check sales channels
    console.log("\n3️⃣ Checking Sales Channels...");
    const channels = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name", "is_disabled"]
    });
    
    if (channels && channels.length > 0) {
      console.log(`   ✅ Found ${channels.length} sales channel(s):`);
      channels.forEach((ch: any) => {
        console.log(`      - ${ch.name} (${ch.id}) ${ch.is_disabled ? '[DISABLED]' : ''}`);
      });
    }

    // 4. Check the T-Shirt product and variants
    console.log("\n4️⃣ Checking T-Shirt Product...");
    const products = await query.graph({
      entity: "product",
      fields: ["id", "title", "status", "variants.*"],
      filters: {
        title: "T-Shirt's"
      }
    });

    if (!products || products.length === 0) {
      console.log("   ❌ Product 'T-Shirt's' NOT FOUND");
    } else {
      const product = products[0];
      console.log(`   ✅ Product: ${product.title} (${product.id})`);
      console.log(`   Status: ${product.status}`);
      console.log(`   Variants: ${product.variants?.length || 0}`);

      if (product.variants && product.variants.length > 0) {
        console.log("\n   📦 Variant Details:");
        for (const variant of product.variants) {
          console.log(`\n   Variant: ${variant.title || 'Untitled'}`);
          console.log(`   - ID: ${variant.id}`);
          console.log(`   - SKU: ${variant.sku || 'No SKU'}`);
          console.log(`   - Manage Inventory: ${variant.manage_inventory}`);
          console.log(`   - Allow Backorder: ${variant.allow_backorder}`);

          // Check if variant has inventory items
          const inventoryItems = await inventoryModule.listInventoryItems({
            sku: variant.sku
          });

          if (inventoryItems.length > 0) {
            console.log(`   - Inventory Item: ✅ EXISTS (${inventoryItems[0].id})`);
            
            // Check inventory levels
            const levels = await inventoryModule.listInventoryLevels({
              inventory_item_id: inventoryItems[0].id
            });

            if (levels.length > 0) {
              console.log(`   - Stock Levels:`);
              levels.forEach((level: any) => {
                console.log(`      * Location: ${level.location_id}`);
                console.log(`        Stocked: ${level.stocked_quantity}`);
                console.log(`        Available: ${level.available_quantity}`);
              });
            } else {
              console.log(`   - Stock Levels: ❌ NONE (No stock added to any location)`);
            }
          } else {
            console.log(`   - Inventory Item: ❌ NOT CREATED`);
            console.log(`   ⚠️  This variant needs an inventory item!`);
          }
        }
      }
    }

    // 5. Check fulfillment providers
    console.log("\n5️⃣ Checking Fulfillment Setup...");
    const fulfillmentSets = await query.graph({
      entity: "fulfillment_set",
      fields: ["id", "name", "type"]
    });

    if (fulfillmentSets && fulfillmentSets.length > 0) {
      console.log(`   ✅ Found ${fulfillmentSets.length} fulfillment set(s)`);
    } else {
      console.log("   ⚠️  No fulfillment sets found");
    }

    console.log("\n=== DIAGNOSIS COMPLETE ===\n");

    // Summary
    console.log("📋 SUMMARY:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    if (!locations || locations.length === 0) {
      console.log("❌ MISSING: Stock Location");
      console.log("   → Go to Admin → Settings → Locations → Create Location");
      console.log("");
    }

    if (products && products.length > 0 && products[0].variants) {
      const hasInventoryItems = await Promise.all(
        products[0].variants.map(async (v: any) => {
          const items = await inventoryModule.listInventoryItems({ sku: v.sku });
          return items.length > 0;
        })
      );

      if (!hasInventoryItems.some(Boolean)) {
        console.log("❌ MISSING: Inventory Items for variants");
        console.log("   → Variants need inventory items created");
        console.log("");
      }
    }

    console.log("ℹ️  Once you have a stock location, you should see:");
    console.log("   - 'Manage Inventory' button in variant details");
    console.log("   - Option to add stock quantities");
    console.log("");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await medusaApp.onApplicationShutdown();
    process.exit(0);
  }
}

checkInventorySetup();
