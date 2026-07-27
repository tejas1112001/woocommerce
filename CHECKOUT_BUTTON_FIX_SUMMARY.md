# Checkout "Proceed to Payment" Button Fix

**Issue:** The "Proceed to Payment" button is disabled on the checkout page.

**Root Cause:** No shipping options available for India region carts.

---

## Investigation Results

### Button Disable Logic
**File:** `solace-medusa-starter/src/modules/checkout/components/shipping/index.tsx` (Line 158)

```typescript
<Button
  disabled={!cart.shipping_methods?.[0]}  // ← Button disabled when no shipping method selected
>
  Proceed to payment
</Button>
```

The button is disabled when `cart.shipping_methods` array is empty, which happens when:
1. User hasn't selected a shipping method, OR
2. **No shipping options are available to select**

### Shipping Options Check

**API Endpoint:** `GET /store/shipping-options?cart_id={cartId}`

**Result:** Returns 0 shipping options for India region carts

---

## Database Configuration Analysis

### Fulfillment Architecture

```
Stock Location: Main Warehouse (sloc_01KT3BEZR6HXJQXNQ475A3S1FN)
    ↓
Fulfillment Set: Main Warehouse shipping (fuset_01KT3BHXBGH870C7PCNHVZWQAX)
    ↓
Service Zone: Pune (serzo_01KT3BJMC2PCK6PDEEPFC27FQA)
    ↓
Geo Zone: India (country_code: 'in')
    ↓
Shipping Option: India Standard Shipping (so_01KX2ZVW6YTZW991P645FAMD9E)
```

### Configuration Details

| Component | ID | Name | Details |
|-----------|-----|------|---------|
| **Stock Location** | sloc_01KT3BEZR6HXJQXNQ475A3S1FN | Main Warehouse | ✅ Exists |
| **Fulfillment Set** | fuset_01KT3BHXBGH870C7PCNHVZWQAX | Main Warehouse shipping | Type: shipping ✅ |
| **Service Zone** | serzo_01KT3BJMC2PCK6PDEEPFC27FQA | Pune | Covers India ✅ |
| **Geo Zone** | fgz_01KT3BJMC2ZZ1BF2YBF005H9AG | - | Country: 'in' ✅ |
| **Shipping Option** | so_01KX2ZVW6YTZW991P645FAMD9E | India Standard Shipping | ✅ Exists |
| **Shipping Profile** | sp_01KT1G6K2TVHYSQXNYWHF3CD2R | Default Shipping Profile | ✅ Linked |

### Competing Configuration Issue

**Problem:** There are TWO geo zones for India ('in'):

1. **Service Zone: Pune** (serzo_01KT3BJMC2PCK6PDEEPFC27FQA)
   - Fulfillment Set: Main Warehouse **shipping** ✅
   - Has shipping option: "India Standard Shipping"
   - Country: 'in'

2. **Service Zone: india** (serzo_01KX2RY6THJTTQ5PS7V76TH8ZG)
   - Fulfillment Set: Main Warehouse **pick up** ❌
   - NO shipping options
   - Country: 'in'

**Root Cause:** Medusa may be selecting the wrong service zone (pickup instead of shipping) when evaluating shipping options for carts.

---

## Solution

### Option 1: Delete Conflicting Geo Zone (Recommended)

Remove the duplicate India geo zone that's linked to the pickup fulfillment set:

```sql
DELETE FROM geo_zone 
WHERE id = 'fgz_01KX2RY6TGE9XXRHNTPE0YF4Y2' 
AND country_code = 'in' 
AND service_zone_id = 'serzo_01KX2RY6THJTTQ5PS7V76TH8ZG';
```

### Option 2: Add Shipping Options to Both Service Zones

Create shipping options for BOTH service zones that cover India.

### Option 3: Fix via Medusa Admin

1. Go to http://localhost:9000/app
2. Navigate to Settings → Locations
3. Select "Main Warehouse"
4. Check Fulfillment Sets configuration
5. Ensure shipping service zone has shipping options enabled
6. Remove or fix the pickup service zone for India

---

## Quick Fix Script

Create and run this script to fix the issue:

**File:** `medusa-backend/apps/backend/src/scripts/fix-india-geo-zones.ts`

