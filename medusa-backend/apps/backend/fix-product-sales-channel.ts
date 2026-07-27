import { Client } from 'pg'

async function fixProductSalesChannel() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    const productId = 'prod_01KX35C55WSZREQSYXK5W07DBG'
    const defaultChannelId = 'sc_01KX33P68Q515H14TDZZD2THQG' // Default Sales Channel

    // Check current links
    console.log('Current product-sales channel links:')
    const current = await client.query(
      'SELECT * FROM product_sales_channel WHERE product_id = $1',
      [productId]
    )
    console.log(current.rows)

    // Check if already linked to default channel
    const existing = await client.query(
      'SELECT * FROM product_sales_channel WHERE product_id = $1 AND sales_channel_id = $2',
      [productId, defaultChannelId]
    )

    if (existing.rows.length > 0) {
      console.log('\n✅ Product already linked to Default Sales Channel')
      if (existing.rows[0].deleted_at) {
        console.log('Restoring link...')
        await client.query(
          'UPDATE product_sales_channel SET deleted_at = NULL, updated_at = NOW() WHERE product_id = $1 AND sales_channel_id = $2',
          [productId, defaultChannelId]
        )
        console.log('✅ Link restored!')
      }
    } else {
      console.log('\n➕ Adding product to Default Sales Channel...')
      await client.query(
        `INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [productId, defaultChannelId]
      )
      console.log('✅ Link created!')
    }

    // Verify
    console.log('\n=== VERIFICATION ===')
    const verify = await client.query(`
      SELECT psc.product_id, p.title, psc.sales_channel_id, sc.name as channel_name, psc.deleted_at
      FROM product_sales_channel psc
      JOIN product p ON psc.product_id = p.id
      JOIN sales_channel sc ON psc.sales_channel_id = sc.id
      WHERE psc.product_id = $1 AND psc.deleted_at IS NULL
    `, [productId])
    console.log(verify.rows)

    console.log('\n✅ Done! Product should now be visible on frontend.')
    console.log('Refresh your frontend to see the product.')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

fixProductSalesChannel()
