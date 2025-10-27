-- Normalizar posts do blog: adicionar imagens padrão e preencher campos vazios
UPDATE blog_posts 
SET 
  image = COALESCE(NULLIF(image, ''), '/og-image.jpg'),
  author = COALESCE(NULLIF(author, ''), 'Five London Team'),
  category = COALESCE(NULLIF(category, ''), 'Lifestyle'),
  read_time = COALESCE(read_time, 5),
  meta_description = COALESCE(NULLIF(meta_description, ''), excerpt),
  seo_keywords = COALESCE(NULLIF(seo_keywords, ''), title)
WHERE 
  is_published = true;