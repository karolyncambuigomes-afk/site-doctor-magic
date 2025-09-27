-- Security Fix for Model Applications Table - Final Part: Fix the DELETE policy and complete setup

-- Drop any existing policies first
DROP POLICY IF EXISTS "super_admin_only_select_pii_data" ON public.model_applications;
DROP POLICY IF EXISTS "validated_user_insert_application_data" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_only_update_pii_data" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_only_delete_pii_data" ON public.model_applications;

-- CREATE SECURE RLS POLICIES

-- 1. SELECT Policy: Only super admins can view sensitive application data
CREATE POLICY "super_admin_select_applications"
ON public.model_applications
FOR SELECT
TO authenticated
USING (is_super_admin());

-- 2. INSERT Policy: Only approved users can submit applications with validation
CREATE POLICY "approved_user_insert_applications"  
ON public.model_applications
FOR INSERT
TO authenticated
WITH CHECK (
  is_approved_user() AND
  auth.uid() IS NOT NULL AND
  email IS NOT NULL AND
  full_name IS NOT NULL AND
  length(trim(email)) > 0 AND
  length(trim(full_name)) > 0 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- 3. UPDATE Policy: Only super admins can update applications
CREATE POLICY "super_admin_update_applications"
ON public.model_applications
FOR UPDATE
TO authenticated
USING (is_super_admin())
WITH CHECK (is_super_admin());

-- 4. DELETE Policy: Only super admins can delete applications
CREATE POLICY "super_admin_delete_applications"
ON public.model_applications
FOR DELETE
TO authenticated
USING (is_super_admin());

-- Ensure RLS is enabled
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

-- Add comprehensive security documentation
COMMENT ON TABLE public.model_applications IS 'SECURITY CRITICAL: Contains highly sensitive PII data including encrypted personal information, photos, videos, and intimate measurements. Access is strictly limited to super_admin users only. All access is logged via triggers for audit trail compliance.';

-- Log this security enhancement
SELECT log_admin_action(
  'security_enhancement_applied',
  'model_applications',
  NULL,
  NULL,
  jsonb_build_object(
    'action', 'comprehensive_rls_policies_applied',
    'security_level', 'maximum',
    'timestamp', now(),
    'policies_created', ARRAY['super_admin_select_applications', 'approved_user_insert_applications', 'super_admin_update_applications', 'super_admin_delete_applications'],
    'description', 'Applied strictest possible RLS policies to protect sensitive PII data'
  ),
  'critical'
) WHERE is_super_admin();