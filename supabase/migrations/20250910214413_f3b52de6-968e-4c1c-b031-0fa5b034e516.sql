-- Configurar VIC como modelo exclusivo
UPDATE models 
SET 
  members_only = true,
  all_photos_public = false,
  face_visible = false
WHERE name ILIKE '%vic%';