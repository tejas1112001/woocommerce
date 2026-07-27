-- =====================================================
-- VERIFICATION SCRIPT - Check database state
-- =====================================================
-- Run this BEFORE and AFTER the reset to compare

-- Count rows in key tables
SELECT 
    'PRODUCTS & VARIANTS' as category,
    (SELECT COUNT(*) FROM "product") as products,
    (SELECT COUNT(*) FROM "product_variant") as variants,
    (SELECT COUNT(*) FROM "inventory_item") as inventory_items;

SELECT 
    'ORDERS & CARTS' as category,
    (SELECT COUNT(*) FROM "order") as orders,
    (SELECT COUNT(*) FROM "cart") as carts,
    (SELECT COUNT(*) FROM "line_item") as line_items;

SELECT 
    'CUSTOMERS & ADDRESSES' as category,
    (SELECT COUNT(*) FROM "customer") as customers,
    (SELECT COUNT(*) FROM "address") as addresses;

SELECT 
    'PAYMENTS & FULFILLMENTS' as category,
    (SELECT COUNT(*) FROM "payment") as payments,
    (SELECT COUNT(*) FROM "payment_collection") as payment_collections,
    (SELECT COUNT(*) FROM "fulfillment") as fulfillments;

SELECT 
    'CORE CONFIG' as category,
    (SELECT COUNT(*) FROM "store") as stores,
    (SELECT COUNT(*) FROM "region") as regions,
    (SELECT COUNT(*) FROM "currency") as currencies,
    (SELECT COUNT(*) FROM "sales_channel") as sales_channels;

SELECT 
    'USERS (PROTECTED)' as category,
    (SELECT COUNT(*) FROM "user") as total_users,
    (SELECT COUNT(*) FROM "user" WHERE deleted_at IS NULL) as active_users;

-- Show user emails (to verify they're preserved)
SELECT 
    id,
    email,
    first_name,
    last_name,
    created_at
FROM "user"
WHERE deleted_at IS NULL
ORDER BY created_at;
