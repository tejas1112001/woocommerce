-- =====================================================
-- MEDUSA DATABASE RESET SCRIPT (PRESERVE USERS)
-- =====================================================
-- This script clears all data from Medusa database tables
-- EXCEPT the 'user' table to preserve login credentials
-- =====================================================

-- Start transaction for safety
BEGIN;

-- Disable triggers temporarily to avoid constraint issues
SET session_replication_role = 'replica';

-- =====================================================
-- STEP 1: TRUNCATE ALL TABLES EXCEPT USER TABLE
-- =====================================================

-- Core Medusa tables
TRUNCATE TABLE "store" CASCADE;
TRUNCATE TABLE "store_currency" CASCADE;
TRUNCATE TABLE "store_locale" CASCADE;
TRUNCATE TABLE "currency" CASCADE;
TRUNCATE TABLE "region" CASCADE;
TRUNCATE TABLE "region_country" CASCADE;
TRUNCATE TABLE "region_payment_provider" CASCADE;
TRUNCATE TABLE "sales_channel" CASCADE;
TRUNCATE TABLE "publishable_api_key_sales_channel" CASCADE;

-- Product related tables
TRUNCATE TABLE "product" CASCADE;
TRUNCATE TABLE "product_variant" CASCADE;
TRUNCATE TABLE "product_option" CASCADE;
TRUNCATE TABLE "product_option_value" CASCADE;
TRUNCATE TABLE "product_variant_option" CASCADE;
TRUNCATE TABLE "product_type" CASCADE;
TRUNCATE TABLE "product_collection" CASCADE;
TRUNCATE TABLE "product_tag" CASCADE;
TRUNCATE TABLE "product_tags" CASCADE;
TRUNCATE TABLE "product_category" CASCADE;
TRUNCATE TABLE "product_category_product" CASCADE;
TRUNCATE TABLE "product_sales_channel" CASCADE;
TRUNCATE TABLE "product_shipping_profile" CASCADE;
TRUNCATE TABLE "product_variant_inventory_item" CASCADE;
TRUNCATE TABLE "product_variant_price_set" CASCADE;
TRUNCATE TABLE "product_variant_product_image" CASCADE;
TRUNCATE TABLE "image" CASCADE;

-- Pricing tables
TRUNCATE TABLE "price_set" CASCADE;
TRUNCATE TABLE "price" CASCADE;
TRUNCATE TABLE "price_list" CASCADE;
TRUNCATE TABLE "price_list_rule" CASCADE;
TRUNCATE TABLE "price_rule" CASCADE;
TRUNCATE TABLE "price_preference" CASCADE;

-- Inventory tables
TRUNCATE TABLE "inventory_item" CASCADE;
TRUNCATE TABLE "inventory_level" CASCADE;
TRUNCATE TABLE "stock_location" CASCADE;
TRUNCATE TABLE "stock_location_address" CASCADE;
TRUNCATE TABLE "reservation_item" CASCADE;

-- Order related tables
TRUNCATE TABLE "order" CASCADE;
TRUNCATE TABLE "order_item" CASCADE;
TRUNCATE TABLE "order_line_item" CASCADE;
TRUNCATE TABLE "order_line_item_adjustment" CASCADE;
TRUNCATE TABLE "order_line_item_tax_line" CASCADE;
TRUNCATE TABLE "order_change" CASCADE;
TRUNCATE TABLE "order_change_action" CASCADE;
TRUNCATE TABLE "order_address" CASCADE;
TRUNCATE TABLE "order_cart" CASCADE;
TRUNCATE TABLE "order_claim" CASCADE;
TRUNCATE TABLE "order_claim_item" CASCADE;
TRUNCATE TABLE "order_claim_item_image" CASCADE;
TRUNCATE TABLE "order_exchange" CASCADE;
TRUNCATE TABLE "order_exchange_item" CASCADE;
TRUNCATE TABLE "order_fulfillment" CASCADE;
TRUNCATE TABLE "order_payment_collection" CASCADE;
TRUNCATE TABLE "order_promotion" CASCADE;
TRUNCATE TABLE "order_shipping" CASCADE;
TRUNCATE TABLE "order_shipping_method" CASCADE;
TRUNCATE TABLE "order_shipping_method_adjustment" CASCADE;
TRUNCATE TABLE "order_shipping_method_tax_line" CASCADE;
TRUNCATE TABLE "order_summary" CASCADE;
TRUNCATE TABLE "order_transaction" CASCADE;
TRUNCATE TABLE "order_credit_line" CASCADE;

