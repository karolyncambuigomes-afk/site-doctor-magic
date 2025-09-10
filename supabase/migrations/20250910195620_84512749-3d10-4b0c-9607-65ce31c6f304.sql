-- URGENT FIX: Update model image URLs to point to existing .webp files
UPDATE public.models 
SET 
  image = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/' || 
          CASE name
            WHEN 'Kate' THEN 'local-cache/model-kate-main-1200.webp'
            WHEN 'Livia' THEN 'local-cache/model-livia-main-1200.webp'
            WHEN 'Ana' THEN 'local-cache/model-ana-main-1200.webp'
            WHEN 'Carolina' THEN 'local-cache/model-carolina-main-1200.webp'
            WHEN 'Vic' THEN 'local-cache/model-vic-main-1200.webp'
            ELSE 'local-cache/model-kate-main-1200.webp'
          END,
  updated_at = now()
WHERE name IN ('Kate', 'Livia', 'Ana', 'Carolina', 'Vic');

-- Update homepage carousel URLs to match
UPDATE public.homepage_carousel 
SET 
  image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/' || 
             CASE model_name
               WHEN 'Kate' THEN 'local-cache/model-kate-main-1200.webp'
               WHEN 'Livia' THEN 'local-cache/model-livia-main-1200.webp'
               WHEN 'Ana' THEN 'local-cache/model-ana-main-1200.webp'
               WHEN 'Carolina' THEN 'local-cache/model-carolina-main-1200.webp'
               WHEN 'Vic' THEN 'local-cache/model-vic-main-1200.webp'
               ELSE 'local-cache/model-kate-main-1200.webp'
             END,
  updated_at = now()
WHERE model_name IN ('Kate', 'Livia', 'Ana', 'Carolina', 'Vic');