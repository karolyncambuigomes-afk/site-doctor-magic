-- Adjust RLS to allow approved members to view members-only models
DROP POLICY IF EXISTS "Premium users can view full model data" ON public.models;

CREATE POLICY "Approved users and admins can view full model data"
ON public.models
FOR SELECT
USING (
  public.is_admin()
  OR (
    auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.status = 'approved'
    )
  )
  OR (members_only = false OR members_only IS NULL)
);

-- Ensure Ksenia is set as members-only (optional safety)
UPDATE public.models
SET members_only = true, all_photos_public = false
WHERE name = 'Ksenia';