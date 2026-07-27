/**
 * Truncates Medusa application data while preserving admin users and auth.
 *
 * Usage: node scripts/cleanup-database.js
 * Optional: DRY_RUN=1 node scripts/cleanup-database.js
 */
const { Client } = require("pg")

const PRESERVED_TABLES = new Set([
  // Admin authentication
  "user",
  "auth_identity",
  "provider_identity",
  "auth_mfa_factor",
  "auth_mfa_recovery_code",
  "user_preference",
  "user_rbac_role",
  "invite",
  "invite_rbac_role",
  // Schema migrations
  "mikro_orm_migrations",
  "link_module_migrations",
  "script_migrations",
  // Store bootstrap configuration
  "store",
  "store_currency",
  "store_locale",
  "api_key",
  "publishable_api_key_sales_channel",
  "sales_channel",
  "sales_channel_stock_location",
  "region",
  "region_country",
  "region_payment_provider",
  "currency",
  "payment_provider",
  "fulfillment_provider",
  "notification_provider",
  "tax_provider",
  "stock_location",
  "stock_location_address",
  "fulfillment_set",
  "location_fulfillment_set",
  "location_fulfillment_provider",
  "service_zone",
  "geo_zone",
  "shipping_profile",
  "shipping_option_type",
  "tax_region",
])

const SEQUENCES_TO_RESET = [
  "order_change_action_ordering_seq",
  "order_claim_display_id_seq",
  "order_display_id_seq",
  "order_exchange_display_id_seq",
  "return_display_id_seq",
]

async function main() {
  const dryRun = process.env.DRY_RUN === "1"
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://postgres:tejas@localhost/medusa-medusa-backend",
  })

  await client.connect()

  try {
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    )
    const allTables = tablesResult.rows.map((row) => row.tablename)
    const tablesToTruncate = allTables.filter(
      (table) => !PRESERVED_TABLES.has(table)
    )

    console.log(`Preserving ${PRESERVED_TABLES.size} tables`)
    console.log(`Truncating ${tablesToTruncate.length} tables`)

    if (dryRun) {
      console.log("\nDRY RUN - tables that would be truncated:")
      console.log(tablesToTruncate.join("\n"))
      return
    }

    await client.query("BEGIN")

    const customerAuth = await client.query(
      `SELECT id FROM auth_identity
       WHERE app_metadata->>'customer_id' IS NOT NULL`
    )
    const customerAuthIds = customerAuth.rows.map((row) => row.id)

    if (customerAuthIds.length) {
      await client.query(
        `DELETE FROM provider_identity
         WHERE auth_identity_id = ANY($1::text[])`,
        [customerAuthIds]
      )
      await client.query(
        `DELETE FROM auth_mfa_factor
         WHERE auth_identity_id = ANY($1::text[])`,
        [customerAuthIds]
      )
      await client.query(
        `DELETE FROM auth_mfa_recovery_code
         WHERE auth_identity_id = ANY($1::text[])`,
        [customerAuthIds]
      )
      await client.query(
        `DELETE FROM auth_identity
         WHERE id = ANY($1::text[])`,
        [customerAuthIds]
      )
      console.log(`Removed ${customerAuthIds.length} customer auth identities`)
    }

    if (tablesToTruncate.length) {
      const truncateSql = `TRUNCATE TABLE ${tablesToTruncate
        .map((table) => `"${table}"`)
        .join(", ")} RESTART IDENTITY CASCADE`
      await client.query(truncateSql)
      console.log("Application tables truncated")
    }

    for (const sequence of SEQUENCES_TO_RESET) {
      await client.query(`ALTER SEQUENCE "${sequence}" RESTART WITH 1`)
    }
    console.log(`Reset ${SEQUENCES_TO_RESET.length} display-id sequences`)

    const users = await client.query(
      'SELECT email FROM "user" ORDER BY email'
    )
    console.log("\nPreserved admin users:")
    users.rows.forEach((row) => console.log(`  - ${row.email}`))

    await client.query("COMMIT")
    console.log("\nDatabase cleanup completed successfully")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error("Database cleanup failed:", error.message)
  process.exit(1)
})
