import { Client } from 'pg'

async function checkSalesChannels() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    
    console.log('=== Sales Channels ===')
    const channels = await client.query('SELECT id, name FROM sales_channel')
    console.log(channels.rows)
    
    console.log('\n=== Publishable API Keys ===')
    const keys = await client.query('SELECT id, token FROM api_key WHERE type = \'publishable\'')
    console.log(keys.rows)
    
    console.log('\n=== Products ===')
    const products = await client.query('SELECT id, title, handle, status FROM product')
    console.log(products.rows)
    
    console.log('\n=== Product Sales Channel Links ===')
    const links = await client.query('SELECT * FROM product_sales_channel')
    console.log(links.rows)
    
    console.log('\n=== API Key Sales Channel Links ===')
    const apiLinks = await client.query('SELECT * FROM publishable_api_key_sales_channel')
    console.log(apiLinks.rows)
    
  } finally {
    await client.end()
  }
}

checkSalesChannels().catch(console.error)
