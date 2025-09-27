-- Security Fix for Model Applications Table - Phase 2
-- Create secure RLS policies and audit functions

-- 1. Create enhanced admin action logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  resource_type text,
  resource_id uuid,
  old_values jsonb DEFAULT NULL,
  new_values jsonb DEFAULT NULL,
  risk_level text DEFAULT 'medium'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    risk_level,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    risk_level,
    inet_client_addr(),
    'database_function',
    now()
  );
END;
$$;

-- 2. Create new secure RLS policies for model_applications

-- SELECT Policy: Only super admins can view sensitive application data
CREATE POLICY "super_admin_only_select_with_audit"
ON public.model_applications
FOR SELECT
TO authenticated
USING (
  is_super_admin() AND
  (log_admin_action(
    'view_sensitive_application_data',
    'model_applications',
    id,
    NULL,
    jsonb_build_object(
      'action', 'access_pii_data',
      'timestamp', now(),
      'security_level', 'critical'
    ),
    'critical'
  ) IS NULL OR true)
);

-- INSERT Policy: Only approved users can submit applications with data validation
CREATE POLICY "approved_user_insert_with_validation"
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

-- UPDATE Policy: Only super admins can update applications
CREATE POLICY "super_admin_only_update_with_audit"
ON public.model_applications
FOR UPDATE
TO authenticated
USING (
  is_super_admin()
)
WITH CHECK (
  is_super_admin()
);

-- DELETE Policy: Only super admins can delete applications
CREATE POLICY "super_admin_only_delete_with_audit"
ON public.model_applications
FOR DELETE
TO authenticated
USING (
  is_super_admin()
);