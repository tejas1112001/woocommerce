import { Client } from 'pg'

async function queryTshirtPrices() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    const productRes = await client.query(`
      SELECT id, title, handle, status, deleted_at
      FROM product
      WHERE handle = 't-shirt' AND deleted_at IS NULL
    `)

    if (productRes.rows.length === 0) {
      console.log('❌ Product with handle "t-shirt" NOT found!')
      return
    }

    const productId = productRes.rows[0].id

    // Query prices
    const pricesRes = await client.query(`
      SELECT 
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku,
        p.id as price_id,
        p.currency_code,
        p.amount,
        p.price_list_id,
        p.deleted_at as price_deleted_at,
        pvps.deleted_at as pvps_deleted_at
      FROM product_variant pv
      LEFT JOIN product_variant_price_set pvps ON pv.id = pvps.variant_id
      LEFT JOIN price_set ps ON pvps.price_set_id = ps.id
      LEFT JOIN price p ON ps.id = p.price_set_id
      WHERE pv.product_id = $1 AND pv.deleted_at IS NULL
    `, [productId])

    console.log('=== VARIANT PRICING ===')
    console.log(pricesRes.rows)
    console.log()

    // Query regions and countries
    const regionsRes = await client.query(`
      SELECT r.id, r.name, r.currency_code, rc.country_code
      FROM region r
      LEFT JOIN region_country rc ON r.id = rc.region_id
      WHERE r.deleted_at IS NULL
    `)
    console.log('=== REGIONS AND COUNTRIES ===')
    console.log(regionsRes.rows)
    console.log()

    // Query inventory link for each variant
    const inventoryRes = await client.query(`
      SELECT 
        pv.id as variant_id,
        pv.title as variant_title,
        pv.sku,
        pvii.inventory_item_id,
        pvii.required_quantity,
        pvii.deleted_at as link_deleted_at
      FROM product_variant pv
      LEFT JOIN product_variant_inventory_item pvii ON pv.id = pvii.variant_id
      WHERE pv.product_id = $1 AND pv.deleted_at IS NULL
    `, [productId])
    console.log('=== VARIANT INVENTORY LINKS ===')
    console.log(inventoryRes.rows)
    console.log()

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

queryTshirtPrices()
