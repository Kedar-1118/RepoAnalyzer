/*
  # Create Open Source Matchmaker Platform Tables

  ## Overview
  This migration creates the core tables for the Open Source Matchmaker Platform,
  including user profiles, repository recommendations, and saved repositories.

  ## New Tables

  ### 1. `users`
  Stores user profile and GitHub integration data
  - `id` (uuid, primary key) - Unique user identifier
  - `github_id` (text, unique) - GitHub user ID
  - `github_username` (text) - GitHub username
  - `github_email` (text) - User's GitHub email
  - `github_access_token` (text) - Encrypted GitHub access token
  - `avatar_url` (text) - User's avatar URL
  - `profile_data` (jsonb) - Analyzed profile data (tech stack, skills, etc.)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `saved_repositories`
  Stores user-saved repositories for tracking
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid, foreign key) - References users table
  - `repo_full_name` (text) - Repository full name (owner/repo)
  - `repo_data` (jsonb) - Repository metadata (stars, language, etc.)
  - `match_score` (integer) - Calculated match score when saved
  - `notes` (text) - User's personal notes about the repo
  - `created_at` (timestamptz) - When repository was saved

  ### 3. `user_recommendations`
  Caches repository recommendations for users
  - `id` (uuid, primary key) - Unique record identifier
  - `user_id` (uuid, foreign key) - References users table
  - `repo_full_name` (text) - Repository full name
  - `match_score` (integer) - Calculated match score
  - `recommendation_data` (jsonb) - Detailed scoring breakdown
  - `created_at` (timestamptz) - When recommendation was generated
  - `expires_at` (timestamptz) - Cache expiration timestamp

  ## Security
  - Enable Row Level Security on all tables
  - Users can only access their own data
  - Authentication required for all operations

  ## Indexes
  - Index on github_id for fast user lookups
  - Index on user_id for saved repos and recommendations
  - Index on match_score for sorting recommendations
*/

-- Create users table
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

-- Create saved_repositories table
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

-- Create user_recommendations table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
CREATE INDEX IF NOT EXISTS idx_saved_repos_user_id ON saved_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_repos_match_score ON saved_repositories(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_match_score ON user_recommendations(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires_at ON user_recommendations(expires_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (github_id = current_setting('request.jwt.claims', true)::json->>'github_id');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (github_id = current_setting('request.jwt.claims', true)::json->>'github_id')
  WITH CHECK (github_id = current_setting('request.jwt.claims', true)::json->>'github_id');

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (github_id = current_setting('request.jwt.claims', true)::json->>'github_id');

-- RLS Policies for saved_repositories table
CREATE POLICY "Users can view own saved repos"
  ON saved_repositories FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

CREATE POLICY "Users can insert own saved repos"
  ON saved_repositories FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

CREATE POLICY "Users can delete own saved repos"
  ON saved_repositories FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

CREATE POLICY "Users can update own saved repos"
  ON saved_repositories FOR UPDATE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

-- RLS Policies for user_recommendations table
CREATE POLICY "Users can view own recommendations"
  ON user_recommendations FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

CREATE POLICY "Users can insert own recommendations"
  ON user_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );

CREATE POLICY "Users can delete own recommendations"
  ON user_recommendations FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users 
      WHERE github_id = current_setting('request.jwt.claims', true)::json->>'github_id'
    )
  );
