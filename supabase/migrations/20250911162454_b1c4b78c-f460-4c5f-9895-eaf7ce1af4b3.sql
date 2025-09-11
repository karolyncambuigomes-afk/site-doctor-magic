BEGIN;

-- Create or update the trigger function to prevent non-admins from changing sensitive fields
CREATE OR REPLACE FUNCTION public.handle_profile_updates()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow admins to modify sensitive fields
  IF NOT public.is_admin() THEN
    -- Prevent changes to sensitive fields for non-admins
    NEW.role = OLD.role;
    NEW.status = OLD.status;
    NEW.approved_by = OLD.approved_by;
    NEW.approved_at = OLD.approved_at;
  END IF;
  
  -- Always update the updated_at timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to prevent self role escalation
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- During updates, prevent users from changing their own role
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    -- Check if user is trying to update their own profile
    IF auth.uid() = NEW.id THEN
      -- Revert the role change
      NEW.role = OLD.role;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS handle_profile_updates_trigger ON public.profiles;
DROP TRIGGER IF EXISTS prevent_self_role_escalation_trigger ON public.profiles;

-- Create triggers on profiles table
CREATE TRIGGER handle_profile_updates_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_updates();

CREATE TRIGGER prevent_self_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_role_escalation();

COMMIT;