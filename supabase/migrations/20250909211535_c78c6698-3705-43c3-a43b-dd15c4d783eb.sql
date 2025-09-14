-- Adicionar campo para controlar se todas as fotos são públicas
ALTER TABLE models ADD COLUMN all_photos_public BOOLEAN DEFAULT false;

-- Comentário explicativo do novo campo:
-- all_photos_public = true: Todas as fotos ficam visíveis para público e membros
-- members_only = true: Apenas membros veem as fotos
-- members_only = false AND all_photos_public = false: Controle individual por foto (misto)