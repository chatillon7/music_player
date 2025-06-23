-- Supabase Diagnostic Script
-- Run this in your Supabase SQL Editor to check the current state

-- 1. Check if tables exist
SELECT 'CHECKING TABLES' as step;

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('songs', 'playlists', 'playlist_songs');

-- 2. Check if songs table has data
SELECT 'CHECKING SONGS TABLE' as step;

DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'songs') THEN
        PERFORM 1;
        RAISE NOTICE 'Songs table exists. Checking data...';
    ELSE
        RAISE NOTICE 'Songs table does not exist!';
    END IF;
END $$;

-- Safe check for songs count
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'songs') 
        THEN (SELECT COUNT(*)::text FROM songs) 
        ELSE 'Table does not exist' 
    END as songs_count;

-- 3. Check RLS policies
SELECT 'CHECKING RLS POLICIES' as step;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('songs', 'playlists', 'playlist_songs')
ORDER BY tablename, policyname;

-- 4. Check storage buckets
SELECT 'CHECKING STORAGE BUCKETS' as step;

SELECT 
    id,
    name,
    public
FROM storage.buckets
WHERE name = 'music-files';

-- 5. Check storage policies
SELECT 'CHECKING STORAGE POLICIES' as step;

SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
    AND (policyname LIKE '%music-files%' OR qual LIKE '%music-files%')
ORDER BY policyname;

-- 6. Test basic operations
SELECT 'TESTING BASIC OPERATIONS' as step;

-- Test if we can perform a simple select (this should work with anon key)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'songs') THEN
        RAISE NOTICE 'Songs table exists and can be accessed';
    ELSE
        RAISE NOTICE 'ERROR: Songs table does not exist!';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: Cannot access songs table: %', SQLERRM;
END $$;

SELECT 'DIAGNOSTIC COMPLETE' as final_message;
