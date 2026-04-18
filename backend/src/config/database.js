const dns = require('dns');
const { Pool } = require('pg');

// Force Node.js to use IPv6 when IPv4 is unavailable (Supabase free-tier issue)
dns.setDefaultResultOrder('verbatim');

const connectionString = process.env.supabase_URL || process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('Missing database connection string (supabase_URL required)');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
