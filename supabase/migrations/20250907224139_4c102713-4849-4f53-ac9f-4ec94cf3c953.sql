-- Add membership fields to models table
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS members_only BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS face_visible BOOLEAN DEFAULT true;

-- Create index for better performance on members_only queries
CREATE INDEX IF NOT EXISTS idx_models_members_only ON public.models(members_only);

-- Update RLS policy to handle members_only models
DROP POLICY IF EXISTS "Premium users can view full model data" ON public.models;

CREATE POLICY "Premium users can view full model data" ON public.models
FOR SELECT
USING (
  -- Allow admins to see everything
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ))
  OR
  -- Allow premium users to see all models (including members_only)
  (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM user_subscriptions 
      WHERE user_subscriptions.user_id = auth.uid() 
      AND user_subscriptions.active = true
    )
  )
  OR
  -- Allow everyone to see public models (not members_only)
  (members_only = false OR members_only IS NULL)
);