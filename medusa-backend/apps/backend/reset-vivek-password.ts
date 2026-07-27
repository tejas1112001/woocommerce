import { Client } from 'pg'

// Bypass any environment proxies for local network fetches
process.env.NO_PROXY = '127.0.0.1,localhost,::1'
process.env.no_proxy = '127.0.0.1,localhost,::1'

async function run() {
  const email = 'vivek@gmail.com'
  const newPassword = 'Password123!'

  console.log(`Initiating password reset for ${email}...`)

  try {
    // 1. Send reset request (using 127.0.0.1)
    const initRes = await fetch('http://127.0.0.1:9000/auth/customer/emailpass/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
      }),
    })

    console.log('Reset request response status:', initRes.status)

    // Wait 2 seconds for Medusa to process and insert notification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 2. Query database for notification token
    const client = new Client({
      connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
    })
    await client.connect()
    console.log('Connected to database to check notifications...')

    const notificationRes = await client.query(`
      SELECT id, "to", data, created_at
      FROM notification
      WHERE "to" = $1 OR "to" LIKE $2
      ORDER BY created_at DESC
      LIMIT 1
    `, [email, `%${email}%`])

    if (notificationRes.rows.length === 0) {
      console.log('No reset notifications found for Vivek! Let us list all notifications to see if there is one.')
      const allNotif = await client.query(`
        SELECT id, "to", template, data, created_at
        FROM notification
        ORDER BY created_at DESC
        LIMIT 5
      `)
      console.table(allNotif.rows)
      await client.end()
      return
    }

    const notif = notificationRes.rows[0]
    console.log('Found notification:', notif.id, 'created at:', notif.created_at)
    console.log('Notification data:', JSON.stringify(notif.data))

    const token = notif.data?.token
    if (!token) {
      console.log('Token not found in notification data!')
      await client.end()
      return
    }

    await client.end()

    // 3. Update password using the token
    console.log(`Updating password with token: ${token}...`)
    const updateRes = await fetch(`http://127.0.0.1:9000/auth/customer/emailpass/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: newPassword,
      }),
    })

    console.log('Update password response status:', updateRes.status)
    const updateBody = await updateRes.text()
    console.log('Update password response body:', updateBody)

    if (updateRes.ok) {
      console.log(`\nSUCCESS: Password for ${email} has been reset to "${newPassword}"`)
    } else {
      console.log('\nFAILED to update password')
    }

  } catch (error) {
    console.error('Error during password reset:', error)
  }
}

run()
