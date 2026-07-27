import { Client } from 'pg'

async function switchApiKeyToWebStore() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    const apiKeyId = 'apk_01KX33P6B145X1TNK9Y9RZF8AR'
    const defaultChannelId = 'sc_01KX33P68Q515H14TDZZD2THQG' // Default Sales Channel (OLD)
    const webStoreChannelId = 'sc_01KX34XXRDJV4D4EJYQJ2F0MNZ' // Web Store (NEW)

    // Check current links
    console.log('Current API key-sales channel links:')
    const current = await client.query(
      'SELECT * FROM publishable_api_key_sales_channel WHERE publishable_key_id = $1',
      [apiKeyId]
    )
    console.log(current.rows)

    // Remove link to Default Sales Channel
    console.log('\n➖ Removing link to Default Sales Channel...')
    await client.query(
      'UPDATE publishable_api_key_sales_channel SET deleted_at = NOW() WHERE publishable_key_id = $1 AND sales_channel_id = $2',
      [apiKeyId, defaultChannelId]
    )
    console.log('✅ Removed!')

    // Check if Web Store link already exists
    const existing = await client.query(
      'SELECT * FROM publishable_api_key_sales_channel WHERE publishable_key_id = $1 AND sales_channel_id = $2',
      [apiKeyId, webStoreChannelId]
    )

    if (existing.rows.length > 0) {
      console.log('\n✅ Link to Web Store already exists')
      if (existing.rows[0].deleted_at) {
        console.log('Restoring link...')
        await client.query(
          'UPDATE publishable_api_key_sales_channel SET deleted_at = NULL, updated_at = NOW() WHERE publishable_key_id = $1 AND sales_channel_id = $2',
          [apiKeyId, webStoreChannelId]
        )
        console.log('✅ Link restored!')
      }
    } else {
      console.log('\n➕ Adding link to Web Store...')
      await client.query(
        `INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [apiKeyId, webStoreChannelId]
      )
      console.log('✅ Link created!')
    }

    // Verify
    console.log('\n=== VERIFICATION ===')
    const verify = await client.query(`
      SELECT paksc.publishable_key_id, ak.token, paksc.sales_channel_id, sc.name as channel_name, paksc.deleted_at
      FROM publishable_api_key_sales_channel paksc
      JOIN api_key ak ON paksc.publishable_key_id = ak.id
      JOIN sales_channel sc ON paksc.sales_channel_id = sc.id
      WHERE paksc.publishable_key_id = $1 AND paksc.deleted_at IS NULL
    `, [apiKeyId])
    console.log(verify.rows)

    // Also remove the product from Default Sales Channel
    console.log('\n➖ Removing product from Default Sales Channel...')
    await client.query(
      'UPDATE product_sales_channel SET deleted_at = NOW() WHERE product_id = $1 AND sales_channel_id = $2',
      ['prod_01KX35C55WSZREQSYXK5W07DBG', defaultChannelId]
    )
    console.log('✅ Removed!')

    console.log('\n✅ Done! Your API key now points to Web Store.')
    console.log('Products in Web Store will now be visible on frontend.')
    console.log('\nRefresh your frontend to see the changes.')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

switchApiKeyToWebStore()
