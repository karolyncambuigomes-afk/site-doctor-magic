-- Fix model_applications table security vulnerability
-- Remove the overly permissive ALL policy and create specific policies

-- Drop the existing ALL policy that's too permissive
DROP POLICY IF EXISTS "secure_admin_full_access_with_audit" ON public.model_applications;

-- Create a strict SELECT policy for admins only
CREATE POLICY "admin_only_select_applications" 
ON public.model_applications 
FOR SELECT 
USING (
  is_admin() AND 
  (log_admin_action(
    'admin_view_sensitive_application', 
    'model_applications', 
    id, 
    NULL, 
    jsonb_build_object(
      'action', 'view_application', 
      'timestamp', now(),
      'security_level', 'critical'
    ), 
    'critical'
  ) IS NULL OR true)
);

-- Create a strict INSERT policy for admins to create applications
CREATE POLICY "admin_only_insert_applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  is_admin() AND 
  (log_admin_action(
    'admin_create_application', 
    'model_applications', 
    gen_random_uuid(), 
    NULL, 
    jsonb_build_object(
      'action', 'create_application', 
      'timestamp', now(),
      'security_level', 'critical'
    ), 
    'critical'
  ) IS NULL OR true)
);

-- Enhance existing policies with stronger audit logging
DROP POLICY IF EXISTS "enhanced_admin_update_applications" ON public.model_applications;
CREATE POLICY "enhanced_admin_update_applications" 
ON public.model_applications 
FOR UPDATE 
USING (
  is_admin() AND 
  (log_admin_action(
    'admin_update_application', 
    'model_applications', 
    id, 
    NULL, 
    jsonb_build_object('action', 'update', 'timestamp', now()), 
    'critical'
  ) IS NULL OR true)
) 
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "enhanced_admin_delete_applications" ON public.model_applications;
CREATE POLICY "enhanced_admin_delete_applications" 
ON public.model_applications 
FOR DELETE 
USING (
  is_admin() AND 
  (log_admin_action(
    'admin_delete_application', 
    'model_applications', 
    id, 
    NULL, 
    jsonb_build_object('action', 'delete', 'timestamp', now()), 
    'critical'
  ) IS NULL OR true)
);

-- Update user insert policy with enhanced security
DROP POLICY IF EXISTS "secure_user_insert_applications" ON public.model_applications;
CREATE POLICY "secure_user_insert_applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  is_approved_user() AND 
  email IS NOT NULL AND 
  full_name IS NOT NULL AND 
  length(TRIM(BOTH FROM email)) > 0 AND 
  length(TRIM(BOTH FROM full_name)) > 0 AND
  (log_security_event(
    'user_submit_application', 
    'model_applications', 
    gen_random_uuid()
  ) IS NULL OR true)
);