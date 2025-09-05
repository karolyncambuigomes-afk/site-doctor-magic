-- Drop existing function and create new one with age
DROP FUNCTION public.get_public_models();

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
  age integer,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
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
    m.age,
    m.created_at
  FROM public.models m
  WHERE m.availability IS NOT NULL;
$$;