-- Cart tables
TRUNCATE TABLE "cart" CASCADE;
TRUNCATE TABLE "cart_address" CASCADE;
TRUNCATE TABLE "cart_line_item" CASCADE;
TRUNCATE TABLE "cart_line_item_adjustment" CASCADE;
TRUNCATE TABLE "cart_line_item_tax_line" CASCADE;
TRUNCATE TABLE "cart_payment_collection" CASCADE;
TRUNCATE TABLE "cart_promotion" CASCADE;
TRUNCATE TABLE "cart_shipping_method" CASCADE;
TRUNCATE TABLE "cart_shipping_method_adjustment" CASCADE;
TRUNCATE TABLE "cart_shipping_method_tax_line" CASCADE;

-- Customer tables
TRUNCATE TABLE "customer" CASCADE;
TRUNCATE TABLE "customer_group" CASCADE;
TRUNCATE TABLE "customer_group_customer" CASCADE;
TRUNCATE TABLE "customer_address" CASCADE;
TRUNCATE TABLE "customer_account_holder" CASCADE;

-- Payment tables
TRUNCATE TABLE "payment" CASCADE;
TRUNCATE TABLE "payment_collection" CASCADE;
TRUNCATE TABLE "payment_collection_payment_providers" CASCADE;
TRUNCATE TABLE "payment_session" CASCADE;
TRUNCATE TABLE "payment_provider" CASCADE;
TRUNCATE TABLE "refund" CASCADE;
TRUNCATE TABLE "refund_reason" CASCADE;
TRUNCATE TABLE "capture" CASCADE;

-- Fulfillment tables
TRUNCATE TABLE "fulfillment" CASCADE;
TRUNCATE TABLE "fulfillment_set" CASCADE;
TRUNCATE TABLE "fulfillment_provider" CASCADE;
TRUNCATE TABLE "fulfillment_address" CASCADE;
TRUNCATE TABLE "fulfillment_item" CASCADE;
TRUNCATE TABLE "fulfillment_label" CASCADE;
TRUNCATE TABLE "location_fulfillment_provider" CASCADE;
TRUNCATE TABLE "location_fulfillment_set" CASCADE;
TRUNCATE TABLE "shipping_option" CASCADE;
TRUNCATE TABLE "shipping_option_price_set" CASCADE;
TRUNCATE TABLE "shipping_option_rule" CASCADE;
TRUNCATE TABLE "shipping_option_type" CASCADE;
TRUNCATE TABLE "shipping_profile" CASCADE;
TRUNCATE TABLE "service_zone" CASCADE;
TRUNCATE TABLE "geo_zone" CASCADE;
TRUNCATE TABLE "sales_channel_stock_location" CASCADE;

-- Return tables
TRUNCATE TABLE "return" CASCADE;
TRUNCATE TABLE "return_item" CASCADE;
TRUNCATE TABLE "return_reason" CASCADE;
TRUNCATE TABLE "return_fulfillment" CASCADE;

-- Promotion tables
TRUNCATE TABLE "promotion" CASCADE;
TRUNCATE TABLE "promotion_rule" CASCADE;
TRUNCATE TABLE "promotion_rule_value" CASCADE;
TRUNCATE TABLE "promotion_application_method" CASCADE;
TRUNCATE TABLE "promotion_campaign" CASCADE;
TRUNCATE TABLE "promotion_campaign_budget" CASCADE;
TRUNCATE TABLE "promotion_campaign_budget_usage" CASCADE;
TRUNCATE TABLE "promotion_promotion_rule" CASCADE;
TRUNCATE TABLE "application_method_buy_rules" CASCADE;
TRUNCATE TABLE "application_method_target_rules" CASCADE;

