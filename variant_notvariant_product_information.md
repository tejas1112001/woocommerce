# Product Variants and Inventory - Complete Reference Guide

**Project:** Swami Om Enterprises - Medusa v2 + Next.js Storefront  
**Backend:** Medusa.js v2.15.3 (PostgreSQL)  
**Frontend:** Next.js 16 (App Router) - solace-medusa-starter  
**Last Updated:** July 2026

---

## Table of Contents

1. [Products with Variants](#1-products-with-variants)
2. [Products without Variants](#2-products-without-variants)
3. [Inventory Settings](#3-inventory-settings)
4. [Complete Product Creation Flow](#4-complete-product-creation-flow)
5. [Storefront Behavior](#5-storefront-behavior)
6. [Quick Reference Table](#6-quick-reference-table)

---

## 1. Products with Variants

### What Is a Variant Product?

A **variant product** is a product that has multiple purchasable versions (SKUs) distinguished by one or
more **option axes**, such as:

- **Size** - S, M, L, XL
- **Color** - Navy, White, Black
- **Size + Color** (combined) - S / Navy, M / White, L / Black, etc.

In Medusa, every product **must** have at least one variant. Even a product without real options (like a
single mug) will have exactly one auto-generated variant internally. However, a variant product in practical
terms is one where the merchant deliberately creates multiple variants so the customer can choose.

**Real-world example in this project:**

> **Swami T-shirt** (handle: swami-t-shirt)  
> Options: Color (Navy, White, Black) x Size (S, M, L, XL)  
> = **12 variants** total  
> Each variant has its own SKU, price, inventory count, and optionally its own images.

---

### How Inventory Works for Each Variant

Inventory in Medusa v2 is **per-variant**, not per-product. The data model is a layered chain:

```
Product
  +-- Product Variant (e.g., S / Navy)
       +-- Inventory Item  (one per variant)
            +-- Inventory Level  (one per stock location)
                 +-- stocked_quantity   = physical units in the warehouse
                 +-- reserved_quantity  = units locked in pending carts/orders
                 +-- available_quantity = stocked_quantity - reserved_quantity
```

**Key formula:**

```
available_quantity = stocked_quantity - reserved_quantity
```

This is the number customers can actually buy right now.

**Example - Swami T-shirt, variant S / Navy:**

| Field               | Value |
|---------------------|-------|
| stocked_quantity    | 10    |
| reserved_quantity   | 2     |
| available_quantity  | **8** |

A new customer can add a maximum of **8** units to their cart.

---

### What Happens If Inventory Is Not Added?

When a variant is created but **no inventory level is set up**, the following occurs:

| Condition                    | Result                                                             |
|------------------------------|--------------------------------------------------------------------|
| manage_inventory = true      | Medusa treats inventory_quantity = 0 so product is **out of stock** |
| manage_inventory = false     | Inventory is ignored so product is **always purchasable**          |

> **Important - Medusa v2 Admin UI Limitation:**
> Creating a product through the Medusa Admin UI does **not** automatically create inventory items, even
> when manage_inventory = true. This is a known implementation gap - the Admin UI does not invoke the
> createProductVariantsWorkflow that triggers automatic inventory item creation. You must **manually add
> inventory** after creating a product via the Admin UI.
> Products created via seed scripts (using createProductsWorkflow) **do** have inventory items created automatically.

---

### Can Customers Purchase If Stock Is 0 or Inventory Is Missing?

This depends entirely on two variant-level flags:

| manage_inventory | allow_backorder | Stock = 0 or missing | Customer can purchase? |
|---|---|---|---|
| false | any | any | Yes - always |
| true | true | 0 | Yes - backorder allowed |
| true | false | 0 | No - Out of stock |
| true | false | not set (null) | No - treated as 0 |

**Source - product-actions/index.tsx (inStock computed value):**

```typescript
const inStock = useMemo(() => {
  // If we do not manage inventory, we can always add to cart
  if (selectedVariant && !selectedVariant.manage_inventory) {
    return true
  }
  // If we allow back orders on the variant, we can add to cart
  if (selectedVariant?.allow_backorder) {
    return true
  }
  // If there is inventory available, we can add to cart
  if (
    selectedVariant?.manage_inventory &&
    (selectedVariant?.inventory_quantity || 0) > 0
  ) {
    return true
  }
  // Otherwise, we cannot add to cart
  return false
}, [selectedVariant])
```

---

### How Track Inventory Affects Purchasing

Track Inventory in the Medusa Admin UI maps to the manage_inventory field on the variant.

| Track Inventory         | Behavior                                                                                                    |
|-------------------------|-------------------------------------------------------------------------------------------------------------|
| **OFF** manage_inventory = false | Medusa ignores all inventory counts. The product is always available for purchase. The Add to Cart button is always enabled. |
| **ON** manage_inventory = true  | Medusa actively checks inventory_quantity. The button shows Out of stock if quantity is 0 and allow_backorder = false. |

---

### Real-World Examples

**Example A - T-shirt with 12 variants, inventory set:**

```
Product: Swami T-shirt
Variant: M / Navy
  manage_inventory: true
  stocked_quantity: 10
  reserved_quantity: 0
  available_quantity: 10

  -> Customer sees: Add to Cart (enabled)
  -> Customer can add up to 10 units
```

**Example B - T-shirt variant with inventory depleted:**

```
Variant: S / White
  manage_inventory: true
  stocked_quantity: 0
  reserved_quantity: 0
  available_quantity: 0

  -> Customer sees: Out of stock (button disabled)
  -> Customer cannot purchase
```

**Example C - T-shirt variant with Track Inventory OFF:**

```
Variant: L / Black
  manage_inventory: false
  stocked_quantity: (not tracked)

  -> Customer sees: Add to Cart (always enabled)
  -> Customer can always purchase (risk of overselling!)
```

**Example D - Variant created via Admin UI (no inventory item created):**

```
Variant: XL / Navy
  manage_inventory: true
  inventory_item: NOT CREATED (Admin UI gap - known bug)
  inventory_quantity: null -> treated as 0

  -> Customer sees: Out of stock (button disabled)
  -> Fix: Manually add inventory via Admin UI or script
```

---

## 2. Products without Variants

### What Is a Non-Variant Product?

A **non-variant product** is a product with no meaningful option axes - only one purchasable version
exists. Examples:

- A specific book edition
- A single-size poster
- A service or digital download

In Medusa, these products still **require at least one variant** to be valid. When no explicit options or
variants are defined, Medusa automatically creates:

- **One default product option** titled "Default option"
- **One default variant** with an option value of "Default option value"

This is Medusas internal convention and is **completely normal**.

---

### Why the Storefront Shows "Default option value" for Products Without Variants

When a product has only a single auto-generated variant, the OptionSelect component on the product page
**will render a selector** showing the option values returned from the Medusa API.

Because Medusa always returns the option with its value (e.g., "Default option value"), the storefront
displays it as a pill/button that the customer must click to select the variant before adding to cart.

**Data flow:**

```
Medusa API Response:
  product.options = [
    { id: "opt_xxx", title: "Default option", values: ["Default option value"] }
  ]
  product.variants = [
    { id: "var_yyy", title: "Default option value", options: [...] }
  ]

Storefront OptionSelect renders:
  Option label:  Default option
  Option button: [ Default option value ]  <- customer clicks this to select the variant
```

Once clicked, the variant is selected and the Add to Cart button becomes active.

---

### Is This Normal Behavior?

**Yes, this is completely normal.** Medusa v2 requires the product-variant structure regardless of whether
the product has real options. The "Default option value" label is auto-generated by Medusa for
single-variant products with no custom options defined.

**You can customize this label** by:

1. Going to Medusa Admin -> Product -> Variants
2. Editing the option title and value to something more user-friendly
   (e.g., rename "Default option" to "Style", and "Default option value" to "Standard")

Alternatively, the storefront can be modified to hide the option selector for products with only one
variant and one option value (see Section 5 for implementation details).

---

### How Inventory Is Managed for Non-Variant Products

Since the single variant is still a proper Medusa variant, inventory management works **identically**
to a variant product:

```
Product: My Single Product
  +-- Variant: Default option value  (var_yyy)
       +-- Inventory Item: (inv_zzz)
            +-- Inventory Level @ Default Location
                 +-- stocked_quantity:  50
                 +-- reserved_quantity:  3
                 +-- available_quantity: 47
```

You must still:
1. Confirm that an inventory item was created for the default variant
2. Set a stocked quantity at a stock location
3. Ensure the stock location is linked to the sales channel

---

### What Happens If No Stock Is Added?

| manage_inventory | Inventory set?   | Storefront behavior                         |
|------------------|------------------|---------------------------------------------|
| false            | No               | Product always purchasable                  |
| true             | No               | Out of stock - cannot add to cart           |
| true             | Yes (qty > 0)    | Add to Cart enabled                         |
| true             | Yes (qty = 0)    | Out of stock - cannot add to cart           |

---

### Can Customers Still Purchase the Product?

**Yes**, if either:
- manage_inventory = false (Track Inventory is OFF), **or**
- manage_inventory = true and stocked_quantity > 0

**No**, if:
- manage_inventory = true and stocked_quantity = 0, **or**
- manage_inventory = true and no inventory was ever configured

---

### Examples

**Example A - Single product, Track Inventory OFF:**

```
Product: Handmade Lamp (no options, single variant)
  Variant: Default option value
  manage_inventory: false

  -> Storefront: [ Default option value ] button -> click -> Add to Cart enabled
  -> Customer can always purchase
```

**Example B - Single product, Track Inventory ON, stock added:**

```
Product: Art Print (no options, single variant)
  Variant: Default option value
  manage_inventory: true
  stocked_quantity: 25

  -> Storefront: [ Default option value ] button -> click -> Add to Cart enabled
  -> Customer can purchase up to 25 units
```

**Example C - Single product, Track Inventory ON, no stock:**

```
Product: Limited Badge (no options, single variant)
  manage_inventory: true
  stocked_quantity: 0 (or inventory item not created)

  -> Storefront: [ Default option value ] button -> click -> Out of stock (disabled)
  -> Customer cannot purchase
```

---

## 3. Inventory Settings

### Difference Between Track Inventory ON and OFF

| Setting                  | Admin UI Field     | DB Field                    | Effect                                                                                                                      |
|--------------------------|--------------------|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Track Inventory = ON** | Checkbox enabled   | manage_inventory = true     | Medusa checks and enforces stock levels. Purchasing is blocked when available_quantity = 0. Quantities are reserved on cart addition and deducted on fulfillment. |
| **Track Inventory = OFF**| Checkbox disabled  | manage_inventory = false    | Medusa completely ignores inventory. Product is always purchasable. No stock deduction occurs. Risk of overselling.         |

---

### What Happens When Stock Is Greater Than 0

```
stocked_quantity   = 50
reserved_quantity  = 5
available_quantity = 45  <- what the storefront enforces

-> Button state: Add to Cart (enabled)
-> Max qty selector: 45
-> Customer can add up to 45 units to cart
-> Each unit added to cart: reserved_quantity increases by 1
-> On admin fulfillment: stocked_quantity decremented, reservation released
```

---

### What Happens When Stock Is Equal to 0

```
stocked_quantity   = 0
reserved_quantity  = 0
available_quantity = 0

Case 1 - manage_inventory = true AND allow_backorder = false:
  -> Button state: Out of stock (disabled)
  -> Customer CANNOT add to cart or place an order

Case 2 - manage_inventory = true AND allow_backorder = true:
  -> Button state: Add to Cart (enabled, backorder)
  -> Customer CAN place an order even with 0 stock

Case 3 - manage_inventory = false:
  -> Button state: Add to Cart (always enabled)
  -> Customer CAN place an order regardless of stock count
```

---

### What Happens When Stock Is Not Added At All

"Not added at all" means either:
1. No inventory item was linked to the variant (common with Admin UI products), **or**
2. An inventory item exists but no inventory level was set for any stock location

| manage_inventory | Outcome                                                                       |
|------------------|-------------------------------------------------------------------------------|
| true             | inventory_quantity resolves to null, treated as 0, storefront shows Out of stock |
| false            | Inventory is not checked, Add to Cart is always available                     |

> **Note:** In the storefront inStock calculation, the expression
> `(selectedVariant?.inventory_quantity || 0) > 0` treats both null and 0 as "no stock available."

---

### Can Customers Still Place Orders in Each Case?

| Scenario         | manage_inventory | allow_backorder | Can customer order?  |
|------------------|------------------|-----------------|----------------------|
| Stock > 0        | true             | any             | Yes                  |
| Stock = 0        | true             | false           | No                   |
| Stock = 0        | true             | true            | Yes (backorder)      |
| Stock not set    | true             | false           | No                   |
| Stock not set    | true             | true            | Yes (backorder)      |
| Any stock level  | false            | any             | Yes (always)         |

---

## 4. Complete Product Creation Flow

### Step 1 - Product Creation

In the Medusa Admin UI (http://localhost:9000/app):

1. Go to **Products** -> **Create Product**
2. Fill in:
   - **Title** (e.g., "Winter Jacket")
   - **Handle** (auto-generated from title; becomes the URL slug: winter-jacket)
   - **Description**
   - **Thumbnail** (main listing image)
   - **Images** (gallery images)
   - **Category** (optional, e.g., "Shirts")
3. Set **Status** to Draft initially

---

### Step 2 - Variant vs. Non-Variant Decision

**If your product has options (size, color, etc.):**

1. Go to the **Variants** tab
2. Add **Options** first (e.g., "Size" with values S, M, L, XL)
3. Add multiple **Variants** - one per combination (e.g., Small, Medium, Large, XL)
4. Each variant can have:
   - Title (auto-composed or custom)
   - SKU (recommended for tracking)
   - manage_inventory toggle
   - Prices per region/currency

**If your product has NO options (single SKU):**

1. Skip adding custom options - Medusa auto-creates "Default option" with "Default option value"
2. The single default variant must still have its inventory configured separately

---

### Step 3 - Adding Prices

For each variant:

1. Open the variant in the **Variants** tab
2. Click **Prices**
3. Add a price per region/currency:
   - India region -> amount in INR (e.g., Rs.899 = enter 89900 in paise)
   - Europe region -> amount in EUR
4. Save

> A variant **without a price** will not appear on the storefront for regions where no price is set.

---

### Step 4 - Adding Inventory

> **WARNING:** This step is NOT automatic when creating products via the Admin UI.

For each variant via Admin UI:

1. Open the variant -> **Inventory** section
2. Click "Manage Inventory" or the edit icon
3. Under the stock location (e.g., "Default Location"), enter the stocked quantity
4. Save

**Via seed script - inventory IS automatic when using Medusa workflows:**

```typescript
// seed-swami-tshirt.ts - createProductsWorkflow auto-creates inventory items
await createProductsWorkflow(container).run({
  input: { products: [{ title: "Swami T-shirt", variants: [...] }] }
})

// Then set the inventory levels separately:
await createInventoryLevelsWorkflow(container).run({
  input: {
    inventory_levels: [{
      inventory_item_id: "inv_xxx",
      location_id: "loc_yyy",
      stocked_quantity: 10
    }]
  }
})
```

---

### Step 5 - Publishing the Product

1. Open the product in Admin UI
2. Click the **Status** dropdown (top right)
3. Change from Draft -> Published
4. Save

> A Draft product is **invisible** to the storefront, even if it has inventory and is linked to the
> sales channel.

---

### Step 6 - Assigning to Sales Channel

> **WARNING:** A product NOT linked to the correct sales channel will show a 404 on the storefront.

1. Open the product -> **Sales Channels** tab
2. Check **Web Store** (or your active sales channel name)
3. Save

The storefront publishable API key (NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) must be linked to the **same**
sales channel. A mismatch causes the store API to return no products at all.

---

### Step 7 - Storefront Behavior After Publishing

Once the product is published and linked to the correct sales channel:

| Check                                            | Expected Result                                              |
|--------------------------------------------------|--------------------------------------------------------------|
| http://localhost:8000/in/products/winter-jacket  | Product page loads successfully                              |
| Variant options rendered                         | Option selectors appear on the page                          |
| Add to Cart state                                | Enabled if stock > 0 or manage_inventory = false             |
| Cart updates                                     | reserved_quantity incremented in inventory                   |
| Fulfillment                                      | stocked_quantity deducted when admin creates fulfillment      |

---

## 5. Storefront Behavior

### Why a Non-Variant Product Displays "Default option value"

The storefront ProductActions component (product-actions/index.tsx) renders **all** product options
returned by the Medusa API:

```typescript
{(product.options || []).map((option) => (
  <OptionSelect
    key={option.id}
    // For non-variant products: { title: "Default option", values: ["Default option value"] }
    option={option}
    current={options[option.id]}
    updateOption={setOptionValue}
    title={option.title ?? ""}
  />
))}
```

Since Medusa always returns at least one option (even the auto-generated "Default option"), the
OptionSelect component renders a pill/button labeled **"Default option value"**.

The customer must click this pill to select the variant, which then enables the Add to Cart button.

This is **not a bug** - it is the expected rendering of a single-variant product in Medusas data model.

**Optional customization - hide the selector for single-option products:**

```tsx
// Only render the option selector if there is more than 1 value to choose from
{(product.options || [])
  .filter(opt => (opt.values?.length ?? 0) > 1)
  .map((option) => (
    <OptionSelect key={option.id} option={option} ... />
  ))
}
```

With this change, single-variant products skip the selector entirely, and the first (only) variant is
automatically pre-selected by the existing initialization logic in ProductActions.

---

### Why a Product Can Sometimes Be Purchased Even When No Inventory Is Added

The storefront inStock logic has **three separate conditions** where purchase is allowed:

```typescript
// Condition 1: manage_inventory = false -> always purchasable
if (selectedVariant && !selectedVariant.manage_inventory) {
  return true
}

// Condition 2: allow_backorder = true -> purchasable even at 0 stock
if (selectedVariant?.allow_backorder) {
  return true
}

// Condition 3: manage_inventory = true AND inventory_quantity > 0
if (
  selectedVariant?.manage_inventory &&
  (selectedVariant?.inventory_quantity || 0) > 0
) {
  return true
}
```

When a product is created via the Admin UI **without configuring inventory**, but with
manage_inventory = false (which may be the default in some Medusa configurations), the product is
immediately purchasable. This is the most common reason a newly created product with no inventory
still has an active Add to Cart button.

**Summary:**

```
No inventory added + manage_inventory = false  ->  CAN purchase (button active)
No inventory added + manage_inventory = true   ->  CANNOT purchase (Out of stock)
```

---

### How to Prevent Customers from Buying Out-of-Stock Products

**Option 1 - Enable Track Inventory (recommended):**

1. For every variant, set Track Inventory = ON in Admin UI
2. Add a stocked quantity at a stock location
3. Medusa automatically blocks orders when available_quantity = 0

**Option 2 - Disable Backorders:**

Ensure allow_backorder = false (the default) on every variant. Combined with manage_inventory = true,
this strictly enforces stock limits with no exceptions.

**Option 3 - Verify inventory items exist:**

If the Admin UI was used to create the product, verify that inventory items were actually linked:

```bash
cd c:\self_learning\project\medusa-backend\apps\backend
npx tsx verify-product-inventory.ts
```

If no inventory item exists for a variant with manage_inventory = true, Medusa treats it as 0 stock
and blocks purchasing - which is the correct behavior.

**Option 4 - Use seed scripts for new products:**

Create products programmatically using createProductsWorkflow. This guarantees inventory items are
created automatically alongside every variant, avoiding the Admin UI gap entirely.

---

## 6. Quick Reference Table

### Product Creation Method Comparison

| Method                              | Auto inventory item? | Inventory levels set?                      | Recommended?              |
|-------------------------------------|----------------------|--------------------------------------------|---------------------------|
| Medusa Admin UI                     | No                   | No (manual required)                       | Only for simple edits     |
| createProductsWorkflow (seed script)| Yes                  | Yes, with createInventoryLevelsWorkflow    | Yes - preferred           |
| Direct database script              | Manual               | Manual                                     | Only for emergency fixes  |

---

### Add to Cart Button State Summary

| Condition                                                              | Button Label        |
|------------------------------------------------------------------------|---------------------|
| No variant selected                                                    | Select variant      |
| Variant selected, manage_inventory = false                             | Add to Cart         |
| Variant selected, manage_inventory = true, qty > 0                    | Add to Cart         |
| Variant selected, manage_inventory = true, qty = 0, backorder = false | Out of stock        |
| Variant selected, manage_inventory = true, qty = 0, backorder = true  | Add to Cart         |
| Max cart quantity already reached                                      | Button disabled     |

---

### Inventory Quantity Lifecycle

```
[Admin adds stock]
    stocked = 50,  reserved = 0,  available = 50

[Customer A adds 3 to cart]
    stocked = 50,  reserved = 3,  available = 47

[Customer A abandons cart - timeout/expiry]
    stocked = 50,  reserved = 0,  available = 50  <- reservation automatically released

[Customer B adds 3 and completes payment]
    stocked = 50,  reserved = 3,  available = 47  <- still reserved until shipped

[Admin ships the order - creates fulfillment]
    stocked = 47,  reserved = 0,  available = 47  <- stock deducted on fulfillment

[Admin receives 20 new units - restocks]
    stocked = 67,  reserved = 0,  available = 67
```

---

### Related Files in This Project

| File                                                                                                    | Purpose                                                                          |
|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| solace-medusa-starter/src/modules/products/components/product-actions/index.tsx                         | inStock logic, Add to Cart handler, variant selection                            |
| solace-medusa-starter/src/modules/products/components/product-actions/option-select.tsx                 | Renders option pills (includes Default option value for non-variant products)    |
| medusa-backend/apps/backend/src/scripts/seed-swami-tshirt.ts                                            | Example of proper product + inventory creation via workflow                      |
| INVENTORY_FLOW_DIAGRAM.md                                                                               | Visual diagrams of the full purchase journey and inventory states                |
| INVENTORY_ROOT_CAUSE_REPORT.md                                                                          | Explanation of the Admin UI inventory creation gap                               |
| FIXING_404_AND_INVENTORY_GUIDE.md                                                                       | Step-by-step fix scripts for inventory and 404 issues                           |

---

*Documentation generated from codebase analysis of solace-medusa-starter and medusa-backend as of July 2026.*
