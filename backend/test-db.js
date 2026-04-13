require('dotenv').config();
const pool = require('./src/config/database');

async function testConnection() {
  console.log('Testing connection to Supabase via PG connection string...');
  try {
    const { rows } = await pool.query('SELECT current_user, current_database()');
    console.log('Connection successful! Connected as:', rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed! Exception:', err);
    process.exit(1);
  }
}

testConnection();
