-- Security Fix for Model Applications Table - Phase 3 (Final)
-- Add audit triggers and safe view for non-sensitive data access

-- 1. Create audit trigger function for automatic logging
CREATE OR REPLACE FUNCTION public.audit_application_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log all operations on sensitive application data
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    risk_level,
    ip_address,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    'model_applications',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    'critical',
    inet_client_addr(),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. Apply the audit trigger to model_applications table
DROP TRIGGER IF EXISTS audit_model_applications_trigger ON public.model_applications;
CREATE TRIGGER audit_model_applications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.model_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_application_access();

-- 3. Ensure RLS is enabled on the table
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create a safe view for application summary (non-sensitive data only)
CREATE OR REPLACE VIEW public.model_applications_summary AS
SELECT 
  id,
  status,
  age,
  nationality,
  languages,
  education,
  profession,
  interests,
  availability,
  location_preference,
  created_at,
  updated_at,
  -- Masked sensitive fields that only super admins can see unmasked
  CASE 
    WHEN is_super_admin() THEN full_name
    ELSE '***PROTECTED***'
  END as full_name_display,
  CASE 
    WHEN is_super_admin() THEN email
    ELSE regexp_replace(email, '(.{1,2}).*@(.{1,2}).*', '\1***@\2***')
  END as email_display
FROM public.model_applications;

-- 5. Grant SELECT permission on the summary view
GRANT SELECT ON public.model_applications_summary TO authenticated;

-- 6. Add security comments for documentation
COMMENT ON TABLE public.model_applications IS 'SECURITY CRITICAL: Contains highly sensitive PII data. Access restricted to super_admin only with full audit logging.';
COMMENT ON VIEW public.model_applications_summary IS 'Safe view of model applications with sensitive data masked for non-super-admin users';

-- 7. Additional security function for permission checking
CREATE OR REPLACE FUNCTION public.check_application_access_permissions(
  requested_action text,
  application_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_role text;
  is_authorized boolean := false;
BEGIN
  -- Get user role
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only super_admin can access sensitive application data
  IF user_role = 'super_admin' THEN
    is_authorized := true;
    
    -- Log the access attempt
    PERFORM log_admin_action(
      requested_action,
      'model_applications',
      application_id,
      NULL,
      jsonb_build_object(
        'user_role', user_role,
        'action', requested_action,
        'timestamp', now()
      ),
      'critical'
    );
  ELSE
    -- Log unauthorized access attempt
    PERFORM log_admin_action(
      'unauthorized_access_attempt',
      'model_applications',
      application_id,
      NULL,
      jsonb_build_object(
        'user_role', COALESCE(user_role, 'unknown'),
        'attempted_action', requested_action,
        'timestamp', now(),
        'denied_reason', 'insufficient_privileges'
      ),
      'high'
    );
  END IF;
  
  RETURN is_authorized;
END;
$$;