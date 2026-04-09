-- Migration: Create recommended_issues table
-- Description: Stores cached issue recommendations for users
-- Created: 2025-12-06

-- Create recommended_issues table
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

-- Create indexes for performance
CREATE INDEX idx_recommended_issues_user_id ON recommended_issues(user_id);
CREATE INDEX idx_recommended_issues_expires_at ON recommended_issues(expires_at);
CREATE INDEX idx_recommended_issues_match_score ON recommended_issues(match_score DESC);
CREATE INDEX idx_recommended_issues_repo ON recommended_issues(repo_full_name);

-- Create composite index for common queries
CREATE INDEX idx_recommended_issues_user_expires ON recommended_issues(user_id, expires_at);

-- Add comment
COMMENT ON TABLE recommended_issues IS 'Stores cached issue recommendations for users with expiration';
