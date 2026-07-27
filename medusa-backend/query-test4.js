const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend' });
client.connect().then(async () => {
  try {
    const res = await client.query("SELECT id, title, thumbnail FROM product WHERE id = 'prod_01KXD2WENGDFZKMDC8R8NNMT2N';");
    console.log('Product:', res.rows[0]);
  } finally {
    client.end();
  }
});
