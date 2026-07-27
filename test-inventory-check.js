const { Client } = require('pg')

async function checkInventory() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    
    console.log('=== Product Shipping Profiles ===')
    const prodProfiles = await client.query(`
      SELECT p.id, p.title, p.handle, 
             sl.product_id, sl.shipping_profile_id, 
             sp.name as profile_name
      FROM product p
      LEFT JOIN product_shipping_profile sl ON p.id = sl.product_id
      LEFT JOIN shipping_profile sp ON sl.shipping_profile_id = sp.id
      WHERE p.status = 'published'
    `)
    console.log(prodProfiles.rows)
    
    console.log('\n=== Product Variants Inventory ===')
    const inventory = await client.query(`
      SELECT pv.id, pv.title, pv.sku, pv.product_id,
             ii.sku as inventory_sku
      FROM product_variant pv
      LEFT JOIN inventory_item ii ON pv.id = ii.variant_id
      WHERE pv.product_id IN (
        SELECT id FROM product WHERE status = 'published'
      )
      LIMIT 5
    `)
    console.log(inventory.rows)
    
    console.log('\n=== Inventory Levels ===')
    const levels = await client.query(`
      SELECT il.id, il.stocked_quantity, il.location_id, 
             sl.name as location_name,
             il.inventory_item_id
      FROM inventory_level il
      LEFT JOIN stock_location sl ON il.location_id = sl.id
      LIMIT 10
    `)
    console.log(levels.rows)
    
  } finally {
    await client.end()
  }
}

checkInventory().catch(console.error)
