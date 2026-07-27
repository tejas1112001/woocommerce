import { Client } from 'pg'

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    const res = await client.query(`
      SELECT id, display_id, status, updated_at
      FROM "order"
      WHERE display_id IN (5, 7)
      ORDER BY display_id ASC
    `)
    console.table(res.rows)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
