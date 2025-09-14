BEGIN;

-- Ensure RLS is enabled
ALTER TABLE public.model_gallery ENABLE ROW LEVEL SECURITY;

-- Replace overly-permissive public SELECT policy
DROP POLICY IF EXISTS "Model gallery is viewable by everyone" ON public.model_gallery;

-- Public can view only public images
CREATE POLICY "Public can view public gallery images"
ON public.model_gallery
FOR SELECT
USING (visibility = 'public');

-- Members and admins can view members-only images
CREATE POLICY "Members and admins can view members-only images"
ON public.model_gallery
FOR SELECT
USING (
  visibility = 'members_only'
  AND (
    public.is_admin()
    OR (auth.uid() IS NOT NULL AND public.check_user_subscription(auth.uid()))
  )
);

COMMIT;