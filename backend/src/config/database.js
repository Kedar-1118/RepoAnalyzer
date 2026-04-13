const { Pool } = require('pg');

const connectionString = process.env.supabase_URL || process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('Missing database connection string (supabase_URL required)');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
