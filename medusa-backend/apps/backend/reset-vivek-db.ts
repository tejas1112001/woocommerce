import { Client } from 'pg'
import scrypt from 'scrypt-kdf'

async function run() {
  const email = 'vivek@gmail.com'
  const newPassword = 'Password123!'

  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Generate hash
    console.log(`Hashing password "${newPassword}"...`)
    const hashConfig = { logN: 15, r: 8, p: 1 }
    const passwordHashBuffer = await scrypt.kdf(newPassword, hashConfig)
    const base64Hash = passwordHashBuffer.toString('base64')
    console.log(`Hash generated: ${base64Hash}`)

    // Update DB
    const providerMetadata = { password: base64Hash }
    const updateRes = await client.query(`
      UPDATE provider_identity
      SET provider_metadata = $1, updated_at = NOW()
      WHERE entity_id = $2 AND provider = 'emailpass'
      RETURNING *
    `, [JSON.stringify(providerMetadata), email])

    if (updateRes.rowCount > 0) {
      console.log('Successfully updated provider_identity:')
      console.log(JSON.stringify(updateRes.rows[0], null, 2))
    } else {
      console.log('No rows updated!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
