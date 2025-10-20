-- Remove approved user requirement from application submission validation
-- This allows anyone to submit model applications without authentication

-- 1. Update validation function to remove is_approved_user() check
CREATE OR REPLACE FUNCTION public.validate_application_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate required fields only
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RAISE EXCEPTION 'Email is required for application submission';
  END IF;
  
  IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
    RAISE EXCEPTION 'Full name is required for application submission';
  END IF;
  
  -- No authentication/approval required
  RETURN NEW;
END;
$$;

-- 2. Recreate trigger to ensure it uses updated function
DROP TRIGGER IF EXISTS validate_application_submission_trigger ON public.model_applications;
CREATE TRIGGER validate_application_submission_trigger
  BEFORE INSERT ON public.model_applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_application_submission();