import { Client } from 'pg'

async function fixTestProductChannel() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // 1. Get the product ID
    const product = await client.query(`
      SELECT id, title, handle, status
      FROM product
      WHERE handle = 'test-product' AND deleted_at IS NULL
    `)

    if (product.rows.length === 0) {
      console.log('❌ Product not found!')
      return
    }

    console.log('✅ Found product:', product.rows[0])
    const productId = product.rows[0].id

    // 2. Get active sales channels
    const channels = await client.query(`
      SELECT id, name, is_disabled, deleted_at
      FROM sales_channel
      WHERE deleted_at IS NULL AND is_disabled = false
    `)

    console.log('\n📋 Active sales channels:')
    channels.rows.forEach(ch => {
      console.log(`  - ${ch.name} (${ch.id})`)
    })

    // 3. Get the Web Store channel (the one in your .env)
    const webStoreChannel = channels.rows.find(ch => ch.name === 'Web Store')
    
    if (!webStoreChannel) {
      console.log('\n❌ Web Store channel not found!')
      return
    }

    console.log(`\n✅ Using Web Store channel: ${webStoreChannel.id}`)

    // 4. Check current product-channel links
    const currentLinks = await client.query(`
      SELECT sales_channel_id, deleted_at
      FROM product_sales_channel
      WHERE product_id = $1
    `, [productId])

    console.log('\n📋 Current product-channel links:')
    currentLinks.rows.forEach(link => {
      const status = link.deleted_at ? '❌ DELETED' : '✅ ACTIVE'
      console.log(`  - Channel ${link.sales_channel_id}: ${status}`)
    })

    // 5. Remove any soft-deleted links and add fresh link
    await client.query(`
      DELETE FROM product_sales_channel
      WHERE product_id = $1
    `, [productId])

    console.log('\n🧹 Cleaned up old links')

    // 6. Add fresh link to Web Store
    await client.query(`
      INSERT INTO product_sales_channel (id, product_id, sales_channel_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
    `, [productId, webStoreChannel.id])

    console.log('✅ Linked product to Web Store')

    // 7. Verify the fix
    const verification = await client.query(`
      SELECT 
        p.title,
        p.handle,
        p.status,
        sc.name as channel_name,
        psc.deleted_at
      FROM product p
      JOIN product_sales_channel psc ON p.id = psc.product_id
      JOIN sales_channel sc ON psc.sales_channel_id = sc.id
      WHERE p.id = $1
    `, [productId])

    console.log('\n✅ VERIFICATION:')
    console.log(verification.rows)

    console.log('\n🎉 Fix complete! Product should now be visible.')
    console.log('\nTest the URL: http://localhost:8000/in/products/test-product')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

fixTestProductChannel()
