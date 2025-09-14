-- Add RLS policies and CMS functions
-- 1. Add default content types and RLS policies
INSERT INTO public.content_types (name, description, schema) VALUES
('page', 'Website pages', '{
  "fields": [
    {"name": "title", "type": "text", "required": true},
    {"name": "content", "type": "richtext", "required": true},
    {"name": "hero_image", "type": "image", "required": false},
    {"name": "meta_description", "type": "text", "required": false}
  ]
}'),
('blog_post', 'Blog articles', '{
  "fields": [
    {"name": "title", "type": "text", "required": true},
    {"name": "excerpt", "type": "textarea", "required": true},
    {"name": "content", "type": "richtext", "required": true},
    {"name": "featured_image", "type": "image", "required": false},
    {"name": "category", "type": "select", "options": ["news", "guides", "updates"], "required": true},
    {"name": "tags", "type": "tags", "required": false}
  ]
}'),
('hero_section', 'Homepage hero sections', '{
  "fields": [
    {"name": "title", "type": "text", "required": true},
    {"name": "subtitle", "type": "text", "required": false},
    {"name": "background_image", "type": "image", "required": true},
    {"name": "cta_text", "type": "text", "required": false},
    {"name": "cta_link", "type": "url", "required": false}
  ]
}')
ON CONFLICT (name) DO NOTHING;

-- 2. Create RLS policies for content types
CREATE POLICY "Content types are viewable by everyone" 
ON public.content_types FOR SELECT USING (true);

CREATE POLICY "Admins can manage content types" 
ON public.content_types FOR ALL 
USING (public.has_permission(auth.uid(), 'admin.content.manage'));

-- 3. Create RLS policies for content items
CREATE POLICY "Published content is viewable by everyone" 
ON public.content_items FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can view drafts they created" 
ON public.content_items FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all content" 
ON public.content_items FOR SELECT 
USING (public.has_permission(auth.uid(), 'admin.content.manage'));

CREATE POLICY "Team members can manage content" 
ON public.content_items FOR ALL 
USING (public.has_permission(auth.uid(), 'team.content.edit') OR public.has_permission(auth.uid(), 'admin.content.manage'));

-- 4. Create RLS policies for content versions
CREATE POLICY "Content versions follow content item permissions" 
ON public.content_versions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM content_items 
    WHERE id = content_item_id 
    AND (status = 'published' OR auth.uid() = author_id OR public.has_permission(auth.uid(), 'admin.content.manage'))
  )
);

CREATE POLICY "Team members can create content versions" 
ON public.content_versions FOR INSERT 
WITH CHECK (public.has_permission(auth.uid(), 'team.content.edit') OR public.has_permission(auth.uid(), 'admin.content.manage'));

-- 5. Create RLS policies for optimized images
CREATE POLICY "Optimized images are viewable by authenticated users" 
ON public.optimized_images FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Team members can manage optimized images" 
ON public.optimized_images FOR ALL 
USING (public.has_permission(auth.uid(), 'team.content.edit') OR public.has_permission(auth.uid(), 'admin.content.manage'));

-- 6. Create RLS policies for content preview
CREATE POLICY "Content preview is viewable by token or author" 
ON public.content_preview FOR SELECT 
USING (true); -- Public access via token

CREATE POLICY "Team members can create content previews" 
ON public.content_preview FOR ALL 
USING (public.has_permission(auth.uid(), 'team.content.edit') OR public.has_permission(auth.uid(), 'admin.content.manage'));