-- Add local image fields to support optimized image paths
-- This allows storing both external (Supabase) and local (/images/) paths

-- Add image_local field to models table
ALTER TABLE public.models 
ADD COLUMN image_local text;

-- Add image_url_local field to homepage_carousel table  
ALTER TABLE public.homepage_carousel 
ADD COLUMN image_url_local text;

-- Add image_url_local field to hero_slides table
ALTER TABLE public.hero_slides 
ADD COLUMN image_url_local text;

-- Add image_local field to blog_posts table (if needed for future blog images)
ALTER TABLE public.blog_posts 
ADD COLUMN image_local text;

-- Add comments for clarity
COMMENT ON COLUMN public.models.image_local IS 'Local optimized image path (e.g., /images/models/id/main.webp)';
COMMENT ON COLUMN public.homepage_carousel.image_url_local IS 'Local optimized image path for carousel';
COMMENT ON COLUMN public.hero_slides.image_url_local IS 'Local optimized image path for hero slides';
COMMENT ON COLUMN public.blog_posts.image_local IS 'Local optimized image path for blog posts';