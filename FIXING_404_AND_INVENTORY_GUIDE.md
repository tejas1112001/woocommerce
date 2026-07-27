# Fixing 404 Error & Complete Inventory Management Guide

**Date:** July 9, 2026  
**Issue:** Product page showing 404 at `/in/products/test-product`

---

## Part 1: Understanding & Fixing the 404 Error

### Current Situation

Your product **"Test Product"** exists in the database with handle `test-product`, but you're getting a 404 error when accessing:
```
http://localhost:8000/in/products/test-product
```

### Root Cause Analysis

From the database check, I found:
```
Product: Test Product (handle: test-product)
Status: published ✅
Variants: 1 variant exists ✅
Sales Channel Links: 1 active link to "Web Store" ✅
```

However, there's a **critical issue**:
- Your publishable API key is: `pk_6bdc9f0eb712287fba898904b9e918037ad956f9bf4ff9d92b039595415a58bf`
- This key is linked to **TWO sales channels**:
  1. "Default Sales Channel" (DELETED on 2026-07-09)
  2. "Web Store" (ACTIVE)
- Your product is linked to "Web Store" ✅
- But there might be a mismatch in the API key configuration

### The Fix - Solution 1: Verify Sales Channel Configuration

Run this diagnostic script to check the exact issue:

```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npx tsx check-product-visibility.ts
```

This will show you:
1. Which sales channels exist
2. Which channel the product is linked to
3. Which channel the publishable API key is using

### The Fix - Solution 2: Link Product to Correct Sales Channel

Create this file to fix the sales channel issue:

**File:** `c:\self_learning\project\medusa-backend\apps\backend\fix-test-product-channel.ts`

```typescript
import { Client } from 'pg'

async function fixTestProductChannel() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // 1. Get the product ID
    const product = await client.query(`
      SELECT id, title, handle, status
      FROM product
      WHERE handle = 'test-product' AND deleted_at IS NULL
    `)

    if (product.rows.length === 0) {
      console.log('❌ Product not found!')
      return
    }

    console.log('✅ Found product:', product.rows[0])
    const productId = product.rows[0].id

    // 2. Get active sales channels
    const channels = await client.query(`
      SELECT id, name, is_disabled, deleted_at
      FROM sales_channel
      WHERE deleted_at IS NULL AND is_disabled = false
    `)

    console.log('\n📋 Active sales channels:')
    channels.rows.forEach(ch => {
      console.log(`  - ${ch.name} (${ch.id})`)
    })

    // 3. Get the Web Store channel (the one in your .env)
    const webStoreChannel = channels.rows.find(ch => ch.name === 'Web Store')
    
    if (!webStoreChannel) {
      console.log('\n❌ Web Store channel not found!')
      return
    }

    console.log(`\n✅ Using Web Store channel: ${webStoreChannel.id}`)

    // 4. Check current product-channel links
    const currentLinks = await client.query(`
      SELECT sales_channel_id, deleted_at
      FROM product_sales_channel
      WHERE product_id = $1
    `, [productId])

    console.log('\n📋 Current product-channel links:')
    currentLinks.rows.forEach(link => {
      const status = link.deleted_at ? '❌ DELETED' : '✅ ACTIVE'
      console.log(`  - Channel ${link.sales_channel_id}: ${status}`)
    })

    // 5. Remove any soft-deleted links and add fresh link
    await client.query(`
      DELETE FROM product_sales_channel
      WHERE product_id = $1
    `, [productId])

    console.log('\n🧹 Cleaned up old links')

    // 6. Add fresh link to Web Store
    await client.query(`
      INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
    `, [productId, webStoreChannel.id])

    console.log('✅ Linked product to Web Store')

    // 7. Verify the fix
    const verification = await client.query(`
      SELECT 
        p.title,
        p.handle,
        p.status,
        sc.name as channel_name,
        psc.deleted_at
      FROM product p
      JOIN product_sales_channel psc ON p.id = psc.product_id
      JOIN sales_channel sc ON psc.sales_channel_id = sc.id
      WHERE p.id = $1
    `, [productId])

    console.log('\n✅ VERIFICATION:')
    console.log(verification.rows)

    console.log('\n🎉 Fix complete! Product should now be visible.')
    console.log('\nTest the URL: http://localhost:8000/in/products/test-product')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

fixTestProductChannel()
```

Run it:
```bash
npx tsx fix-test-product-channel.ts
```

