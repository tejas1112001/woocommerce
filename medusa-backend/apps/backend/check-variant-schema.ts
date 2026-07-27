import { Client } from 'pg';

async function checkSchema() {
  const client = new Client({
    connectionString: 'postgres://postgres:tejas@localhost/medusa-medusa-backend',
  });

  try {
    await client.connect();
    
    console.log('\n=== PRODUCT_VARIANT TABLE SCHEMA ===\n');
    const schema = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'product_variant'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    schema.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n\n=== T-SHIRT VARIANTS ===\n');
    const variants = await client.query(`
      SELECT *
      FROM product_variant
      WHERE product_id = (
        SELECT id FROM product WHERE title = 'T-Shirt''s' AND deleted_at IS NULL
      )
      AND deleted_at IS NULL
      LIMIT 1
    `);

    if (variants.rows.length > 0) {
      console.log('Sample variant data:');
      console.log(JSON.stringify(variants.rows[0], null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkSchema();
