import { MedusaAppLoader } from "@medusajs/framework";
import * as dotenv from "dotenv";

dotenv.config();

async function addTshirtInventory() {
  const { medusaApp } = await MedusaAppLoader.loadAsync();

  try {
    const query = medusaApp.query;

    // Find the T-Shirt product
    const products = await query.graph({
      entity: "product",
      fields: ["id", "title", "variants.*"],
      filters: {
        title: "T-Shirt's"
      }
    });

    if (!products || products.length === 0) {
      console.log("❌ Product 'T-Shirt's' not found");
      return;
    }

    const product = products[0];
    console.log(`\n✅ Found product: ${product.title} (${product.id})`);
    console.log(`   Variants: ${product.variants?.length || 0}\n`);

    if (!product.variants || product.variants.length === 0) {
      console.log("⚠️ No variants found for this product");
      return;
    }

    // Get stock location
    const locations = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"]
    });

    if (!locations || locations.length === 0) {
      console.log("❌ No stock locations found. Please create one first.");
      return;
    }

    const stockLocation = locations[0];
    console.log(`📍 Using stock location: ${stockLocation.name} (${stockLocation.id})\n`);

    // Get inventory module
    const inventoryModule = medusaApp.modules.inventoryService;

    // Add inventory for each variant
    for (const variant of product.variants) {
      console.log(`Processing variant: ${variant.title || variant.id}`);

      // Get inventory items for this variant
      const inventoryItems = await inventoryModule.listInventoryItems({
        sku: variant.sku
      });

      let inventoryItemId;

      if (inventoryItems.length === 0) {
        // Create inventory item if it doesn't exist
        console.log("  Creating new inventory item...");
        const newInventoryItem = await inventoryModule.createInventoryItems({
          sku: variant.sku,
          title: `${product.title} - ${variant.title}`
        });
        inventoryItemId = newInventoryItem.id;
      } else {
        inventoryItemId = inventoryItems[0].id;
      }

      // Check if inventory level already exists
      const existingLevels = await inventoryModule.listInventoryLevels({
        inventory_item_id: inventoryItemId,
        location_id: stockLocation.id
      });

      // Set quantity (adjust this number as needed)
      const quantityToAdd = 100; // Change this value for each variant

      if (existingLevels.length > 0) {
        // Update existing inventory level
        await inventoryModule.updateInventoryLevels(existingLevels[0].id, {
          stocked_quantity: quantityToAdd
        });
        console.log(`  ✅ Updated inventory: ${quantityToAdd} units`);
      } else {
        // Create new inventory level
        await inventoryModule.createInventoryLevels({
          inventory_item_id: inventoryItemId,
          location_id: stockLocation.id,
          stocked_quantity: quantityToAdd
        });
        console.log(`  ✅ Created inventory: ${quantityToAdd} units`);
      }

      // Link variant to inventory item if not already linked
      const linkModule = medusaApp.modules.linkModule;
      await linkModule.create({
        productService: {
          variant_id: variant.id
        },
        inventoryService: {
          inventory_item_id: inventoryItemId
        }
      });
    }

    console.log("\n🎉 All variants updated successfully!\n");

    // Verify the inventory
    console.log("📊 Final Inventory Status:\n");
    for (const variant of product.variants) {
      const inventoryItems = await inventoryModule.listInventoryItems({
        sku: variant.sku
      });

      if (inventoryItems.length > 0) {
        const levels = await inventoryModule.listInventoryLevels({
          inventory_item_id: inventoryItems[0].id
        });

        const totalStock = levels.reduce((sum, level) => sum + level.stocked_quantity, 0);
        console.log(`  ${variant.title || variant.sku}: ${totalStock} units`);
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await medusaApp.onApplicationShutdown();
    process.exit(0);
  }
}

addTshirtInventory();
