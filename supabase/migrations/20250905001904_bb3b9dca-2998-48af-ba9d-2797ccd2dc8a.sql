-- Step 1: Create security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Step 2: Create policy to prevent users from updating their own role
-- First drop the existing update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new update policy that excludes role field
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND OLD.role = NEW.role);

-- Step 3: Create admin-only function to manage user roles
CREATE OR REPLACE FUNCTION public.update_user_role(user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- Only allow admins to update roles
  IF (SELECT public.get_current_user_role()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Only administrators can update user roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: Must be either user or admin';
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = NOW()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;