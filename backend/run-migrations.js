require('dotenv').config();
const pool = require('./src/config/database');

async function runMigrations() {
  console.log('Running database migrations...\n');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // === Migration 1: Core tables ===
    console.log('[1/4] Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        github_id text UNIQUE NOT NULL,
        github_username text NOT NULL,
        github_email text,
        github_access_token text NOT NULL,
        avatar_url text,
        profile_data jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `);

    console.log('[2/4] Creating saved_repositories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_repositories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        repo_full_name text NOT NULL,
        repo_data jsonb DEFAULT '{}'::jsonb,
        match_score integer DEFAULT 0,
        notes text DEFAULT '',
        created_at timestamptz DEFAULT now(),
        UNIQUE(user_id, repo_full_name)
      );
    `);

    console.log('[3/4] Creating user_recommendations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_recommendations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        repo_full_name text NOT NULL,
        match_score integer DEFAULT 0,
        recommendation_data jsonb DEFAULT '{}'::jsonb,
        created_at timestamptz DEFAULT now(),
        expires_at timestamptz DEFAULT (now() + interval '24 hours'),
        UNIQUE(user_id, repo_full_name)
      );
    `);

    // === Migration 2: Indexes ===
    console.log('[4/4] Creating indexes and additional columns...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
      CREATE INDEX IF NOT EXISTS idx_saved_repos_user_id ON saved_repositories(user_id);
      CREATE INDEX IF NOT EXISTS idx_saved_repos_match_score ON saved_repositories(match_score DESC);
      CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON user_recommendations(user_id);
      CREATE INDEX IF NOT EXISTS idx_recommendations_match_score ON user_recommendations(match_score DESC);
      CREATE INDEX IF NOT EXISTS idx_recommendations_expires_at ON user_recommendations(expires_at);
    `);

    // === Migration 3: recommended_issues table ===
    await client.query(`
      CREATE TABLE IF NOT EXISTS recommended_issues (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        issue_url TEXT NOT NULL,
        repo_full_name TEXT NOT NULL,
        match_score INTEGER NOT NULL DEFAULT 0,
        issue_data JSONB NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_recommended_issues_user_id ON recommended_issues(user_id);
      CREATE INDEX IF NOT EXISTS idx_recommended_issues_expires_at ON recommended_issues(expires_at);
      CREATE INDEX IF NOT EXISTS idx_recommended_issues_match_score ON recommended_issues(match_score DESC);
      CREATE INDEX IF NOT EXISTS idx_recommended_issues_repo ON recommended_issues(repo_full_name);
      CREATE INDEX IF NOT EXISTS idx_recommended_issues_user_expires ON recommended_issues(user_id, expires_at);
    `);

    // === Migration 4: user_techstack column ===
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS user_techstack jsonb DEFAULT '{"customTech": []}'::jsonb;
      CREATE INDEX IF NOT EXISTS idx_users_techstack ON users USING gin(user_techstack);
    `);

    // === Disable RLS (we connect as postgres directly, RLS would block us) ===
    await client.query(`
      ALTER TABLE users DISABLE ROW LEVEL SECURITY;
      ALTER TABLE saved_repositories DISABLE ROW LEVEL SECURITY;
      ALTER TABLE user_recommendations DISABLE ROW LEVEL SECURITY;
    `);

    await client.query('COMMIT');
    console.log('\n✅ All migrations completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(() => process.exit(1));
