-- Supabase Storage Setup for Music Player
-- Run this after creating the storage bucket 'music-files'

-- Storage policies for music-files bucket
-- Enable RLS on storage.objects (usually already enabled)

-- Policy to allow public uploads
CREATE POLICY "Allow public uploads to music-files bucket" ON storage.objects
FOR INSERT 
TO public
WITH CHECK (bucket_id = 'music-files');

-- Policy to allow public reads
CREATE POLICY "Allow public reads from music-files bucket" ON storage.objects
FOR SELECT 
TO public
USING (bucket_id = 'music-files');

-- Policy to allow public deletes
CREATE POLICY "Allow public deletes from music-files bucket" ON storage.objects
FOR DELETE 
TO public
USING (bucket_id = 'music-files');

-- Policy to allow public updates (if needed)
CREATE POLICY "Allow public updates to music-files bucket" ON storage.objects
FOR UPDATE 
TO public
USING (bucket_id = 'music-files')
WITH CHECK (bucket_id = 'music-files');

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%music-files%';
