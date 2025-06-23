-- Music Player Database Schema Setup
-- Run this script in your Supabase SQL Editor

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS playlist_songs CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS songs CASCADE;

-- Create the songs table
CREATE TABLE songs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) DEFAULT 'Unknown Artist',
    duration INTEGER DEFAULT 0, -- in seconds
    file_path TEXT NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON songs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON songs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON songs
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON songs
    FOR DELETE USING (true);

-- Create playlists table (for future use)
CREATE TABLE playlists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create playlist_songs junction table
CREATE TABLE playlist_songs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
    song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate songs in same playlist
CREATE UNIQUE INDEX idx_playlist_songs_unique ON playlist_songs(playlist_id, song_id);

-- Create index for ordering songs in playlist
CREATE INDEX idx_playlist_songs_position ON playlist_songs(playlist_id, position);

-- Enable RLS for playlists tables
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for playlists
CREATE POLICY "Enable read access for all users" ON playlists
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON playlists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON playlists
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON playlists
    FOR DELETE USING (true);

-- Create RLS policies for playlist_songs
CREATE POLICY "Enable read access for all users" ON playlist_songs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON playlist_songs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON playlist_songs
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON playlist_songs
    FOR DELETE USING (true);

-- Insert sample data (optional - remove if not needed)
INSERT INTO songs (title, artist, file_path, file_size) VALUES 
('Sample Song', 'Sample Artist', 'songs/sample.mp3', 1024000);

-- Verify the setup
SELECT 'Setup completed successfully!' as message;
SELECT COUNT(*) as song_count FROM songs;
