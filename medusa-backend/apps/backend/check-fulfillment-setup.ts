import { Client } from 'pg'

async function checkFulfillmentSetup() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    
    console.log('=== Shipping Profiles ===')
    const profiles = await client.query('SELECT id, name, type FROM shipping_profile')
    console.log(profiles.rows)
    
    console.log('\n=== Stock Locations ===')
    const locations = await client.query('SELECT id, name FROM stock_location')
    console.log(locations.rows)
    
    console.log('\n=== Fulfillment Sets ===')
    const sets = await client.query('SELECT id, name, type FROM fulfillment_set')
    console.log(sets.rows)
    
    console.log('\n=== Service Zones ===')
    const zones = await client.query('SELECT id, name, fulfillment_set_id FROM service_zone')
    console.log(zones.rows)
    
    console.log('\n=== Geo Zones ===')
    const geoZones = await client.query('SELECT id, type, country_code, service_zone_id FROM geo_zone')
    console.log(geoZones.rows)
    
    console.log('\n=== Shipping Options ===')
    const options = await client.query(`
      SELECT so.id, so.name, so.provider_id, so.service_zone_id, so.shipping_profile_id, 
             so.price_type, so.data
      FROM shipping_option so
    `)
    console.log(options.rows)
    
    console.log('\n=== Shipping Option Prices ===')
    const prices = await client.query(`
      SELECT sp.id, sp.amount, sp.currency_code, sp.shipping_option_id
      FROM shipping_option_price sp
    `)
    console.log(prices.rows)
    
    console.log('\n=== Shipping Option Rules ===')
    const rules = await client.query(`
      SELECT sr.id, sr.attribute, sr.operator, sr.value, sr.shipping_option_id
      FROM shipping_option_rule sr
    `)
    console.log(rules.rows)
    
  } finally {
    await client.end()
  }
}

checkFulfillmentSetup().catch(console.error)
