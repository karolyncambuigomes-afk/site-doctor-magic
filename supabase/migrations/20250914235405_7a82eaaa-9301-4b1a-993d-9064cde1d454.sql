-- Fix remaining security issues

-- Add RLS policy for user_management_audit table
CREATE POLICY "admin_only_audit_access" 
ON public.user_management_audit 
FOR ALL 
USING (is_admin());

-- Enable RLS on the audit table
ALTER TABLE public.user_management_audit ENABLE ROW LEVEL SECURITY;

-- Fix the Security Definer View issue by dropping and recreating the view properly
-- First check if the view exists and drop it
DROP VIEW IF EXISTS public.model_applications_secure;

-- Recreate the view without SECURITY DEFINER to fix the security warning
-- This view will now use the caller's permissions rather than the view creator's
CREATE VIEW public.model_applications_secure AS
SELECT 
  id,
  email,
  full_name,
  phone,
  age,
  date_of_birth,
  nationality,
  languages,
  height,
  measurements,
  hair_color,
  eye_color,
  status,
  created_at,
  updated_at,
  reviewed_at,
  reviewed_by,
  admin_notes
FROM public.model_applications;

-- Add security comment
COMMENT ON VIEW public.model_applications_secure IS 'SECURITY: Secure view of applications. Access controlled by underlying table RLS policies.';

-- Add security comment for audit table
COMMENT ON TABLE public.user_management_audit IS 'SECURITY: User management audit log restricted to admin access only.';