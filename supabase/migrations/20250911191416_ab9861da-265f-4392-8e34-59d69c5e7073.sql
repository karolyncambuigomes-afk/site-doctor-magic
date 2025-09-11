-- Simplify RLS policies since only admin creates users (all authenticated users are approved)

-- Update models RLS to allow all authenticated users to view full model data
DROP POLICY IF EXISTS "Approved users and admins can view full model data" ON public.models;

CREATE POLICY "Authenticated users can view all model data"
ON public.models
FOR SELECT
USING (
  auth.uid() IS NOT NULL OR (members_only = false OR members_only IS NULL)
);

-- Update model_gallery RLS to allow all authenticated users to view members-only content
DROP POLICY IF EXISTS "Members and admins can view members-only images" ON public.model_gallery;

CREATE POLICY "Authenticated users can view members-only images"
ON public.model_gallery
FOR SELECT
USING (
  visibility = 'public' OR (visibility = 'members_only' AND auth.uid() IS NOT NULL)
);

-- Simplify profiles RLS since all users are now approved by default
-- Keep existing policies but update comments for clarity

-- Update the handle_new_user function to create users as approved by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, approved_at, requested_at)
  VALUES (NEW.id, NEW.email, 'user', 'approved', now(), now());
  RETURN NEW;
END;
$$;