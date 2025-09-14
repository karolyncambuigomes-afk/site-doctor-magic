-- Update Livia's image in homepage carousel to use her real photo from Supabase Storage
UPDATE public.homepage_carousel 
SET image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757374964208-wfvq5ryuyv.jpeg',
    updated_at = now()
WHERE model_name = 'Livia' AND image_url = '/src/assets/model1.jpg';