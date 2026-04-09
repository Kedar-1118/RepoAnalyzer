/*
  # Add User Tech Stack Column

  ## Overview
  This migration adds a column to store user's custom tech stack data
  alongside the GitHub-detected technologies in profile_data.

  ## Changes
  - Add `user_techstack` column to users table
  - Stores user-added technologies with proficiency levels and categories
  
  ## Structure
  {
    customTech: [
      {
        name: string,           // Technology name (e.g., "React", "Docker")
        proficiency: string,    // "Beginner", "Intermediate", "Advanced", "Expert"
        category: string        // "Language", "Framework", "Tool", "Database", etc.
      }
    ]
  }
*/

-- Add user_techstack column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_techstack jsonb DEFAULT '{"customTech": []}'::jsonb;

-- Add index for faster tech stack queries
CREATE INDEX IF NOT EXISTS idx_users_techstack ON users USING gin(user_techstack);

-- Add comment to document the column
COMMENT ON COLUMN users.user_techstack IS 'User-added custom technologies with proficiency levels and categories';
