-- Update Anastasia with her first gallery image (public version)
UPDATE models 
SET image = '/images/model-d851677c-b1cc-43ac-bb9a-a65f83bf9e5b-gallery-new-1757536402186.jpeg',
    updated_at = now()
WHERE id = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';

-- Update Julia model with her first gallery image if available
UPDATE models 
SET image = (
  SELECT mg.image_url 
  FROM model_gallery mg 
  WHERE mg.model_id = models.id 
  ORDER BY mg.order_index ASC 
  LIMIT 1
),
updated_at = now()
WHERE id = '0018eb02-4175-4eef-9f8f-fb7e7e68f55e' 
AND (image IS NULL OR image = '');