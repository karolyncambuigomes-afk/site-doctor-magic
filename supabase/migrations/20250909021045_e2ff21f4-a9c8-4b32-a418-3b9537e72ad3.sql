-- 1. Atualizar campo image da Livia com primeira imagem da galeria
UPDATE models 
SET image = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757374964208-wfvq5ryuyv.jpeg'
WHERE id = '7a60e995-0daa-423e-9864-050081d11c3f';

-- 2. Atualizar função get_public_models para incluir fallback da galeria
CREATE OR REPLACE FUNCTION public.get_public_models()
 RETURNS TABLE(id uuid, name text, location text, price text, image text, services text[], characteristics text[], availability text, rating numeric, reviews integer, description text, age integer, created_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    m.id,
    split_part(m.name, ' ', 1) as name, -- First name only
    m.location,
    m.price,
    COALESCE(
      m.image, 
      (SELECT mg.image_url FROM model_gallery mg WHERE mg.model_id = m.id ORDER BY mg.order_index LIMIT 1)
    ) as image,
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
$function$;