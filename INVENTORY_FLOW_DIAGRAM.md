# Complete Inventory Flow - Visual Guide

## The Complete Product-to-Sale Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCT CREATION                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Create Product         │
                    │   - Title: "T-Shirt"     │
                    │   - Handle: "t-shirt"    │
                    │   - Description          │
                    │   - Images               │
                    └──────────────┬───────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Add Variants           │
                    │   - Small / Red          │
                    │   - Medium / Blue        │
                    │   - Large / Green        │
                    └──────────────┬───────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Set Pricing            │
                    │   - India: ₹599         │
                    │   - USA: $15             │
                    └──────────────┬───────────┘
                                  │
┌─────────────────────────────────┼─────────────────────────────────┐
│                                 ▼                                 │
│           ┌──────────────────────────────────────┐               │
│           │  CRITICAL: Assign to Sales Channel   │               │
│           │  Without this, product is INVISIBLE! │               │
│           │                                       │               │
│           │  ✓ Web Store                         │               │
│           │  □ Mobile App                        │               │
│           │  □ Wholesale Portal                  │               │
│           └──────────────────────────────────────┘               │
│                                 │                                 │
└─────────────────────────────────┼─────────────────────────────────┘
                                  │
┌─────────────────────────────────┼─────────────────────────────────┐
│                                 ▼                                 │
│               INVENTORY MANAGEMENT LAYER                          │
│                                                                   │
│   For EACH Variant, create Inventory Items:                      │
│                                                                   │
│   Variant: Small/Red                                             │
│   └─ Inventory Item ID: inv_abc123                              │
│       └─ Inventory Level @ Main Warehouse                        │
│           ├─ Stocked: 100 units                                  │
│           ├─ Reserved: 0 units                                   │
│           └─ Available: 100 units                                │
│                                                                   │
│   Variant: Medium/Blue                                           │
│   └─ Inventory Item ID: inv_def456                              │
│       └─ Inventory Level @ Main Warehouse                        │
│           ├─ Stocked: 75 units                                   │
│           ├─ Reserved: 0 units                                   │
│           └─ Available: 75 units                                 │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │   Publish Product        │
                  │   Status: Published      │
                  └──────────────┬───────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ✅ PRODUCT IS NOW LIVE!                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Customer Purchase Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CUSTOMER JOURNEY                              │
└─────────────────────────────────────────────────────────────────────┘

Step 1: BROWSING
─────────────────
Customer visits: http://localhost:8000/in/products/t-shirt

Frontend → Backend API
         ↓
Request: "Show me t-shirt for India region"
         ↓
Backend checks:
  ✓ Product published?
  ✓ Product in "Web Store" channel?
  ✓ Product available in "India" region?
  ✓ Product has price in INR?
         ↓
Response: Product details + variants + prices
         ↓
Frontend displays: Product page with images, description, variants


Step 2: ADDING TO CART
───────────────────────
Customer selects: "Medium / Blue" + Quantity: 2
Clicks: "Add to Cart"

Frontend → Backend API
         ↓
Request: "Add 2 units of variant 'Medium/Blue' to cart"
         ↓
Backend checks inventory:
         ↓
┌────────────────────────────────────────┐
│ Inventory System Check:                │
│                                        │
│ Variant: Medium/Blue                   │
│ └─ Inventory Level @ Main Warehouse    │
│    ├─ Available: 75 units             │
│    ├─ Requested: 2 units              │
│    └─ Check: 75 >= 2? ✓ YES          │
│                                        │
│ ACTION: Reserve 2 units                │
│ ├─ Stocked: 75 (unchanged)            │
│ ├─ Reserved: 2 (increased)            │
│ └─ Available: 73 (75 - 2)             │
└────────────────────────────────────────┘
         ↓
Response: "Added to cart successfully"
         ↓
Frontend updates: Cart icon shows "2 items"


Step 3: CHECKOUT
────────────────
Customer clicks: "Proceed to Checkout"

