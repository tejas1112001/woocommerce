import { Client } from 'pg'

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database')

    const res = await client.query(`
      SELECT *
      FROM provider_identity
      WHERE entity_id = 'vivek@gmail.com'
    `)

    console.log('Provider identity for Vivek:')
    console.log(JSON.stringify(res.rows, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
