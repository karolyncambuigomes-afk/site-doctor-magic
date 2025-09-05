-- Remove the public access policy that allows unauthenticated viewing
DROP POLICY IF EXISTS "Public can view anonymized model data" ON public.models;

-- Create a secure view for public access with anonymized data only
CREATE OR REPLACE VIEW public.models_public AS
SELECT 
  id,
  name, -- Will be first name only through application logic
  location,
  price,
  image,
  services,
  characteristics,
  availability,
  rating,
  reviews,
  'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.' as description,
  created_at
FROM public.models
WHERE availability IS NOT NULL; -- Only show available models publicly

-- Enable RLS on the view
ALTER VIEW public.models_public SET (security_barrier = true);

-- Create RLS policy for the public view
CREATE POLICY "Anyone can view public model data" 
ON public.models_public 
FOR SELECT 
USING (true);

-- Update the authenticated users policy to be more explicit
DROP POLICY IF EXISTS "Authenticated users can view full model data" ON public.models;
CREATE POLICY "Authenticated users can view full model data" 
ON public.models 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a secure function for public model access
CREATE OR REPLACE FUNCTION public.get_public_models()
RETURNS TABLE (
  id uuid,
  name text,
  location text,
  price text,
  image text,
  services text[],
  characteristics text[],
  availability text,
  rating numeric,
  reviews integer,
  description text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    m.id,
    split_part(m.name, ' ', 1) as name, -- First name only
    m.location,
    m.price,
    m.image,
    m.services,
    m.characteristics,
    m.availability,
    m.rating,
    m.reviews,
    'Detailed information available after registration. Contact us to learn more about our elegant and sophisticated companion services.' as description,
    m.created_at
  FROM public.models m
  WHERE m.availability IS NOT NULL;
$$;