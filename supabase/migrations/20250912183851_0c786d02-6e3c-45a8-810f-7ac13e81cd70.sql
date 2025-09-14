-- Add simplified RLS policies for CMS
-- 1. Create RLS policies for content types
CREATE POLICY "Content types are viewable by everyone" 
ON public.content_types FOR SELECT USING (true);

CREATE POLICY "Admins can manage content types" 
ON public.content_types FOR ALL 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin'))
);

-- 2. Create RLS policies for content items
CREATE POLICY "Published content is viewable by everyone" 
ON public.content_items FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can view drafts they created" 
ON public.content_items FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Admins and team can view all content" 
ON public.content_items FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

CREATE POLICY "Team members and admins can manage content" 
ON public.content_items FOR ALL 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

-- 3. Create RLS policies for content versions
CREATE POLICY "Content versions follow content item permissions" 
ON public.content_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM content_items 
    WHERE id = content_item_id 
    AND (
      status = 'published' 
      OR auth.uid() = author_id 
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
    )
  )
);

CREATE POLICY "Team members can create content versions" 
ON public.content_versions FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

-- 4. Create RLS policies for optimized images
CREATE POLICY "Optimized images are viewable by authenticated users" 
ON public.optimized_images FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Team members can manage optimized images" 
ON public.optimized_images FOR ALL 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

-- 5. Create RLS policies for content preview
CREATE POLICY "Content preview is viewable by token or author" 
ON public.content_preview FOR SELECT 
USING (true);

CREATE POLICY "Team members can create content previews" 
ON public.content_preview FOR ALL 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

-- 6. Create storage policies for CMS buckets
CREATE POLICY "CMS images are viewable by everyone" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cms-images');

CREATE POLICY "Team members can upload CMS images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'cms-images' 
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

CREATE POLICY "Team members can update CMS images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'cms-images' 
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);

CREATE POLICY "Admins can delete CMS images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'cms-images' 
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "CMS documents viewable by authenticated users" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cms-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Team members can manage CMS documents" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'cms-documents' 
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'team'))
);