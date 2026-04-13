-- Migration: Create tables for bulk analysis and candidate features
-- Run this against your PostgreSQL database

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  total_profiles INT DEFAULT 0,
  processed_profiles INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS batch_candidates (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES batches(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  name TEXT,
  location TEXT,
  bio TEXT,
  match_score FLOAT DEFAULT 0,
  match_tier TEXT,
  primary_stack TEXT[],
  code_velocity TEXT,
  review_impact FLOAT,
  mentorship_level TEXT,
  stability_score FLOAT,
  ai_sentiment TEXT,
  top_repos JSONB DEFAULT '[]',
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_batches_user_id ON batches(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_candidates_batch_id ON batch_candidates(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_candidates_match_score ON batch_candidates(match_score DESC);