Cart Status:
┌────────────────────────────────────────┐
│ Item: T-Shirt (Medium/Blue) × 2       │
│ Price: ₹599 × 2 = ₹1,198             │
│ Shipping: ₹50                         │
│ Total: ₹1,248                         │
│                                        │
│ Inventory Status:                      │
│ └─ 2 units RESERVED in cart           │
│    (Other customers can't buy these)  │
└────────────────────────────────────────┘

Customer enters:
- Shipping address
- Selects shipping method
- Enters payment details


Step 4: PAYMENT
───────────────
Customer clicks: "Place Order"

Frontend → Backend API
         ↓
Request: "Process payment + create order"
         ↓
Backend → Payment Provider (Razorpay)
         ↓
Payment Processed: ₹1,248
         ↓
┌────────────────────────────────────────┐
│ Order Created:                         │
│ Order ID: ord_xyz789                   │
│ Status: Paid                           │
│ Items: T-Shirt (Medium/Blue) × 2      │
│                                        │
│ Inventory Status:                      │
│ └─ Still RESERVED                      │
│    (Not deducted yet)                  │
│    ├─ Stocked: 75                      │
│    ├─ Reserved: 2                      │
│    └─ Available: 73                    │
└────────────────────────────────────────┘
         ↓
Response: "Order placed successfully!"
         ↓
Frontend shows: Order confirmation page
Customer receives: Email confirmation


Step 5: FULFILLMENT (Admin Side)
─────────────────────────────────
Admin logs into dashboard: http://localhost:9000/app
Goes to: Orders → ord_xyz789
Clicks: "Create Fulfillment"

Backend processes:
         ↓
┌────────────────────────────────────────┐
│ Fulfillment Created:                   │
│ Order: ord_xyz789                      │
│ Items: T-Shirt (Medium/Blue) × 2      │
│ Tracking: TRK123456                    │
│                                        │
│ Inventory Update:                      │
│ └─ DEDUCT from stock                   │
│    ├─ Stocked: 73 (75 - 2)            │
│    ├─ Reserved: 0 (released)          │
│    └─ Available: 73                    │
└────────────────────────────────────────┘
         ↓
Order Status: Fulfilled
         ↓
Customer receives: Shipping notification


Step 6: DELIVERY
────────────────
Package delivered to customer
Admin marks: Order as "Completed"

Final Inventory State:
┌────────────────────────────────────────┐
│ Variant: Medium/Blue                   │
│ └─ Inventory Level @ Main Warehouse    │
│    ├─ Stocked: 73 units                │
│    ├─ Reserved: 0 units                │
│    └─ Available: 73 units              │
│                                        │
│ Summary:                               │
│ Started with: 75 units                 │
│ Sold: 2 units                          │
│ Remaining: 73 units                    │
└────────────────────────────────────────┘

✅ TRANSACTION COMPLETE
```

---

## Inventory States Explained

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INVENTORY STATE DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────┘

State 1: INITIAL STATE
──────────────────────
┌──────────────────────────┐
│  Stocked:     100       │
│  Reserved:      0        │
│  Available:   100        │  ← Customers can buy up to 100 units
└──────────────────────────┘


State 2: ITEMS IN CART (Not yet paid)
──────────────────────────────────────
Customer A adds 5 to cart
Customer B adds 3 to cart

┌──────────────────────────┐
│  Stocked:     100       │  ← Physical stock unchanged
│  Reserved:      8        │  ← 5 + 3 reserved for carts
│  Available:    92        │  ← Only 92 available for new customers
└──────────────────────────┘


State 3: PAYMENT COMPLETED
───────────────────────────
Customer A completes payment (5 units)
Customer B abandons cart (3 units released after timeout)

┌──────────────────────────┐
│  Stocked:     100       │  ← Still unchanged (not shipped yet)
│  Reserved:      5        │  ← Only A's order reserved
│  Available:    95        │  ← B's 3 units back to available
└──────────────────────────┘


State 4: FULFILLMENT
────────────────────
Admin ships Customer A's order

┌──────────────────────────┐
│  Stocked:      95       │  ← Deducted 5 units
│  Reserved:      0        │  ← Reservation released
│  Available:    95        │  ← New baseline
└──────────────────────────┘


State 5: RESTOCK
────────────────
Admin receives 50 new units

┌──────────────────────────┐
│  Stocked:     145       │  ← Added 50 units
│  Reserved:      0        │
│  Available:   145        │  ← Customers can buy 145 units
└──────────────────────────┘
```

---

## Multi-Location Inventory

```
┌─────────────────────────────────────────────────────────────────────┐
│             MANAGING MULTIPLE WAREHOUSES                            │
└─────────────────────────────────────────────────────────────────────┘

Product: T-Shirt
Variant: Medium/Blue

Location 1: Mumbai Warehouse
┌──────────────────────────┐
│  Stocked:      50       │
│  Reserved:      5        │
│  Available:    45        │
└──────────────────────────┘

Location 2: Delhi Distribution Center
┌──────────────────────────┐
│  Stocked:      30       │
│  Reserved:      2        │
│  Available:    28        │
└──────────────────────────┘

Location 3: Bangalore Store
┌──────────────────────────┐
│  Stocked:      20       │
│  Reserved:      0        │
│  Available:    20        │
└──────────────────────────┘

TOTAL ACROSS ALL LOCATIONS
┌──────────────────────────┐
│  Stocked:     100       │
│  Reserved:      7        │
│  Available:    93        │  ← What customers see on storefront
└──────────────────────────┘


When customer orders 10 units:
───────────────────────────────
Medusa can automatically:
1. Check which location has stock
2. Reserve from closest/preferred location
3. Split fulfillment if needed

Example:
- 5 units from Mumbai (closest to customer)
- 5 units from Delhi (if Mumbai runs low)
```

---

## Database Relationships Simplified

```
┌──────────────────────────────────────────────────────────────────────┐
│                    DATABASE STRUCTURE                                │
└──────────────────────────────────────────────────────────────────────┘

product
├─ id: prod_123
├─ title: "T-Shirt"
├─ handle: "t-shirt"
└─ status: "published"
    │
    └─┬─ product_variant
      │  ├─ id: var_456
      │  ├─ title: "Medium / Blue"
      │  ├─ sku: "TS-MD-BLU"
      │  └─ product_id: prod_123
      │      │
      │      └─┬─ product_variant_inventory_item (LINK TABLE)
      │        │  ├─ variant_id: var_456
      │        │  └─ inventory_item_id: inv_789
      │        │
      │        └─┬─ inventory_item
      │          │  ├─ id: inv_789
      │          │  └─ sku: "TS-MD-BLU"
      │          │
      │          └─┬─ inventory_level (PER LOCATION)
      │            │
      │            ├─ Location: Mumbai Warehouse
      │            │  ├─ stocked_quantity: 50
      │            │  ├─ reserved_quantity: 5
      │            │  └─ location_id: loc_001
      │            │
      │            └─ Location: Delhi DC
      │               ├─ stocked_quantity: 30
      │               ├─ reserved_quantity: 2
      │               └─ location_id: loc_002


Think of it like Russian Nesting Dolls:
────────────────────────────────────────

Product (outer doll)
  └─ Variant (second doll)
      └─ Inventory Item (third doll)
          └─ Inventory Level (inner doll, per location)
```

---

## Common Scenarios

### Scenario 1: Product Shows "Out of Stock"

**Problem:**
Customer sees product but can't add to cart

**Diagnosis:**
```
Check inventory levels:

Stocked:     0   ← NO PHYSICAL STOCK
Reserved:    0
Available:   0   ← NOTHING TO SELL

OR

Stocked:    10   ← Have stock
Reserved:   10   ← But all reserved in carts
Available:   0   ← Nothing available for new customers
```

**Solution:**
1. If Stocked = 0: Add inventory
2. If Reserved = Stocked: Wait for cart expiry or clear abandoned carts

---

### Scenario 2: Overselling Prevention

**How Medusa Prevents Overselling:**

```
Initial State:
Available: 5 units

Timeline:
─────────
10:00:00 AM - Customer A adds 3 to cart
              Available: 2 units (5 - 3)

10:00:01 AM - Customer B tries to add 3 to cart
              ERROR: "Only 2 units available"
              Customer B can add max 2 units

10:00:02 AM - Customer B adds 2 to cart
              Available: 0 units

10:00:03 AM - Customer C tries to add 1 to cart
              ERROR: "Out of stock"

✅ Overselling prevented!
```

---

### Scenario 3: Cart Abandonment

**What Happens:**

```
10:00 AM - Customer adds 5 units to cart
           ├─ Stocked: 100
           ├─ Reserved: 5
           └─ Available: 95

Customer leaves without paying

10:30 AM - Cart expires (30 min default)
           ├─ Stocked: 100
           ├─ Reserved: 0  ← Reservation released
           └─ Available: 100  ← Back to full availability
```

---

### Scenario 4: Returns & Refunds

**When customer returns item:**

```
Original Order:
- Deducted 2 units from inventory
- Stocked went from 100 → 98

Return Processed:
- Admin creates return
- Admin restocks inventory
- Stocked goes back: 98 → 100

Customer refunded: ₹599 × 2 = ₹1,198
```

---

## Quick Troubleshooting Guide

### Issue: Can't find inventory management in admin

**Navigation:**
```
Products → Select Product → Variant Tab → Manage Inventory
```

### Issue: Inventory shows wrong numbers

**Check:**
```sql
SELECT 
  il.stocked_quantity,
  il.reserved_quantity,
  il.stocked_quantity - il.reserved_quantity as available
FROM inventory_level il
WHERE inventory_item_id = 'YOUR_ITEM_ID';
```

### Issue: Multiple variants, confused which one has stock

**Use script:**
```bash
npx tsx check-all-inventory.ts
```

Shows all variants and their inventory levels

---

## Key Takeaways

1. **Always add inventory** after creating product variants
2. **Assign to sales channel** or product stays invisible
3. **Publish product** to make it live
4. **Reserved ≠ Sold** - Reserved items can be released
5. **Available = Stocked - Reserved** - This is what customers can buy
6. **Multi-location** inventory allows better fulfillment
7. **Medusa prevents overselling** automatically

---

## Visual Summary

```
PRODUCT CREATION FLOW:
Create Product → Add Variants → Set Prices → Assign to Channel → Add Inventory → Publish

CUSTOMER PURCHASE FLOW:
Browse → Add to Cart (Reserve) → Checkout → Pay → Order Created → Admin Fulfills (Deduct) → Delivered

INVENTORY STATES:
Stocked (Physical) → Reserved (In Carts) → Available (Can Buy) → Deducted (Shipped)
```

---

**Need help?** Refer to:
- `QUICK_SOLUTION_SUMMARY.md` - Quick fixes
- `FIXING_404_AND_INVENTORY_GUIDE.md` - Detailed guide
- `MEDUSA_ADMIN_GUIDE.md` - Complete admin reference
