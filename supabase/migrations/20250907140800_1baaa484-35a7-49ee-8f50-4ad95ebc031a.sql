-- Fix the trigger for profile updates to prevent errors with OLD reference
-- Remove the problematic trigger and create a proper one

-- Drop existing problematic trigger if it exists
DROP TRIGGER IF EXISTS prevent_sensitive_profile_updates ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_sensitive_profile_updates();

-- Create a proper trigger function that correctly handles OLD and NEW references
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