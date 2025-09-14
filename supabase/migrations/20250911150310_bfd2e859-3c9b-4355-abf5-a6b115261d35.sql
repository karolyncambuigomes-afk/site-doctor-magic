-- Fix the broken photo URL for VIC's members-only photo
UPDATE model_gallery 
SET image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/models/1757508628601-evb2gdno7ps.jpeg'
WHERE id = '367dc6ae-1cd9-401e-93a3-ee08bf1b6ba3';

-- Reclassify some of VIC's public photos as members_only to create proper separation
UPDATE model_gallery 
SET visibility = 'members_only'
WHERE model_id = (SELECT id FROM models WHERE name ILIKE '%vic%') 
AND visibility = 'public'
AND id IN (
  SELECT id FROM model_gallery 
  WHERE model_id = (SELECT id FROM models WHERE name ILIKE '%vic%') 
  AND visibility = 'public'
  ORDER BY order_index
  LIMIT 6
);