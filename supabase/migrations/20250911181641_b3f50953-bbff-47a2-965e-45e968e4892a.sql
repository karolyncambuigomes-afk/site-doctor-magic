-- Update RLS policy to allow approved users to see members-only content
DROP POLICY IF EXISTS "Members and admins can view members-only images" ON model_gallery;

CREATE POLICY "Members and admins can view members-only images" 
ON model_gallery 
FOR SELECT 
USING (
  visibility = 'members_only' AND (
    is_admin() OR 
    (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND status = 'approved'
    ))
  )
);

-- Update Ksenia's gallery images to be members_only since she's an exclusive model
UPDATE model_gallery 
SET visibility = 'members_only' 
WHERE model_id = (SELECT id FROM models WHERE name = 'Ksenia');