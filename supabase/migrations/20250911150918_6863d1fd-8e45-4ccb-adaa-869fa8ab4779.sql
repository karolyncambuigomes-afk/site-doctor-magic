-- Fix the broken photo URLs for TESTE 1 model
-- Update public photo (id: 382eae66-22a4-46d8-89cd-6fc4fb2727ba)
UPDATE model_gallery 
SET image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757603061905-1vrd9wwen2u.jpeg'
WHERE id = '382eae66-22a4-46d8-89cd-6fc4fb2727ba';

-- Update members_only photo (id: ace3cf13-23fc-45ac-bda4-b5b32451d242)
UPDATE model_gallery 
SET image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757603085648-tf0rw0iolkl.jpeg'
WHERE id = 'ace3cf13-23fc-45ac-bda4-b5b32451d242';

-- Check for other photos with broken local URLs and fix them
UPDATE model_gallery 
SET image_url = REPLACE(image_url, '/images/', 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/')
WHERE image_url LIKE '/images/%';