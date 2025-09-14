-- Corrigir configuração de visibilidade das fotos da modelo Carolina
-- Definir as fotos com order_index 0 e 1 como públicas
UPDATE model_gallery 
SET visibility = 'public' 
WHERE model_id = '02268d9b-8fcd-4a9d-ae20-c857997c186a' 
AND order_index IN (0, 1);

-- Garantir que as outras fotos sejam exclusivas para membros
UPDATE model_gallery 
SET visibility = 'members_only' 
WHERE model_id = '02268d9b-8fcd-4a9d-ae20-c857997c186a' 
AND order_index NOT IN (0, 1);