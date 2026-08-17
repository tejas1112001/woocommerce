import { Client } from 'pg'
import crypto from 'crypto'

// Scrypt hashing helper matching Medusa v2 format
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 })
  const buffer = Buffer.alloc(1 + salt.length + key.length)
  buffer.writeUInt8(salt.length, 0)
  salt.copy(buffer, 1)
  key.copy(buffer, 1 + salt.length)
  return buffer.toString('base64')
}

async function run() {
  const emails = ['admin@test.com']
  const passwordsToSet = ['Admin@123', 'Adamin@123']

  console.log('Resetting admin password...')

  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })
  await client.connect()

  const hash = hashPassword('Admin@123')
  const hash2 = hashPassword('Adamin@123')

  // Update provider_identity for admin@test.com
  await client.query(`
    UPDATE provider_identity
    SET provider_metadata = jsonb_build_object('password', $1::text)
    WHERE entity_id = 'admin@test.com';
  `, [hash])

  console.log('Successfully set password for admin@test.com to Admin@123!')

  await client.end()
}

run().catch(console.error)
