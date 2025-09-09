-- Criar tabela para reviews de modelos (separada da tabela reviews existente)
CREATE TABLE IF NOT EXISTS public.model_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela model_reviews
ALTER TABLE public.model_reviews ENABLE ROW LEVEL SECURITY;

-- Criar políticas para model_reviews
CREATE POLICY "Everyone can view published model reviews" ON public.model_reviews
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage model reviews" ON public.model_reviews
  FOR ALL USING (public.is_admin());

-- Criar trigger para updated_at na tabela model_reviews
CREATE TRIGGER update_model_reviews_updated_at
  BEFORE UPDATE ON public.model_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();