### The Fix - Solution 3: Check Region Configuration

The URL pattern is `/{countryCode}/products/{handle}`, so ensure:

1. Region "in" (India) exists
2. Product is available in that region
3. Product has pricing for that region

Check regions:
```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npx medusa exec --file=check-regions.ts
```

Create `check-regions.ts`:
```typescript
import { MedusaAppLoader } from '@medusajs/framework'

async function checkRegions() {
  const { container } = await MedusaAppLoader.load()
  
  const query = container.resolve('query')
  
  const { data: regions } = await query.graph({
    entity: 'region',
    fields: ['id', 'name', 'currency_code', 'countries.*'],
  })
  
  console.log('Regions:', JSON.stringify(regions, null, 2))
}

checkRegions()
```

### The Fix - Solution 4: Clear Next.js Cache

Sometimes Next.js caches the 404 page. Clear it:

```bash
cd c:\self_learning\project\solace-medusa-starter
rm -r .next
npm run build
npm run dev
```

Then visit: `http://localhost:8000/in/products/test-product`

---

## Part 2: Understanding the Inventory System

### Medusa v2 Inventory Architecture

Medusa v2 uses a sophisticated multi-location inventory system:

```
Product (e.g., "T-Shirt")
  └─ Product Variant (e.g., "Small/Red", "Medium/Blue")
       └─ Inventory Item (unique per variant)
            └─ Inventory Level (per stock location)
                 ├─ Stocked Quantity
                 ├─ Reserved Quantity (in pending orders)
                 └─ Available Quantity = Stocked - Reserved
```

### Database Structure

```sql
-- 1. Product table
product
  ├─ id (product ID)
  ├─ title
  ├─ handle
  └─ status

-- 2. Product variants
product_variant
  ├─ id (variant ID)
  ├─ product_id (FK to product)
  ├─ title (e.g., "Small / Red")
  ├─ sku
  └─ manage_inventory (boolean)

-- 3. Inventory items (one per variant)
inventory_item
  ├─ id (inventory item ID)
  ├─ sku
  └─ requires_shipping

-- 4. Link between variant and inventory item
product_variant_inventory_item
  ├─ variant_id (FK to product_variant)
  ├─ inventory_item_id (FK to inventory_item)
  └─ required_quantity (default 1)

-- 5. Stock locations (warehouses)
stock_location
  ├─ id
  ├─ name
  └─ address_id

-- 6. Inventory levels (stock per location)
inventory_level
  ├─ id
  ├─ inventory_item_id (FK to inventory_item)
  ├─ location_id (FK to stock_location)
  ├─ stocked_quantity
  ├─ reserved_quantity
  └─ incoming_quantity
```

---

## Part 3: Complete Flow - How to Add Stock to a Product

### Method 1: Using Medusa Admin Dashboard (Easiest)

#### Step 1: Access Admin Dashboard
```
http://localhost:9000/app
```
Login with your admin credentials.

#### Step 2: Navigate to Products
1. Click **"Products"** in the left sidebar
2. Find your product: **"Test Product"**
3. Click on it to open the product details

#### Step 3: Go to Variants Section
1. Scroll down to the **"Variants"** section
2. You should see at least one variant (e.g., "Default Variant" or specific size/color)
3. Click on the variant you want to add inventory to

#### Step 4: Manage Inventory
1. In the variant detail, find the **"Inventory"** section
2. You'll see inventory levels per location
3. Click **"Adjust Inventory"** or **"+"** button
4. Enter the quantity you want to add
5. Select the stock location (e.g., "Default Location")
6. Click **"Save"**

#### Step 5: Verify
1. Check that the inventory quantity has increased
2. The product should now be purchasable on the storefront

---

### Method 2: Using Direct Database Script (For Bulk Operations)

Create this script to add inventory programmatically:

**File:** `c:\self_learning\project\medusa-backend\apps\backend\add-inventory-to-product.ts`

```typescript
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
    const LOCATION_NAME = 'Default Location' // Stock location name

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
```

Run it:
```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npx tsx add-inventory-to-product.ts
```

---

### Method 3: Using Medusa API (For Integration)

You can also add inventory via the Admin API:

```typescript
// Example API call to adjust inventory
const response = await fetch('http://localhost:9000/admin/inventory-items/{inventory_item_id}/location-levels/{location_id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  },
  body: JSON.stringify({
    stocked_quantity: 100
  })
})
```

