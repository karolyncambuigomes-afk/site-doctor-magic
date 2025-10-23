-- ============================================
-- SECURITY FIX: Remove Plaintext PII and Add Secure Access
-- ============================================

-- 1. Make model-applications bucket PRIVATE (not public)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'model-applications';

-- 2. Drop public upload policies and create admin-only policies
DROP POLICY IF EXISTS "Anyone can upload to model-applications" ON storage.objects;
DROP POLICY IF EXISTS "Public can view model-applications" ON storage.objects;

CREATE POLICY "Admins can upload to model-applications"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'model-applications' AND is_admin());

CREATE POLICY "Admins can view model-applications"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'model-applications' AND is_admin());

-- 3. Create rate limiting table for admin PII access
CREATE TABLE IF NOT EXISTS public.admin_pii_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  application_id UUID NOT NULL REFERENCES model_applications(id),
  fields_accessed TEXT[] NOT NULL,
  access_reason TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_pii_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view PII access logs"
ON public.admin_pii_access_log
FOR SELECT
TO authenticated
USING (is_admin());

-- 4. Create rate limiting check function
CREATE OR REPLACE FUNCTION public.check_admin_pii_rate_limit(admin_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_count INTEGER;
  max_accesses INTEGER := 50; -- Max 50 PII accesses per hour
BEGIN
  -- Count accesses in the last hour
  SELECT COUNT(*) INTO access_count
  FROM admin_pii_access_log
  WHERE admin_user_id = admin_id
    AND created_at > now() - INTERVAL '1 hour';
  
  IF access_count >= max_accesses THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum % PII accesses per hour', max_accesses;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- 5. Create secure function to access decrypted PII with audit logging
CREATE OR REPLACE FUNCTION public.get_application_pii_secure(
  p_application_id UUID,
  p_access_reason TEXT DEFAULT 'admin_review'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  admin_id UUID;
BEGIN
  -- Get current admin user ID
  admin_id := auth.uid();
  
  -- Verify admin privileges
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Check rate limiting
  PERFORM check_admin_pii_rate_limit(admin_id);
  
  -- Log the PII access
  INSERT INTO admin_pii_access_log (
    admin_user_id,
    application_id,
    fields_accessed,
    access_reason,
    ip_address
  ) VALUES (
    admin_id,
    p_application_id,
    ARRAY['full_name', 'email', 'phone', 'measurements', 'photos', 'videos', 'date_of_birth', 'instagram_handle'],
    p_access_reason,
    inet_client_addr()
  );
  
  -- Return decrypted PII data
  SELECT jsonb_build_object(
    'id', id,
    'full_name', COALESCE(
      decrypt_pii_data(full_name_encrypted, 'contact'),
      full_name,
      '***UNAVAILABLE***'
    ),
    'email', COALESCE(
      decrypt_pii_data(email_encrypted, 'contact'),
      email,
      '***UNAVAILABLE***'
    ),
    'phone', COALESCE(
      decrypt_pii_data(phone_encrypted, 'contact'),
      phone,
      '***UNAVAILABLE***'
    ),
    'measurements', COALESCE(
      decrypt_pii_data(measurements_encrypted, 'measurements'),
      measurements,
      '***UNAVAILABLE***'
    ),
    'height', COALESCE(
      decrypt_pii_data(height_encrypted, 'measurements'),
      height,
      '***UNAVAILABLE***'
    ),
    'date_of_birth', COALESCE(
      decrypt_pii_data(date_of_birth_encrypted, 'general'),
      date_of_birth::text,
      '***UNAVAILABLE***'
    ),
    'instagram_handle', COALESCE(
      decrypt_pii_data(instagram_handle_encrypted, 'contact'),
      instagram_handle,
      '***UNAVAILABLE***'
    ),
    'photos', CASE 
      WHEN photos_encrypted IS NOT NULL THEN 
        string_to_array(decrypt_pii_data(photos_encrypted, 'photos'), '|')
      WHEN photos IS NOT NULL THEN photos
      ELSE ARRAY[]::TEXT[]
    END,
    'videos', CASE 
      WHEN videos_encrypted IS NOT NULL THEN 
        string_to_array(decrypt_pii_data(videos_encrypted, 'photos'), '|')
      WHEN videos IS NOT NULL THEN videos
      ELSE ARRAY[]::TEXT[]
    END,
    'age', age,
    'nationality', nationality,
    'languages', languages,
    'hair_color', hair_color,
    'eye_color', eye_color,
    'tattoos', COALESCE(
      decrypt_pii_data(tattoos_encrypted, 'general'),
      tattoos,
      '***UNAVAILABLE***'
    ),
    'piercings', COALESCE(
      decrypt_pii_data(piercings_encrypted, 'general'),
      piercings,
      '***UNAVAILABLE***'
    ),
    'status', status,
    'admin_notes', admin_notes,
    'created_at', created_at,
    'reviewed_at', reviewed_at
  ) INTO result
  FROM model_applications
  WHERE id = p_application_id;
  
  IF result IS NULL THEN
    RAISE EXCEPTION 'Application not found';
  END IF;
  
  RETURN result;
END;
$$;

-- 6. Create function to list applications with masked data (no PII)
CREATE OR REPLACE FUNCTION public.get_applications_summary()
RETURNS TABLE (
  id UUID,
  age INTEGER,
  nationality TEXT,
  languages TEXT[],
  hair_color TEXT,
  eye_color TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  has_photos BOOLEAN,
  has_videos BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin privileges
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Return summary data without PII
  RETURN QUERY
  SELECT 
    ma.id,
    ma.age,
    ma.nationality,
    ma.languages,
    ma.hair_color,
    ma.eye_color,
    ma.status,
    ma.created_at,
    ma.reviewed_at,
    (ma.photos IS NOT NULL AND array_length(ma.photos, 1) > 0) OR 
    (ma.photos_encrypted IS NOT NULL) AS has_photos,
    (ma.videos IS NOT NULL AND array_length(ma.videos, 1) > 0) OR 
    (ma.videos_encrypted IS NOT NULL) AS has_videos
  FROM model_applications ma
  ORDER BY ma.created_at DESC;
END;
$$;

-- 7. Remove SELECT policy that allows direct table access
DROP POLICY IF EXISTS "Admins can view all applications" ON model_applications;

-- Create restrictive policy that prevents direct SELECT
CREATE POLICY "No direct SELECT on model_applications"
ON model_applications
FOR SELECT
TO authenticated
USING (false); -- Always deny direct SELECT, force use of secure functions

-- Note: Plaintext columns will remain for backwards compatibility but
-- admins must use get_application_pii_secure() function to access data
-- The RLS policy above prevents direct table queries