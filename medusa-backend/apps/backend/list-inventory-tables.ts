import { Client } from 'pg'

async function listInventoryTables() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // List all tables related to inventory
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%inventory%'
      ORDER BY table_name
    `)

    console.log('=== INVENTORY-RELATED TABLES ===\n')
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`)
    })

    // Check inventory_level table structure
    console.log('\n\n=== inventory_level TABLE STRUCTURE ===\n')
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'inventory_level'
      ORDER BY ordinal_position
    `)

    columns.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(30)} ${col.data_type.padEnd(20)} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
    })

    // Check if there's a separate inventory level tracking
    console.log('\n\n=== CHECKING FOR INVENTORY_LEVEL_INVENTORY TABLE ===\n')
    const invLevelInv = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'inventory_level_inventory'
      )
    `)

    if (invLevelInv.rows[0].exists) {
      console.log('✅ inventory_level_inventory table EXISTS')
      
      const invLevelInvCols = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'inventory_level_inventory'
        ORDER BY ordinal_position
      `)
      
      console.log('\nColumns:')
      invLevelInvCols.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`)
      })

      // Check if we have data in this table
      const invLevelInvData = await client.query(`
        SELECT 
          ili.*,
          sl.name as location_name
        FROM inventory_level_inventory ili
        JOIN inventory_level il ON ili.id = il.id
        JOIN stock_location sl ON il.location_id = sl.id
        LIMIT 5
      `)

      console.log('\nSample data:')
      console.log(invLevelInvData.rows)
    } else {
      console.log('❌ inventory_level_inventory table DOES NOT EXIST')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

listInventoryTables()
