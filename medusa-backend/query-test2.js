const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend' });
client.connect().then(async () => {
  try {
    const res = await client.query('SELECT id, region_id FROM "order" LIMIT 5;');
    console.log('Orders:', res.rows);
  } finally {
    client.end();
  }
});
