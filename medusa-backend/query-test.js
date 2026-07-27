const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend' });
client.connect().then(async () => {
  try {
    const res = await client.query('SELECT id, title, thumbnail FROM product LIMIT 5;');
    console.log('Products:', res.rows);
    
    const res2 = await client.query('SELECT id, thumbnail, product_title, variant_title FROM order_line_item LIMIT 5;');
    console.log('Order Line Items:', res2.rows);
  } finally {
    client.end();
  }
});
