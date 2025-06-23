-- Quick Fix Script for 401 Unauthorized Error
-- Run these commands step by step in your Supabase SQL Editor

-- STEP 1: Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 2: Create the songs table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS songs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) DEFAULT 'Unknown Artist',
    duration INTEGER DEFAULT 0,
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 3: Enable RLS on songs table
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- STEP 4: Drop existing policies (if any) and recreate them
DROP POLICY IF EXISTS "Enable read access for all users" ON songs;
DROP POLICY IF EXISTS "Enable insert for all users" ON songs;
DROP POLICY IF EXISTS "Enable update for all users" ON songs;
DROP POLICY IF EXISTS "Enable delete for all users" ON songs;

-- STEP 5: Create permissive RLS policies for public access
CREATE POLICY "Enable read access for all users" ON songs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON songs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON songs
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON songs
    FOR DELETE USING (true);

-- STEP 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);

-- STEP 7: Test the setup
INSERT INTO songs (title, artist, file_path, file_size) 
VALUES ('Test Song', 'Test Artist', 'test/path.mp3', 1000000)
ON CONFLICT (file_path) DO NOTHING;

-- STEP 8: Verify everything works
SELECT 'SUCCESS: Tables created and policies applied!' as message;
SELECT COUNT(*) as total_songs FROM songs;

-- Note: You still need to create the 'music-files' storage bucket manually in the Supabase Dashboard
