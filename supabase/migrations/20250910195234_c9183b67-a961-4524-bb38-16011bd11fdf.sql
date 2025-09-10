-- HOTFIX: Safely move local URLs to correct fields and restore external URLs

-- For models table: move local URLs to image_url_local_main and restore externals from Supabase Storage
UPDATE public.models 
SET 
  image_url_local_main = image,
  image = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/' || 
          CASE name
            WHEN 'Kate' THEN 'kate1.jpg'
            WHEN 'Livia' THEN 'luisa1.jpg'
            WHEN 'Ana' THEN 'model1.jpg'
            WHEN 'Carolina' THEN 'model2.jpg'
            WHEN 'Vic' THEN 'model3.jpg'
            ELSE 'model1.jpg'
          END,
  updated_at = now()
WHERE image LIKE '/images/%';

-- For homepage_carousel: move local URLs to image_url_local and restore externals
UPDATE public.homepage_carousel 
SET 
  image_url_local = image_url,
  image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/' || 
             CASE model_name
               WHEN 'Kate' THEN 'kate1.jpg'
               WHEN 'Livia' THEN 'luisa1.jpg'
               ELSE 'model1.jpg'
             END,
  updated_at = now()
WHERE image_url LIKE '/images/%';