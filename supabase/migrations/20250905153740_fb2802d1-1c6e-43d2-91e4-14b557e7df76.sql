-- Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, requested_at)
  VALUES (NEW.id, NEW.email, 'user', 'pending', now());
  RETURN NEW;
END;
$$;