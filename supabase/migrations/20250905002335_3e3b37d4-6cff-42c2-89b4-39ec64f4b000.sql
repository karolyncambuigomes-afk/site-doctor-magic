-- Create trigger to prevent role changes through direct updates
CREATE OR REPLACE FUNCTION public.prevent_role_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow the function if called from update_user_role function or during profile creation
  IF TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  
  -- During updates, if role is being changed and it's not from our secure function
  IF OLD.role != NEW.role THEN
    -- Check if this is being called from our secure function
    -- We do this by checking if the current user has admin privileges
    IF (SELECT public.get_current_user_role()) != 'admin' THEN
      RAISE EXCEPTION 'Access denied: Role changes must be performed through admin functions only';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS prevent_unauthorized_role_updates ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_update();