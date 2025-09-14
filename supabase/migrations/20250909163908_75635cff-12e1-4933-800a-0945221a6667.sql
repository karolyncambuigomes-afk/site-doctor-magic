-- Corrigir a migration anterior removendo a política problemática e refazendo corretamente

-- Primeiro, remover a política problemática se existir
DROP POLICY IF EXISTS "Everyone can view published reviews" ON public.reviews;

-- Criar política correta para reviews
CREATE POLICY "Everyone can view published reviews" ON public.reviews
  FOR SELECT USING (public.reviews.is_published = true);

-- Adicionar campo rating à tabela models se não existir
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.0;

-- Adicionar campo reviews à tabela models se não existir  
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;