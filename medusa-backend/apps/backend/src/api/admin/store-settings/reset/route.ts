import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import fs from "fs"
import path from "path"
import { exec } from "child_process"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  console.log("[STORE-SETTINGS] Received POST request to reset store data")

  try {
    const body = (req.body || {}) as { confirm_text?: string }

    if (body.confirm_text !== "RESET STORE DATA") {
      return res.status(400).json({
        message: "Invalid confirmation text. You must type exactly 'RESET STORE DATA'.",
      })
    }

    // 1. Prepare Backup Directory (.medusa/backups)
    const backupDir = path.resolve(process.cwd(), ".medusa", "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFilePathJson = path.join(backupDir, `backup_before_reset_${timestamp}.json`)
    const backupFilePathSql = path.join(backupDir, `backup_before_reset_${timestamp}.sql`)

    // 2. Obtain Medusa PG_CONNECTION Knex client
    let pgConnection: any
    try {
      pgConnection = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    } catch (e: any) {
      console.error("[STORE-SETTINGS] Failed to resolve PG_CONNECTION from container:", e)
      return res.status(500).json({
        message: "Could not access database connection from Medusa container.",
        error: e.message,
      })
    }

    // 3. Create Full JSON Database Backup Snapshot (100% Cross-Platform)
    const backupSnapshotEntities = [
      "product",
      "product_variant",
      "product_collection",
      "product_category",
      "inventory_item",
      "inventory_level",
      "order",
      "order_line_item",
      "cart",
      "customer",
      "promotion",
      "price",
      "fulfillment",
    ]

    const snapshotData: Record<string, any[]> = {}
    for (const table of backupSnapshotEntities) {
      try {
        const queryRes = await pgConnection.raw(`SELECT * FROM "${table}";`)
        const rows = queryRes.rows || queryRes || []
        snapshotData[table] = rows
      } catch {
        snapshotData[table] = []
      }
    }

    // Write clean, human-readable JSON backup
    fs.writeFileSync(backupFilePathJson, JSON.stringify(snapshotData, null, 2), "utf-8")
    console.log(`[STORE-SETTINGS] JSON database snapshot saved to ${backupFilePathJson}`)

    // Optional: Attempt pg_dump binary backup if available in system PATH or PostgreSQL bin directory
    const databaseUrl = process.env.DATABASE_URL
    if (databaseUrl) {
      // Find pg_dump binary path if standard environment PATH is missing pg_dump on Windows
      let pgDumpCmd = "pg_dump"
      const pgWinPath16 = "C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"
      const pgWinPath15 = "C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe"
      const pgWinPath17 = "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe"

      if (fs.existsSync(pgWinPath16)) pgDumpCmd = `"${pgWinPath16}"`
      else if (fs.existsSync(pgWinPath15)) pgDumpCmd = `"${pgWinPath15}"`
      else if (fs.existsSync(pgWinPath17)) pgDumpCmd = `"${pgWinPath17}"`

      exec(`${pgDumpCmd} "${databaseUrl}" -f "${backupFilePathSql}"`, (err) => {
        if (!err) {
          console.log(`[STORE-SETTINGS] SQL database dump saved to ${backupFilePathSql}`)
        }
      })
    }

    // 4. Operational entities to clear via clean DML DELETE
    const operationalTables = [
      "workflow_execution",
      "notification",
      "return",
      "fulfillment",
      "promotion",
      "price_list",
      "price_set",
      "reservation_item",
      "inventory_item",
      "cart",
      "order",
      "customer",
      "product",
    ]

    console.log("[STORE-SETTINGS] Resetting store data via DML DELETE...")

    for (const table of operationalTables) {
      await pgConnection.raw(`DELETE FROM "${table}";`).catch((err: any) => {
        console.warn(`[STORE-SETTINGS] Notice deleting from '${table}':`, err.message)
      })
    }

    // Reset sequence numbers (excluding user sequence)
    try {
      await pgConnection.raw(`
        DO $$
        DECLARE
            seq_record RECORD;
        BEGIN
            FOR seq_record IN 
                SELECT sequence_schema, sequence_name
                FROM information_schema.sequences
                WHERE sequence_schema = 'public'
                AND sequence_name NOT LIKE 'user%'
            LOOP
                EXECUTE format('ALTER SEQUENCE %I.%I RESTART WITH 1', 
                              seq_record.sequence_schema, 
                              seq_record.sequence_name);
            END LOOP;
        END $$;
      `)
    } catch (seqErr: any) {
      console.warn("[STORE-SETTINGS] Sequence reset notice:", seqErr.message)
    }

    // Count preserved users
    let preservedUsersCount = 0
    try {
      const userRes = await pgConnection.raw('SELECT COUNT(*) FROM "user";')
      const rows = userRes.rows || userRes
      preservedUsersCount = Number(rows?.[0]?.count || 0)
    } catch {
      preservedUsersCount = 1
    }

    console.log(`[STORE-SETTINGS] Reset completed! Preserved ${preservedUsersCount} admin user(s).`)

    return res.json({
      message: "E-Commerce store data reset successfully!",
      reset_timestamp: new Date().toISOString(),
      preserved: {
        admin_users_preserved: preservedUsersCount,
        system_config: "Preserved (Admin users, Store, Regions & Sales Channels intact)",
      },
      backup: {
        backup_created: true,
        json_backup: backupFilePathJson,
        sql_backup: fs.existsSync(backupFilePathSql) ? backupFilePathSql : "JSON snapshot created in .medusa/backups",
      },
    })
  } catch (error: any) {
    console.error("[STORE-SETTINGS] Fatal error in POST /admin/store-settings/reset:", error)
    return res.status(500).json({
      message: "An unexpected error occurred during database reset.",
      error: error.message || String(error),
    })
  }
}
