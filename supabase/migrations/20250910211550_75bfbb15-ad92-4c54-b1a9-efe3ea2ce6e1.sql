-- Fix Anastasia's gallery URLs from relative to absolute external URLs
UPDATE public.models 
SET gallery_external_urls = ARRAY[
  'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/model-d851677c-b1cc-43ac-bb9a-a65f83bf9e5b-gallery-new-1757535997631.jpeg',
  'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/model-d851677c-b1cc-43ac-bb9a-a65f83bf9e5b-gallery-new-1757536402186.jpeg'
] 
WHERE id = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b' AND name = 'Anastasia';

-- Verify the update
SELECT id, name, gallery_external_urls, gallery_local_urls 
FROM public.models 
WHERE name = 'Anastasia';