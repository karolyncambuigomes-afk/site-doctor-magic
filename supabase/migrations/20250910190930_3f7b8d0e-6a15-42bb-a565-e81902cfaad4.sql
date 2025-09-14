-- MODELS: Adicionar campos mais específicos
ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS image_url_local_main text,
  ADD COLUMN IF NOT EXISTS gallery_local_urls text[] DEFAULT '{}';

-- HERO_SLIDES: Adicionar campos granulares para diferentes tamanhos  
ALTER TABLE public.hero_slides
  ADD COLUMN IF NOT EXISTS image_url_local_desktop text,
  ADD COLUMN IF NOT EXISTS image_url_local_mobile text,
  ADD COLUMN IF NOT EXISTS image_url_local_fallback text;

-- BLOG_POSTS: Adicionar campo local padronizado
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS image_url_local text;