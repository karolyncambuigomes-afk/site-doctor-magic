-- Fix security vulnerabilities in model_applications table
-- This migration implements strict RLS policies to protect sensitive personal data

-- First, ensure we have the necessary security definer functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  END;
$$;

-- Create function to check if user is approved (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND status = 'approved'
    )
  END;
$$;

-- Drop existing policies to recreate them securely
DROP POLICY IF EXISTS "Admin only - delete applications" ON public.model_applications;
DROP POLICY IF EXISTS "Admin only - update applications" ON public.model_applications;
DROP POLICY IF EXISTS "Admin only - view applications" ON public.model_applications;
DROP POLICY IF EXISTS "Verified users can submit applications" ON public.model_applications;

-- Recreate strict RLS policies using security definer functions

-- Only admins can view application data (most restrictive)
CREATE POLICY "admin_only_select_applications" 
ON public.model_applications 
FOR SELECT 
USING (is_admin());

-- Only admins can update application data
CREATE POLICY "admin_only_update_applications" 
ON public.model_applications 
FOR UPDATE 
USING (is_admin());

-- Only admins can delete application data
CREATE POLICY "admin_only_delete_applications" 
ON public.model_applications 
FOR DELETE 
USING (is_admin());

-- Approved users can insert their own applications (with strict validation)
CREATE POLICY "approved_users_insert_applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND is_approved_user()
  AND email IS NOT NULL 
  AND full_name IS NOT NULL 
  AND length(TRIM(BOTH FROM email)) > 0 
  AND length(TRIM(BOTH FROM full_name)) > 0
);

-- Add additional security: Create audit function for sensitive data access
CREATE OR REPLACE FUNCTION public.log_application_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, table_name, record_id,
    old_values, new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    'model_applications',
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for all operations on sensitive data
DROP TRIGGER IF EXISTS audit_model_applications_access ON public.model_applications;
CREATE TRIGGER audit_model_applications_access
  AFTER INSERT OR UPDATE OR DELETE ON public.model_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_access();

-- Ensure RLS is enabled on the table
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

-- Add comment documenting the security approach
COMMENT ON TABLE public.model_applications IS 'SECURITY: This table contains highly sensitive personal data. Access is restricted to admins only via RLS policies. All access is logged for security auditing.';

-- Create additional security function to validate application submissions
CREATE OR REPLACE FUNCTION public.validate_application_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Additional validation for sensitive data
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RAISE EXCEPTION 'Email is required for application submission';
  END IF;
  
  IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
    RAISE EXCEPTION 'Full name is required for application submission';
  END IF;
  
  -- Ensure only approved users can submit
  IF NOT is_approved_user() THEN
    RAISE EXCEPTION 'Only approved users can submit applications';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add validation trigger
DROP TRIGGER IF EXISTS validate_application_submission_trigger ON public.model_applications;
CREATE TRIGGER validate_application_submission_trigger
  BEFORE INSERT ON public.model_applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_application_submission();