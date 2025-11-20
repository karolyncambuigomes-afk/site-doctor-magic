-- Drop and recreate get_public_models() with pricing field to fix hardcoded pricing fallback issue
DROP FUNCTION IF EXISTS public.get_public_models();

CREATE FUNCTION public.get_public_models()
RETURNS TABLE(
  id uuid, 
  name text, 
  location text, 
  price text, 
  pricing jsonb,
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
AS $function$
  SELECT 
    m.id,
    split_part(m.name, ' ', 1) as name,
    m.location,
    m.price,
    m.pricing,
    COALESCE(
      (SELECT mg.image_url FROM model_gallery mg WHERE mg.model_id = m.id AND mg.visibility = 'public' ORDER BY mg.order_index LIMIT 1),
      m.image
    ) as image,
    m.services,
    m.characteristics,
    m.availability,
    m.rating,
    m.reviews,
    COALESCE(m.description, 'Contact us to learn more about our elegant and sophisticated companion services.') as description,
    m.age,
    m.created_at
  FROM public.models m
  WHERE m.availability IS NOT NULL 
    AND (m.members_only = false OR m.members_only IS NULL)
    AND m.name IS NOT NULL 
    AND m.name != ''
    AND LOWER(m.name) NOT LIKE '%teste%'
    AND LOWER(m.name) NOT LIKE '%test%'
    AND m.name != 'Julia'
    AND LENGTH(TRIM(m.name)) > 2
  ORDER BY m.created_at DESC;
$function$;

-- Clean up extra spaces in model names
UPDATE models 
SET name = TRIM(name) 
WHERE name LIKE '% ' OR name LIKE ' %';