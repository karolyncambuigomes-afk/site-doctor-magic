-- Fix karolyn@fivelondon.com profile to be a member (user role with approved status)
UPDATE public.profiles 
SET 
  role = 'user',
  status = 'approved',
  updated_at = now()
WHERE email = 'karolyn@fivelondon.com';

-- Ensure triggers are attached to profiles table to prevent unauthorized role changes
DROP TRIGGER IF EXISTS prevent_self_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_self_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_role_escalation();

DROP TRIGGER IF EXISTS prevent_role_update_trigger ON public.profiles;
CREATE TRIGGER prevent_role_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_update();

DROP TRIGGER IF EXISTS handle_profile_updates_trigger ON public.profiles;
CREATE TRIGGER handle_profile_updates_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_updates();