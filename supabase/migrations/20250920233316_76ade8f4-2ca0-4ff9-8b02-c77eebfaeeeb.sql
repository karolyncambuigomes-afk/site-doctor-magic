-- Clean up and secure model_applications table policies
-- First drop all existing policies to start fresh
DROP POLICY IF EXISTS "admin_only_select_applications" ON public.model_applications;
DROP POLICY IF EXISTS "admin_only_insert_applications" ON public.model_applications;
DROP POLICY IF EXISTS "enhanced_admin_update_applications" ON public.model_applications;
DROP POLICY IF EXISTS "enhanced_admin_delete_applications" ON public.model_applications;
DROP POLICY IF EXISTS "secure_user_insert_applications" ON public.model_applications;
DROP POLICY IF EXISTS "secure_admin_full_access_with_audit" ON public.model_applications;

-- Create secure SELECT policy - ONLY admins can view sensitive data
CREATE POLICY "strict_admin_only_select" 
ON public.model_applications 
FOR SELECT 
USING (
  is_admin() AND 
  (log_admin_action(
    'view_application_data', 
    'model_applications', 
    id, 
    NULL, 
    jsonb_build_object(
      'action', 'view_sensitive_data', 
      'timestamp', now(),
      'security_level', 'critical'
    ), 
    'critical'
  ) IS NULL OR true)
);

-- Secure UPDATE policy - ONLY admins can modify
CREATE POLICY "strict_admin_only_update" 
ON public.model_applications 
FOR UPDATE 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Secure DELETE policy - ONLY admins can delete
CREATE POLICY "strict_admin_only_delete" 
ON public.model_applications 
FOR DELETE 
USING (is_admin());

-- Secure INSERT policy for users - strict validation
CREATE POLICY "validated_user_insert_only" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  is_approved_user() AND 
  email IS NOT NULL AND 
  full_name IS NOT NULL AND 
  length(TRIM(BOTH FROM email)) > 0 AND 
  length(TRIM(BOTH FROM full_name)) > 0
);