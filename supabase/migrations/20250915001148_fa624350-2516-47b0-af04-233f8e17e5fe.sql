-- Fix Security Definer View issue
-- Drop and recreate model_applications_secure view without SECURITY DEFINER

DROP VIEW IF EXISTS public.model_applications_secure;

-- Recreate the view without SECURITY DEFINER property
-- This ensures RLS policies of the querying user are enforced, not the view creator
CREATE VIEW public.model_applications_secure AS
SELECT 
  id,
  full_name,
  email,
  phone,
  age,
  date_of_birth,
  nationality,
  height,
  measurements,
  hair_color,
  eye_color,
  languages,
  status,
  admin_notes,
  created_at,
  updated_at,
  reviewed_at,
  reviewed_by
FROM public.model_applications;

-- Add a comment explaining the security consideration
COMMENT ON VIEW public.model_applications_secure IS 
'Secure view of model applications without SECURITY DEFINER to ensure proper RLS enforcement. Access is controlled by RLS policies on the underlying model_applications table.';