```typescript
import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

export default async function fixIndiaGeoZones({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info('Checking for duplicate India geo zones...')

  const { data: geoZones } = await query.graph({
    entity: 'geo_zone',
    fields: ['id', 'country_code', 'service_zone_id', 'service_zone.name', 'service_zone.fulfillment_set.type'],
    filters: { country_code: 'in' },
  })

  logger.info(`Found ${geoZones?.length || 0} geo zones for India`)

  const pickupGeoZone = geoZones?.find(
    (gz: any) => gz.service_zone?.fulfillment_set?.type === 'pickup'
  )

  if (!pickupGeoZone) {
    logger.info('No pickup geo zone found - configuration is correct')
    return
  }

  logger.info(`Found problematic pickup geo zone: ${pickupGeoZone.id}`)
  logger.info(`Service zone: ${pickupGeoZone.service_zone?.name}`)

  // Delete the problematic geo zone
  const geoZoneModule = container.resolve('fulfillmentModuleService')
  await geoZoneModule.deleteGeoZones([pickupGeoZone.id])

  logger.info('✅ Deleted pickup geo zone for India')
  logger.info('Shipping options should now work correctly!')
}
```

**Run:**
```bash
cd medusa-backend/apps/backend
npx medusa exec src/scripts/fix-india-geo-zones.ts
```

---

## Verification Steps

After applying the fix:

1. **Clear cart and create new one:**
```bash
curl -X POST http://localhost:9000/store/carts \
  -H "x-publishable-api-key: pk_5f0d388535f5278b3bc940ed10446ad41d7d33ae756abc58a94c9d19d75939db" \
  -H "Content-Type: application/json" \
  -d '{"region_id":"reg_01KT38FWJSGY83D449PRADX2AN"}'
```

2. **Add product:**
```bash
curl -X POST http://localhost:9000/store/carts/{cartId}/line-items \
  -H "x-publishable-api-key: pk_..." \
  -H "Content-Type: application/json" \
  -d '{"variant_id":"variant_01KWPQ2XB6S31965BRTY1NWFJJ","quantity":1}'
```

3. **Set shipping address:**
```bash
curl -X POST http://localhost:9000/store/carts/{cartId} \
  -H "x-publishable-api-key: pk_..." \
  -H "Content-Type: application/json" \
  -d '{"shipping_address":{"first_name":"Test","last_name":"User","address_1":"123 Test St","city":"Pune","postal_code":"411001","country_code":"in","phone":"+919876543210"}}'
```

4. **Check shipping options:**
```bash
curl http://localhost:9000/store/shipping-options?cart_id={cartId} \
  -H "x-publishable-api-key: pk_..."
```

Expected result: Should return 1+ shipping options

5. **Test in browser:**
   - Go to http://localhost:8000/in/shop
   - Add product to cart
   - Go to checkout
   - Fill in shipping address
   - Verify "Delivery" section shows shipping options
   - Verify "Proceed to Payment" button becomes enabled

---

## Related Files

### Frontend
- `solace-medusa-starter/src/modules/checkout/components/shipping/index.tsx` - Shipping selection UI
- `solace-medusa-starter/src/lib/data/fulfillment.ts` - Shipping options fetch
- `solace-medusa-starter/src/lib/data/cart.ts` - Cart operations

### Backend
- `medusa-backend/apps/backend/src/scripts/setup-india-shipping.ts` - India shipping setup
- `medusa-backend/apps/backend/src/migration-scripts/initial-data-seed.ts` - Initial fulfillment config

---

## Alternative Workaround (Temporary)

If the fix doesn't work immediately, manually select shipping method via API:

```javascript
// After setting address, manually set shipping method
await fetch(`http://localhost:9000/store/carts/${cartId}/shipping-methods`, {
  method: 'POST',
  headers: {
    'x-publishable-api-key': 'pk_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    option_id: 'so_01KX2ZVW6YTZW991P645FAMD9E' // India Standard Shipping
  })
})
```

This will allow proceeding to payment even if the shipping option doesn't appear in the UI.

---

**Status:** Issue identified - duplicate geo zones causing Medusa to select wrong service zone  
**Next Step:** Run fix script to remove conflicting pickup geo zone  
**Priority:** HIGH - Blocks checkout completely
