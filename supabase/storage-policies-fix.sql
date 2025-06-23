-- Fixed Storage Policies for music-files bucket
-- Run this in Supabase SQL Editor

-- First, remove any existing policies for music-files bucket
DROP POLICY IF EXISTS "Allow public uploads to music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from music-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to music-files bucket" ON storage.objects;

-- Create new policies with correct permissions

-- Policy for listing buckets (this might be the missing piece)
CREATE POLICY "Allow public bucket listing" ON storage.buckets
FOR SELECT 
TO public
USING (true);

-- Policy to allow public uploads to music-files bucket
CREATE POLICY "Allow public uploads to music-files bucket" ON storage.objects
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'music-files');

-- Policy to allow public reads from music-files bucket
CREATE POLICY "Allow public reads from music-files bucket" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'music-files');

-- Policy to allow public deletes from music-files bucket
CREATE POLICY "Allow public deletes from music-files bucket" ON storage.objects
FOR DELETE 
TO public
USING (bucket_id = 'music-files');

-- Policy to allow public updates to music-files bucket
CREATE POLICY "Allow public updates to music-files bucket" ON storage.objects
FOR UPDATE 
TO public
USING (bucket_id = 'music-files')
WITH CHECK (bucket_id = 'music-files');

-- Verify the bucket exists and get its details
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE name = 'music-files';

-- Check if policies were created successfully
SELECT 
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%music-files%'
ORDER BY policyname;

-- Also check bucket policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'buckets'
ORDER BY policyname;