---

## Part 4: Complete Product Creation Flow with Inventory

Here's the **COMPLETE STEP-BY-STEP PROCESS** to add a new product with inventory:

### Step 1: Ensure Prerequisites
- ✅ Region exists (e.g., "India" with "in" country code)
- ✅ Sales channel exists (e.g., "Web Store")
- ✅ Stock location exists (e.g., "Default Location")
- ✅ Publishable API key is configured in frontend `.env.local`

### Step 2: Create Product
```typescript
// Via Admin Dashboard or API
{
  title: "Winter Jacket",
  handle: "winter-jacket",  // URL slug
  description: "Warm winter jacket",
  status: "draft",  // Start as draft
  // Add images, prices, etc.
}
```

### Step 3: Create Variants
```typescript
// Each variant represents a specific SKU
[
  { title: "Small", sku: "WJ-SM", options: { size: "S" } },
  { title: "Medium", sku: "WJ-MD", options: { size: "M" } },
  { title: "Large", sku: "WJ-LG", options: { size: "L" } }
]
```

### Step 4: Link to Sales Channel
- Go to product → Sales Channels
- Check "Web Store"
- Save

### Step 5: Add Inventory (for each variant)
```
Variant: Small
Location: Default Location
Quantity: 50 units

Variant: Medium
Location: Default Location
Quantity: 75 units

Variant: Large
Location: Default Location
Quantity: 60 units
```

### Step 6: Publish Product
- Change status from "draft" to "published"
- Product is now live!

### Step 7: Verify
Visit: `http://localhost:8000/in/products/winter-jacket`

---

## Part 5: Troubleshooting Checklist

If products are not showing or you can't add them to cart:

### ✅ Product Checklist
- [ ] Product status is "published" (not "draft")
- [ ] Product has a valid handle (URL slug)
- [ ] Product has at least one variant
- [ ] Product has images (optional but recommended)
- [ ] Product has pricing for the region

### ✅ Sales Channel Checklist
- [ ] Product is linked to "Web Store" sales channel
- [ ] Sales channel is not disabled
- [ ] Publishable API key is linked to the same sales channel
- [ ] No soft-deleted (`deleted_at`) links in database

### ✅ Inventory Checklist
- [ ] Product variant has an inventory item created
- [ ] Inventory level exists for the stock location
- [ ] Stocked quantity > 0
- [ ] Available quantity (stocked - reserved) > 0
- [ ] Variant has `manage_inventory` = true (if you want inventory tracking)

### ✅ Region Checklist
- [ ] Region "in" (India) exists
- [ ] Region has country "IN" added
- [ ] Product is available in this region
- [ ] Product has pricing in INR for this region

### ✅ Frontend Configuration Checklist
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is correct in `.env.local`
- [ ] Publishable key matches the one in backend database
- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL` points to `http://localhost:9000`
- [ ] `NEXT_PUBLIC_DEFAULT_REGION` is set to `in`

---

## Part 6: Quick Commands Reference

### Check Product Status
```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npx tsx check-product-visibility.ts
```

### Fix Sales Channel Links
```bash
npx tsx fix-test-product-channel.ts
```

### Add Inventory
```bash
npx tsx add-inventory-to-product.ts
```

### View All Products via API
```bash
curl "http://localhost:9000/store/products" \
  -H "x-publishable-api-key: YOUR_PUBLISHABLE_KEY"
```

### Restart Backend
```bash
cd c:\self_learning\project\medusa-backend
npm run dev
```

### Restart Frontend
```bash
cd c:\self_learning\project\solace-medusa-starter
npm run dev
```

---

## Part 7: Understanding the URL Structure

Your storefront uses this URL pattern:
```
http://localhost:8000/{countryCode}/products/{productHandle}
```

Examples:
- `http://localhost:8000/in/products/test-product` (India)
- `http://localhost:8000/us/products/test-product` (USA)
- `http://localhost:8000/gb/products/test-product` (UK)

The `countryCode` must match a country in your regions:
- "in" → India region
- "us" → USA region
- "gb" → UK/Europe region

---

## Conclusion

To fix your 404 issue and add inventory:

1. **Run the fix script** to ensure sales channel linkage
2. **Add inventory** using Admin Dashboard or the provided script
3. **Verify** the product is accessible at the URL
4. **Test checkout** to ensure inventory is properly reserved

If issues persist, check each item in the troubleshooting checklist!
