-- First check what policies currently exist
-- Drop all existing policies for models table
DROP POLICY IF EXISTS "Models are viewable by everyone" ON public.models;
DROP POLICY IF EXISTS "Public can view anonymized model data" ON public.models;
DROP POLICY IF EXISTS "Authenticated users can view full model data" ON public.models;

-- Create a single policy that allows public read access for now
-- We'll handle the data filtering in the application layer
CREATE POLICY "Public and authenticated users can view models" 
ON public.models 
FOR SELECT 
USING (true);