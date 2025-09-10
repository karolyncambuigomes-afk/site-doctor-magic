-- Configurar VIC como modelo misto (algumas fotos públicas, outras premium)
UPDATE models 
SET 
  members_only = false,        -- Permite acesso básico a VIC
  all_photos_public = false,   -- Indica que tem conteúdo premium
  face_visible = true          -- Fotos públicas sem blur
WHERE name ILIKE '%vic%';