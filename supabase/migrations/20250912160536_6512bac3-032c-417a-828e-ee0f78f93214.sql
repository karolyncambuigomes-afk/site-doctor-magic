-- CRITICAL SECURITY FIX: Secure model_applications table
-- This table contains highly sensitive personal information that must be protected

-- Ensure RLS is enabled
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

-- Check current policies
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'model_applications'
ORDER BY cmd, policyname;

-- Drop any overly permissive policies that might allow public access
DROP POLICY IF EXISTS "Public can view applications" ON public.model_applications;
DROP POLICY IF EXISTS "Users can view applications" ON public.model_applications;
DROP POLICY IF EXISTS "Anyone can view applications" ON public.model_applications;

-- Remove existing policies and recreate them with stricter security
DROP POLICY IF EXISTS "Admins can view all applications" ON public.model_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.model_applications;
DROP POLICY IF EXISTS "Only admins can update application status" ON public.model_applications;
DROP POLICY IF EXISTS "Verified users can submit applications" ON public.model_applications;

-- Create secure admin-only policies
CREATE POLICY "Admin only - view applications" 
ON public.model_applications 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admin only - update applications" 
ON public.model_applications 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admin only - delete applications" 
ON public.model_applications 
FOR DELETE 
USING (public.is_admin());

-- Allow verified users to submit applications but NOT read them back
CREATE POLICY "Verified users can submit applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND status = 'approved'
  )
  AND email IS NOT NULL 
  AND full_name IS NOT NULL 
  AND length(TRIM(BOTH FROM email)) > 0 
  AND length(TRIM(BOTH FROM full_name)) > 0
);

-- Add security audit logging for this sensitive table
CREATE OR REPLACE FUNCTION public.log_application_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any access to applications table
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_model_applications ON public.model_applications;
CREATE TRIGGER audit_model_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.model_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_access();

-- Verify the security setup
SELECT 
  'model_applications' as table_name,
  policyname,
  cmd,
  permissive,
  qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'model_applications'
ORDER BY cmd, policyname;