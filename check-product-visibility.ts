import { Client } from 'pg'

async function checkProductVisibility() {
  const client = new Client({
    connectionString: 'postgresql://postgres:KingKohli18@localhost:5432/medusa_db_swami',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // 1. Check all products
    console.log('=== ALL PRODUCTS ===')
    const products = await client.query(`
      SELECT id, title, handle, status, deleted_at
      FROM product
      ORDER BY created_at DESC
      LIMIT 5
    `)
    console.log(products.rows)

    // 2. Check sales channels
    console.log('\n=== SALES CHANNELS ===')
    const channels = await client.query(`
      SELECT id, name, is_disabled, deleted_at
      FROM sales_channel
    `)
    console.log(channels.rows)

    // 3. Check publishable API key
    console.log('\n=== PUBLISHABLE API KEY ===')
    const apiKey = await client.query(`
      SELECT id, token, type
      FROM api_key
      WHERE type = 'publishable'
    `)
    console.log(apiKey.rows)

    // 4. Check product-sales channel links
    console.log('\n=== PRODUCT-SALES CHANNEL LINKS ===')
    const productLinks = await client.query(`
      SELECT psc.product_id, p.title, psc.sales_channel_id, sc.name as channel_name, psc.deleted_at
      FROM product_sales_channel psc
      JOIN product p ON psc.product_id = p.id
      JOIN sales_channel sc ON psc.sales_channel_id = sc.id
      ORDER BY psc.created_at DESC
      LIMIT 10
    `)
    console.log(productLinks.rows)

    // 5. Check API key-sales channel links
    console.log('\n=== API KEY-SALES CHANNEL LINKS ===')
    const apiLinks = await client.query(`
      SELECT paksc.publishable_key_id, ak.token, paksc.sales_channel_id, sc.name as channel_name, paksc.deleted_at
      FROM publishable_api_key_sales_channel paksc
      JOIN api_key ak ON paksc.publishable_key_id = ak.id
      JOIN sales_channel sc ON paksc.sales_channel_id = sc.id
    `)
    console.log(apiLinks.rows)

    // 6. Check if products are properly set up
    console.log('\n=== PRODUCT DETAILS (Latest Products) ===')
    const productDetails = await client.query(`
      SELECT 
        p.id,
        p.title,
        p.handle,
        p.status,
        p.deleted_at,
        COUNT(DISTINCT pv.id) as variant_count,
        COUNT(DISTINCT psc.sales_channel_id) as sales_channel_count
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.deleted_at IS NULL
      LEFT JOIN product_sales_channel psc ON p.id = psc.product_id AND psc.deleted_at IS NULL
      WHERE p.deleted_at IS NULL
      GROUP BY p.id, p.title, p.handle, p.status, p.deleted_at
      ORDER BY p.created_at DESC
      LIMIT 5
    `)
    console.log(productDetails.rows)

    // 7. Check inventory for latest products
    console.log('\n=== INVENTORY LEVELS (Latest Products) ===')
    const inventory = await client.query(`
      SELECT 
        p.title,
        pv.title as variant_title,
        pv.sku,
        ili.stocked_quantity,
        ili.reserved_quantity,
        ili.incoming_quantity,
        sl.name as location_name
      FROM product p
      JOIN product_variant pv ON p.id = pv.product_id
      JOIN inventory_item ii ON pv.inventory_item_id = ii.id
      JOIN inventory_level il ON ii.id = il.inventory_item_id
      JOIN inventory_level_inventory ili ON il.id = ili.id
      JOIN stock_location sl ON il.location_id = sl.id
      WHERE p.deleted_at IS NULL AND pv.deleted_at IS NULL
      ORDER BY p.created_at DESC
      LIMIT 10
    `)
    console.log(inventory.rows)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

checkProductVisibility()
