import { Client } from 'pg'

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Updating admin@test.com password to Password123! ...\n')

    const hash = 'c2NyeXB0AA8AAAAIAAAAAcDV4u9Qd37CrUWPT/2IEVd85ebbmXd+l59huSLLgrkvZYR/UKz6TsGy6pcvPEZmUk2i6f6Bj8fDCDfGHGIVG816InL658eMXchwHEv/xFwB'

    await client.query(`
      UPDATE provider_identity
      SET provider_metadata = jsonb_build_object('password', $1::text)
      WHERE entity_id = 'admin@test.com';
    `, [hash])

    console.log('Successfully set admin@test.com password to Password123!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
