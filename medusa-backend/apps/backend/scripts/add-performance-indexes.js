const { Client } = require('pg')

async function run() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required.")
  }

  const client = new Client({ connectionString })
  await client.connect()

  console.log('Creating idx_otp_email_verified_expires index...')
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_otp_email_verified_expires 
    ON public.otp_verification (email, verified, expires_at);
  `)
  console.log('Index created successfully!')

  await client.end()
}

run().catch((e) => {
  console.error('Migration failed:', e)
  process.exit(1)
})
