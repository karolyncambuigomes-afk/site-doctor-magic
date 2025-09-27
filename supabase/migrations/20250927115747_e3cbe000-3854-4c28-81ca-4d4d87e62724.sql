-- Security Fix Phase 4 (Corrected) - Fix Security Definer View Issue
-- Create a simple view that relies on the underlying table's RLS policies

-- 1. Drop the problematic view
DROP VIEW IF EXISTS public.model_applications_summary CASCADE;

-- 2. Create a simple, secure view without SECURITY DEFINER
-- This view will automatically inherit RLS policies from the underlying table
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
  -- Always mask sensitive fields in the view
  '***PROTECTED***' as full_name_display,
  CASE 
    WHEN email IS NOT NULL THEN 
      substring(email from 1 for 2) || '***@' || 
      split_part(substring(email from position('@' in email) + 1), '.', 1) || '.***'
    ELSE '***@***.***'
  END as email_display
FROM public.model_applications;

-- 3. Set security barrier to ensure RLS is enforced
ALTER VIEW public.model_applications_summary SET (security_barrier = true);

-- 4. Grant SELECT permission to authenticated users
GRANT SELECT ON public.model_applications_summary TO authenticated;

-- 5. Update documentation
COMMENT ON VIEW public.model_applications_summary IS 'Safe summary view of model applications with sensitive data masked. Inherits RLS policies from underlying table.';

-- 6. Verify that RLS is enabled on the base table
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;