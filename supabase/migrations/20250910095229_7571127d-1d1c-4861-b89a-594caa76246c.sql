-- Create optimized image storage buckets and policies

-- Create buckets for different image sizes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('model-images-original', 'model-images-original', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('model-images-optimized', 'model-images-optimized', true, 5242880, ARRAY['image/jpeg', 'image/webp']::text[]),
  ('preference-category-images', 'preference-category-images', true, 2097152, ARRAY['image/jpeg', 'image/webp']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies for original model images (admin only)
CREATE POLICY "Admin can upload original model images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'model-images-original' AND
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin can view original model images" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'model-images-original' AND
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin can delete original model images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'model-images-original' AND
  auth.jwt() ->> 'role' = 'admin'
);

-- Policies for optimized model images (public read)
CREATE POLICY "Anyone can view optimized model images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'model-images-optimized');

CREATE POLICY "Admin can upload optimized model images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'model-images-optimized' AND
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admin can delete optimized model images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'model-images-optimized' AND
  auth.jwt() ->> 'role' = 'admin'
);

-- Policies for preference category images (public read)
CREATE POLICY "Anyone can view preference category images" ON storage.objects
FOR SELECT 
USING (bucket_id = 'preference-category-images');

CREATE POLICY "Admin can manage preference category images" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'preference-category-images' AND
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  bucket_id = 'preference-category-images' AND
  auth.jwt() ->> 'role' = 'admin'
);

-- Function to generate optimized image variants
CREATE OR REPLACE FUNCTION public.generate_image_variants(
  original_bucket TEXT,
  original_path TEXT,
  optimized_bucket TEXT
)
RETURNS TABLE (
  variant_name TEXT,
  variant_path TEXT,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  file_extension TEXT;
  base_name TEXT;
  variant_sizes TEXT[] := ARRAY['thumbnail_200x300', 'small_400x600', 'medium_800x1200', 'large_1200x1800'];
  variant TEXT;
  new_path TEXT;
BEGIN
  -- Extract file info
  file_extension := split_part(original_path, '.', -1);
  base_name := split_part(original_path, '.', 1);
  
  -- Generate variants for each size
  FOREACH variant IN ARRAY variant_sizes
  LOOP
    new_path := base_name || '_' || variant || '.webp';
    
    -- This would typically integrate with an image processing service
    -- For now, we'll just track the expected paths
    variant_name := variant;
    variant_path := new_path;
    status := 'pending';
    
    RETURN NEXT;
  END LOOP;
  
  RETURN;
END;
$$;

-- Function to get optimized image URL
CREATE OR REPLACE FUNCTION public.get_optimized_image_url(
  original_url TEXT,
  size_variant TEXT DEFAULT 'medium',
  format TEXT DEFAULT 'webp',
  quality INTEGER DEFAULT 80
)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  base_url TEXT;
  optimized_url TEXT;
BEGIN
  -- Extract base URL without extension
  base_url := regexp_replace(original_url, '\.[^.]+$', '');
  
  -- Construct optimized URL with Supabase transformations
  optimized_url := base_url || 
    '?resize=' || 
    CASE size_variant
      WHEN 'thumbnail' THEN '200x300'
      WHEN 'small' THEN '400x600'
      WHEN 'medium' THEN '800x1200'
      WHEN 'large' THEN '1200x1800'
      ELSE '800x1200'
    END ||
    '&format=' || format ||
    '&quality=' || quality::TEXT;
    
  RETURN optimized_url;
END;
$$;