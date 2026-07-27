const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend' });
client.connect().then(async () => {
  try {
    const res = await client.query('SELECT * FROM order_line_item LIMIT 1;');
    console.log('Order Line Item:', res.rows[0]);
  } finally {
    client.end();
  }
});
