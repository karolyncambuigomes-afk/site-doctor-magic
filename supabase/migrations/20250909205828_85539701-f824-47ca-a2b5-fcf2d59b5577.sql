-- Corrigir visibilidade das fotos da modelo Carolina
-- Definir as duas primeiras fotos como públicas
UPDATE model_gallery 
SET visibility = 'public' 
WHERE model_id = '02268d9b-8fcd-4a9d-ae20-c857997c186a' 
AND order_index IN (0, 1);