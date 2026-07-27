import { Client } from 'pg'

async function fixSalesChannelLinks() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    
    const apiKeyId = 'apk_01KT1G6K9PV1BDCDZ9W5RA9HY1'
    const correctSalesChannelId = 'sc_01KT1G6K98TKNY904G9Y1KMQEW'
    const wrongSalesChannelId = 'sc_01KT38RXPW3HR9PY08MCA3XWN1'
    
    console.log('Fixing sales channel links...')
    console.log(`API Key ID: ${apiKeyId}`)
    console.log(`Correct Sales Channel: ${correctSalesChannelId}`)
    
    // Delete the wrong link
    console.log('\n1. Deleting wrong sales channel link...')
    await client.query(
      'UPDATE publishable_api_key_sales_channel SET deleted_at = NOW() WHERE publishable_key_id = $1 AND sales_channel_id = $2',
      [apiKeyId, wrongSalesChannelId]
    )
    
    // Check if correct link exists
    const existing = await client.query(
      'SELECT * FROM publishable_api_key_sales_channel WHERE publishable_key_id = $1 AND sales_channel_id = $2',
      [apiKeyId, correctSalesChannelId]
    )
    
    if (existing.rows.length > 0) {
      console.log('2. Correct link already exists, restoring it...')
      await client.query(
        'UPDATE publishable_api_key_sales_channel SET deleted_at = NULL, updated_at = NOW() WHERE publishable_key_id = $1 AND sales_channel_id = $2',
        [apiKeyId, correctSalesChannelId]
      )
    } else {
      console.log('2. Creating new correct link...')
      await client.query(
        `INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at) 
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [apiKeyId, correctSalesChannelId]
      )
    }
    
    console.log('\n✅ Fixed! Verifying...')
    const result = await client.query(
      'SELECT * FROM publishable_api_key_sales_channel WHERE publishable_key_id = $1 AND deleted_at IS NULL',
      [apiKeyId]
    )
    console.log('Active links:', result.rows)
    
  } finally {
    await client.end()
  }
}

fixSalesChannelLinks().catch(console.error)
