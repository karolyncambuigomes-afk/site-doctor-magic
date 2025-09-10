-- Complete gallery data migration from model_gallery to gallery_external_urls arrays
-- This will migrate all existing gallery photos to the new unified system

-- Update models table with gallery data from model_gallery table
UPDATE public.models 
SET gallery_external_urls = COALESCE(
  (
    SELECT array_agg(mg.image_url ORDER BY mg.order_index)
    FROM public.model_gallery mg 
    WHERE mg.model_id = models.id
  ), 
  '{}'::text[]
)
WHERE id IN (
  SELECT DISTINCT model_id 
  FROM public.model_gallery
);

-- Verify migration results
-- This query will show the migration status
SELECT 
  m.id,
  m.name,
  array_length(m.gallery_external_urls, 1) as migrated_photos,
  (
    SELECT count(*) 
    FROM public.model_gallery mg 
    WHERE mg.model_id = m.id
  ) as original_photos
FROM public.models m
WHERE array_length(m.gallery_external_urls, 1) > 0 
   OR EXISTS (
     SELECT 1 FROM public.model_gallery mg WHERE mg.model_id = m.id
   )
ORDER BY m.name;