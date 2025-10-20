-- Make model applications fully public for anyone to submit
-- This allows models to apply without authentication

-- 1. Make the storage bucket public so anyone can upload photos/videos
UPDATE storage.buckets 
SET public = true 
WHERE id = 'model-applications';

-- 2. Drop the restrictive INSERT policy that requires approved users
DROP POLICY IF EXISTS "Users can submit applications" ON model_applications;

-- 3. Create new public INSERT policy that allows anyone to submit
CREATE POLICY "Anyone can submit model applications"
ON model_applications
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Keep admin-only SELECT policy (already uses is_admin() function, no recursion)
DROP POLICY IF EXISTS "Admins can view all applications" ON model_applications;
CREATE POLICY "Admins can view all applications"
ON model_applications
FOR SELECT
TO authenticated
USING (is_admin());

-- 5. Keep admin-only UPDATE policy (already uses is_admin() function, no recursion)
DROP POLICY IF EXISTS "Admins can update applications" ON model_applications;
CREATE POLICY "Admins can update applications"
ON model_applications
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Update storage policies to allow public uploads to model-applications bucket
DROP POLICY IF EXISTS "Anyone can upload to model-applications" ON storage.objects;
CREATE POLICY "Anyone can upload to model-applications"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'model-applications');

-- 7. Allow public to read from model-applications bucket (for previews)
DROP POLICY IF EXISTS "Public can view model-applications" ON storage.objects;
CREATE POLICY "Public can view model-applications"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'model-applications');

-- 8. Only admins can delete from model-applications
DROP POLICY IF EXISTS "Admins can delete from model-applications" ON storage.objects;
CREATE POLICY "Admins can delete from model-applications"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'model-applications' AND is_admin());