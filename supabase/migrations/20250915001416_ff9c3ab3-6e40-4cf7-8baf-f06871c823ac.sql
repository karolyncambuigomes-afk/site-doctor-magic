-- Analysis: The linter is detecting SECURITY DEFINER functions, not views
-- Most of these functions NEED SECURITY DEFINER for proper security enforcement
-- However, we can review and adjust where appropriate

-- The following functions legitimately need SECURITY DEFINER:
-- 1. is_approved_user, is_admin, get_current_user_status, get_current_user_role - Security checks
-- 2. log_* functions - Audit logging must bypass RLS
-- 3. validate_application_submission - Security validation
-- 4. encrypt/decrypt functions - Cryptographic operations
-- 5. Admin functions - Administrative operations
-- 6. Trigger functions - Must run with elevated privileges

-- One function that could be changed: update_updated_at_column (generic trigger)
-- This is a simple timestamp update that doesn't need elevated privileges

-- Drop and recreate update_updated_at_column without SECURITY DEFINER
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add comment explaining why other functions keep SECURITY DEFINER
COMMENT ON FUNCTION public.is_approved_user() IS 
'SECURITY DEFINER required - checks user approval status across security boundaries';

COMMENT ON FUNCTION public.is_admin() IS 
'SECURITY DEFINER required - validates admin privileges for security policies';

COMMENT ON FUNCTION public.get_current_user_role() IS 
'SECURITY DEFINER required - prevents infinite recursion in RLS policies';

-- Note: The remaining SECURITY DEFINER functions are intentionally designed this way
-- for security purposes and should not be changed without careful security review