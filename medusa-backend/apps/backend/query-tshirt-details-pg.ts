import { Client } from 'pg'

async function queryTshirtDetails() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // 1. Get product details
    const productRes = await client.query(`
      SELECT id, title, handle, status, deleted_at
      FROM product
      WHERE handle = 't-shirt' AND deleted_at IS NULL
    `)

    if (productRes.rows.length === 0) {
      console.log('❌ Product with handle "t-shirt" NOT found!')
      return
    }

    const product = productRes.rows[0]
    console.log('=== PRODUCT ===')
    console.log(product)
    console.log()

    // 2. Get active sales channel links
    const scLinksRes = await client.query(`
      SELECT psc.sales_channel_id, sc.name as channel_name, psc.deleted_at
      FROM product_sales_channel psc
      JOIN sales_channel sc ON psc.sales_channel_id = sc.id
      WHERE psc.product_id = $1
    `, [product.id])
    console.log('=== SALES CHANNEL LINKS ===')
    console.log(scLinksRes.rows)
    console.log()

    // 3. Get variants
    const variantsRes = await client.query(`
      SELECT id, title, sku, manage_inventory, deleted_at
      FROM product_variant
      WHERE product_id = $1 AND deleted_at IS NULL
    `, [product.id])
    console.log('=== VARIANTS ===')
    console.log(variantsRes.rows)
    console.log()

    const variantIds = variantsRes.rows.map(v => v.id)

    if (variantIds.length > 0) {
      // Find tables containing price or pricing
      const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND (table_name LIKE '%price%' OR table_name LIKE '%pricing%')
        ORDER BY table_name
      `)
      console.log('=== PRICING TABLES ===')
      tablesRes.rows.forEach(r => console.log(` - ${r.table_name}`))
      console.log()

      // Let's check price table if it exists
      const hasPriceTable = tablesRes.rows.some(r => r.table_name === 'price')
      if (hasPriceTable) {
        // Let's see the column names of price table
        const colsRes = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'price'
        `)
        console.log('=== price TABLE COLUMNS ===')
        colsRes.rows.forEach(col => console.log(` - ${col.column_name}: ${col.data_type}`))
        console.log()

        // Check prices for our variants
        // In Medusa v2, price is linked to price_set which is linked to product_variant.
        // Let's see if there is product_variant_price or similar link tables
        const linkTables = tablesRes.rows.filter(r => r.table_name.includes('link') || r.table_name.includes('variant') || r.table_name.includes('set'))
        console.log('=== LINK TABLES ===')
        console.log(linkTables.map(t => t.table_name))
        console.log()

        // Let's check tables like price_set, product_variant_price_set etc.
        for (const tbl of tablesRes.rows.map(r => r.table_name)) {
          if (tbl.includes('variant') || tbl.includes('link') || tbl === 'price_set') {
            try {
              const sample = await client.query(`SELECT * FROM ${tbl} LIMIT 1`)
              console.log(`Sample from ${tbl}:`, sample.rows)
            } catch (e) {
              // ignore
            }
          }
        }

        // Let's run a query to get prices for variants
        // Usually, in medusa v2:
        // price_set is linked to the variant (or variant has a price_set_id / price_set column or variant-price_set link table)
        // Let's check columns of product_variant first
        const pvCols = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'product_variant'
        `)
        console.log('=== product_variant TABLE COLUMNS ===')
        pvCols.rows.forEach(col => console.log(` - ${col.column_name}: ${col.data_type}`))
        console.log()

        // Let's see if any link exists between product_variant and price_set or price.
        // Let's query information_schema.tables to find all tables
        const allTablesRes = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY table_name
        `)
        const allTables = allTablesRes.rows.map(r => r.table_name)
        console.log('=== ALL TABLES ===')
        console.log(allTables.filter(t => t.includes('price') || t.includes('variant') || t.includes('product') || t.includes('region')))
      }
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

queryTshirtDetails()
