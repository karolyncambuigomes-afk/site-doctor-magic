-- Fix Security Definer View issue by dropping the problematic view
-- and replacing it with a secure function-based approach

-- First, drop the existing view that bypasses RLS
DROP VIEW IF EXISTS public.model_applications_summary;

-- Create a secure function that respects RLS policies
CREATE OR REPLACE FUNCTION public.get_model_applications_summary()
RETURNS TABLE(
    id uuid,
    status text,
    age integer,
    nationality text,
    languages text[],
    education text,
    profession text,
    interests text[],
    availability text,
    location_preference text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    full_name_display text,
    email_display text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Only super admins can access this data
    SELECT 
        ma.id,
        ma.status,
        ma.age,
        ma.nationality,
        ma.languages,
        ma.education,
        ma.profession,
        ma.interests,
        ma.availability,
        ma.location_preference,
        ma.created_at,
        ma.updated_at,
        CASE 
            WHEN is_super_admin() THEN mask_sensitive_application_data(ma.full_name, 'name')
            ELSE '***PROTECTED***'
        END as full_name_display,
        CASE 
            WHEN is_super_admin() THEN mask_sensitive_application_data(ma.email, 'email')
            ELSE '***@***.***'
        END as email_display
    FROM model_applications ma
    WHERE is_super_admin(); -- Only super admins can see any data
$$;

-- Add comment explaining the security approach
COMMENT ON FUNCTION public.get_model_applications_summary() IS 
'Secure function to get model applications summary. Only accessible by super admins and respects all RLS policies.';

-- Create a helper function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE 
        WHEN auth.uid() IS NULL THEN false
        ELSE EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    END;
$$;