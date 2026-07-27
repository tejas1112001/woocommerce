import { Client } from 'pg'

async function run() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // Find the shipping and billing address IDs for the order
    const addressRes = await client.query(`
      SELECT shipping_address_id, billing_address_id
      FROM "order"
      WHERE id = 'order_01KXD3XDD9P5CMVNKBVSWXH4H5'
    `)

    if (addressRes.rows.length === 0) {
      console.log('Order not found!')
      return
    }

    const { shipping_address_id, billing_address_id } = addressRes.rows[0]
    console.log('Found address IDs:', { shipping_address_id, billing_address_id })

    // Update order customer_id and email
    const updateOrderRes = await client.query(`
      UPDATE "order"
      SET customer_id = 'cus_01KXD3SM5Q0YV104A19C01CQG4',
          email = 'vivek@gmail.com'
      WHERE id = 'order_01KXD3XDD9P5CMVNKBVSWXH4H5'
    `)
    console.log('Updated order table rows:', updateOrderRes.rowCount)

    // Update order_address for shipping address
    if (shipping_address_id) {
      const updateShippingRes = await client.query(`
        UPDATE order_address
        SET first_name = 'Vivek',
            last_name = 'Jadhav',
            phone = '9878787676'
        WHERE id = $1
      `, [shipping_address_id])
      console.log('Updated shipping address rows:', updateShippingRes.rowCount)
    }

    // Update order_address for billing address
    if (billing_address_id) {
      const updateBillingRes = await client.query(`
        UPDATE order_address
        SET first_name = 'Vivek',
            last_name = 'Jadhav',
            phone = '9878787676'
        WHERE id = $1
      `, [billing_address_id])
      console.log('Updated billing address rows:', updateBillingRes.rowCount)
    }

    console.log('\nOrder correction complete!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.end()
  }
}

run()
