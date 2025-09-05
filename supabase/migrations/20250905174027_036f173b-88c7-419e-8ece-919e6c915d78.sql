-- Create or replace function to get public models with age
CREATE OR REPLACE FUNCTION get_public_models()
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
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.location,
    m.price,
    m.image,
    m.services,
    m.characteristics,
    m.availability,
    m.rating,
    m.reviews,
    m.description,
    m.age,
    m.created_at
  FROM models m
  ORDER BY m.created_at DESC;
END;
$$;