-- Tax tables
TRUNCATE TABLE "tax_rate" CASCADE;
TRUNCATE TABLE "tax_rate_rule" CASCADE;
TRUNCATE TABLE "tax_region" CASCADE;
TRUNCATE TABLE "tax_provider" CASCADE;

-- Workflow tables
TRUNCATE TABLE "workflow_execution" CASCADE;

-- Notification tables
TRUNCATE TABLE "notification" CASCADE;
TRUNCATE TABLE "notification_provider" CASCADE;

-- API Key tables
TRUNCATE TABLE "api_key" CASCADE;

-- Invite tables (admin invites)
TRUNCATE TABLE "invite" CASCADE;
TRUNCATE TABLE "invite_rbac_role" CASCADE;

-- OAuth/Auth tables (keeping user table intact)
TRUNCATE TABLE "auth_identity" CASCADE;
TRUNCATE TABLE "auth_mfa_factor" CASCADE;
TRUNCATE TABLE "auth_mfa_recovery_code" CASCADE;
TRUNCATE TABLE "provider_identity" CASCADE;

-- Account and credit tables
TRUNCATE TABLE "account_holder" CASCADE;
TRUNCATE TABLE "credit_line" CASCADE;

-- Other tables
TRUNCATE TABLE "property_label" CASCADE;
TRUNCATE TABLE "view_configuration" CASCADE;

-- NOTE: USER TABLE IS INTENTIONALLY NOT TRUNCATED
-- This preserves all user login credentials
-- Also not truncating: user_preference, user_rbac_role (related to user)

-- =====================================================
-- STEP 2: RESET SEQUENCES FOR ALL TABLES
-- =====================================================

DO $$
DECLARE
    seq_record RECORD;
BEGIN
    -- Reset all sequences to 1, except for user table sequence
    FOR seq_record IN 
        SELECT 
            sequence_schema,
            sequence_name,
            REPLACE(sequence_name, '_id_seq', '') as table_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
        AND sequence_name NOT LIKE 'user_id_seq'
    LOOP
        EXECUTE format('ALTER SEQUENCE %I.%I RESTART WITH 1', 
                      seq_record.sequence_schema, 
                      seq_record.sequence_name);
        RAISE NOTICE 'Reset sequence: %', seq_record.sequence_name;
    END LOOP;
END $$;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- STEP 3: VERIFICATION QUERIES
-- =====================================================

-- Show row counts for verification
SELECT 'store' as table_name, COUNT(*) as row_count FROM "store"
UNION ALL
SELECT 'product', COUNT(*) FROM "product"
UNION ALL
SELECT 'product_variant', COUNT(*) FROM "product_variant"
UNION ALL
SELECT 'order', COUNT(*) FROM "order"
UNION ALL
SELECT 'cart', COUNT(*) FROM "cart"
UNION ALL
SELECT 'customer', COUNT(*) FROM "customer"
UNION ALL
SELECT 'payment', COUNT(*) FROM "payment"
UNION ALL
SELECT 'inventory_item', COUNT(*) FROM "inventory_item"
UNION ALL
SELECT 'user (PRESERVED)', COUNT(*) FROM "user"
ORDER BY table_name;

-- =====================================================
-- STEP 4: RESTORE DEFAULT PUBLISHABLE API KEY
-- =====================================================
-- Note: This key will be linked to sales channels after seeding
-- The seed script will create its own key, so we don't insert here
-- Instead, run the seed migration which will create the key properly

-- COMMIT the transaction if everything looks good
-- If you want to test first, use ROLLBACK instead
COMMIT;
-- ROLLBACK;  -- Uncomment this and comment COMMIT to test without changes

-- =====================================================
-- POST-RESET NOTES
-- =====================================================
-- After running this script:
-- 1. All data is cleared except user accounts
-- 2. Sequences are reset (except user ID sequence)
-- 3. Run the seed migration: npx medusa db:migrate
-- 4. The seed script will create a NEW publishable API key
-- 5. Update your .env.local with the NEW key from Medusa Admin
-- 6. Users can still log in with their existing credentials
-- =====================================================
