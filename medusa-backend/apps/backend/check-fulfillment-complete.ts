import { Client } from 'pg'

async function checkFulfillmentComplete() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    console.log('=== FULFILLMENT SETS ===\n')
    const fulfillmentSets = await client.query(`
      SELECT id, name, type, deleted_at
      FROM fulfillment_set
    `)
    console.log(fulfillmentSets.rows)

    console.log('\n=== SERVICE ZONES ===\n')
    const serviceZones = await client.query(`
      SELECT id, name, fulfillment_set_id, deleted_at
      FROM service_zone
    `)
    console.log(serviceZones.rows)

    console.log('\n=== STOCK LOCATION LINKS TO SERVICE ZONES ===\n')
    const stockLinks = await client.query(`
      SELECT 
        slsz.stock_location_id,
        sl.name as location_name,
        slsz.service_zone_id,
        sz.name as zone_name,
        slsz.deleted_at
      FROM stock_location_service_zone slsz
      JOIN stock_location sl ON slsz.stock_location_id = sl.id
      JOIN service_zone sz ON slsz.service_zone_id = sz.id
    `)
    console.log(stockLinks.rows)

    console.log('\n=== SALES CHANNEL LINKS TO STOCK LOCATIONS ===\n')
    
    // Check if sales_channel_stock_location table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sales_channel_stock_location'
      )
    `)
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  sales_channel_stock_location table does not exist')
      console.log('This is normal for some Medusa v2 versions.')
      console.log('Inventory availability should work without this table.\n')
      return
    }

    const salesChannelLinks = await client.query(`
      SELECT 
        scsl.sales_channel_id,
        sc.name as channel_name,
        scsl.stock_location_id,
        sl.name as location_name,
        scsl.deleted_at
      FROM sales_channel_stock_location scsl
      JOIN sales_channel sc ON scsl.sales_channel_id = sc.id
      JOIN stock_location sl ON scsl.stock_location_id = sl.id
    `)
    
    if (salesChannelLinks.rows.length === 0) {
      console.log('❌ NO sales channel to stock location links found!')
      console.log('\nThis is the problem! Sales channels must be linked to stock locations.')
      console.log('Let me create the missing links...\n')

      // Get all active sales channels and stock locations
      const channels = await client.query(`
        SELECT id, name FROM sales_channel WHERE deleted_at IS NULL AND is_disabled = false
      `)
      const locations = await client.query(`
        SELECT id, name FROM stock_location WHERE deleted_at IS NULL
      `)

      console.log('Active Sales Channels:')
      channels.rows.forEach(ch => console.log(`  - ${ch.name} (${ch.id})`))
      
      console.log('\nActive Stock Locations:')
      locations.rows.forEach(loc => console.log(`  - ${loc.name} (${loc.id})`))

      // Link each sales channel to each stock location
      for (const channel of channels.rows) {
        for (const location of locations.rows) {
          await client.query(`
            INSERT INTO sales_channel_stock_location (id, sales_channel_id, stock_location_id, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
            ON CONFLICT DO NOTHING
          `, [channel.id, location.id])
          
          console.log(`\n✅ Linked "${channel.name}" to "${location.name}"`)
        }
      }

      // Verify the links
      const newLinks = await client.query(`
        SELECT 
          scsl.sales_channel_id,
          sc.name as channel_name,
          scsl.stock_location_id,
          sl.name as location_name
        FROM sales_channel_stock_location scsl
        JOIN sales_channel sc ON scsl.sales_channel_id = sc.id
        JOIN stock_location sl ON scsl.stock_location_id = sl.id
        WHERE scsl.deleted_at IS NULL
      `)

      console.log('\n✅ VERIFICATION - Sales Channel Links:')
      newLinks.rows.forEach(link => {
        console.log(`  "${link.channel_name}" → "${link.location_name}"`)
      })

    } else {
      console.log(salesChannelLinks.rows)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

checkFulfillmentComplete()
