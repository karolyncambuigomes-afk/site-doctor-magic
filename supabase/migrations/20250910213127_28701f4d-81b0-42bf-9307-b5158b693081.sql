-- FASE 1: Criar buckets necessários para o sistema de imagens otimizado

-- Criar bucket optimized-images (público para leitura)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'optimized-images', 
  'optimized-images', 
  true, 
  52428800, -- 50MB
  ARRAY['image/webp', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Criar bucket raw-uploads (público para leitura, para preview imediato)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'raw-uploads', 
  'raw-uploads', 
  true, 
  52428800, -- 50MB
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Policies para optimized-images
CREATE POLICY "Public read access for optimized images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'optimized-images');

CREATE POLICY "Service role can upload optimized images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'optimized-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role can update optimized images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'optimized-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role can delete optimized images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'optimized-images' AND auth.role() = 'service_role');

-- Policies para raw-uploads  
CREATE POLICY "Public read access for raw uploads" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'raw-uploads');

CREATE POLICY "Admins can upload raw images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'raw-uploads' AND 
  (auth.role() = 'service_role' OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admins can update raw images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'raw-uploads' AND 
  (auth.role() = 'service_role' OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admins can delete raw images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'raw-uploads' AND 
  (auth.role() = 'service_role' OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);