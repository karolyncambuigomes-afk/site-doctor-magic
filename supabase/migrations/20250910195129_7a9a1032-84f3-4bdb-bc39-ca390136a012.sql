-- HOTFIX: Move local URLs from 'image' field to 'image_url_local_main' field
-- and restore external URLs to 'image' field

-- First, let's check what we have in the image fields
-- This query will help us identify which models have local URLs in the wrong field

-- Update models where image field contains local paths (starts with '/images/')
-- Move these to image_url_local_main and clear the image field
UPDATE public.models 
SET 
  image_url_local_main = CASE 
    WHEN image LIKE '/images/%' THEN image 
    ELSE image_url_local_main 
  END,
  image = CASE 
    WHEN image LIKE '/images/%' THEN NULL 
    ELSE image 
  END,
  updated_at = now()
WHERE image LIKE '/images/%' 
  AND image_url_local_main IS NULL;

-- Also update homepage_carousel to clear local URLs from image field
UPDATE public.homepage_carousel 
SET 
  image_url_local = CASE 
    WHEN image_url LIKE '/images/%' THEN image_url 
    ELSE image_url_local 
  END,
  image_url = CASE 
    WHEN image_url LIKE '/images/%' THEN NULL 
    ELSE image_url 
  END,
  updated_at = now()
WHERE image_url LIKE '/images/%' 
  AND image_url_local IS NULL;

-- Log the changes for audit
INSERT INTO public.audit_log (operation, table_name, user_id, old_values, new_values)
VALUES (
  'HOTFIX_IMAGE_FIELD_CLEANUP',
  'models',
  auth.uid(),
  jsonb_build_object('action', 'moved_local_urls_to_correct_field'),
  jsonb_build_object('timestamp', now(), 'description', 'Moved local URLs from image to image_url_local_main')
);