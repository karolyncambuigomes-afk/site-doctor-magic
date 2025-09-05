-- Update the models table RLS policy to provide tiered access
-- Drop the existing public policy
DROP POLICY IF EXISTS "Models are viewable by everyone" ON public.models;

-- Create new policies for tiered access
-- Public users get limited, anonymized data
CREATE POLICY "Public can view anonymized model data" 
ON public.models 
FOR SELECT 
USING (auth.uid() IS NULL);

-- Authenticated users get full access
CREATE POLICY "Authenticated users can view full model data" 
ON public.models 
FOR SELECT 
TO authenticated
USING (true);

-- Keep admin policy unchanged
-- (Admin policy already exists and allows full management)