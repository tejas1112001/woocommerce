/**
 * Simple script to retrieve the publishable API key from the database
 * Run with: node get-publishable-key.js
 */

const { Client } = require('pg')

async function getPublishableKey() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('📡 Connected to database\n')

    // Get all publishable API keys with their linked sales channels
    const result = await client.query(`
      SELECT 
        ak.id,
        ak.token,
        ak.title,
        ak.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'sales_channel_id', sc.id,
              'sales_channel_name', sc.name
            )
          ) FILTER (WHERE sc.id IS NOT NULL),
          '[]'
        ) as sales_channels
      FROM api_key ak
      LEFT JOIN publishable_api_key_sales_channel paksc 
        ON ak.id = paksc.publishable_key_id AND paksc.deleted_at IS NULL
      LEFT JOIN sales_channel sc 
        ON paksc.sales_channel_id = sc.id AND sc.deleted_at IS NULL
      WHERE ak.type = 'publishable' 
        AND ak.deleted_at IS NULL
      GROUP BY ak.id, ak.token, ak.title, ak.created_at
      ORDER BY ak.created_at DESC
    `)

    if (result.rows.length === 0) {
      console.log('⚠️  No publishable API keys found in database!')
      console.log('\nThis usually means:')
      console.log('  1. You need to run the seed migration: npx medusa db:migrate')
      console.log('  2. Or create a key in Medusa Admin: http://localhost:9000/app')
      return
    }

    console.log('✅ Found Publishable API Keys:\n')
    console.log('='.repeat(80))

    result.rows.forEach((row, index) => {
      console.log(`\n${index + 1}. ${row.title}`)
      console.log(`   ID: ${row.id}`)
      console.log(`   Token: ${row.token}`)
      console.log(`   Created: ${new Date(row.created_at).toLocaleString()}`)
      
      const channels = JSON.parse(JSON.stringify(row.sales_channels))
      if (channels.length > 0 && channels[0].sales_channel_id) {
        console.log(`   Linked Sales Channels:`)
        channels.forEach(ch => {
          console.log(`     - ${ch.sales_channel_name} (${ch.sales_channel_id})`)
        })
      } else {
        console.log(`   ⚠️  NOT linked to any sales channel!`)
      }
    })

    console.log('\n' + '='.repeat(80))
    console.log('\n📋 Update your .env.local file with:')
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${result.rows[0].token}`)
    console.log('='.repeat(80))

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('\nMake sure:')
    console.error('  1. PostgreSQL is running')
    console.error('  2. Database exists: medusa-medusa-backend')
    console.error('  3. Connection details are correct')
  } finally {
    await client.end()
  }
}

getPublishableKey()
