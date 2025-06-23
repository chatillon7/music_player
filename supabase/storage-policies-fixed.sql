-- Fixed Storage Policies (Without IF NOT EXISTS)
-- Run this in Supabase SQL Editor

-- First, drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Allow public bucket listing" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public reads from music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to music-files bucket" ON storage.objects;

-- Create the bucket listing policy (this is the key missing piece!)
CREATE POLICY "Allow public bucket listing" ON storage.buckets
FOR SELECT 
TO public
USING (true);

-- Create object policies for music-files bucket
CREATE POLICY "Allow public reads from music-files bucket" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'music-files');

CREATE POLICY "Allow public uploads to music-files bucket" ON storage.objects
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'music-files');

CREATE POLICY "Allow public deletes from music-files bucket" ON storage.objects
FOR DELETE 
TO public
USING (bucket_id = 'music-files');

CREATE POLICY "Allow public updates to music-files bucket" ON storage.objects
FOR UPDATE 
TO public
USING (bucket_id = 'music-files')
WITH CHECK (bucket_id = 'music-files');

-- Verify everything is set up correctly
SELECT '=== BUCKETS ===' as info;
SELECT name, public, created_at FROM storage.buckets;

SELECT '=== BUCKET POLICIES ===' as info;
SELECT policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'buckets'
ORDER BY policyname;

SELECT '=== OBJECT POLICIES ===' as info;
SELECT policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%music-files%'
ORDER BY policyname;

SELECT 'Setup complete! Test your connection now.' as message;
