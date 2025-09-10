-- Add hero_version field to site_content table for banner versioning
ALTER TABLE public.site_content 
ADD COLUMN hero_version INTEGER DEFAULT 1;

-- Update existing hero records to use /images/ proxy URLs instead of direct Supabase URLs
UPDATE public.site_content 
SET 
  image_url_local_desktop = '/images/hero/hero-banner-vic-1600.webp',
  image_url_local_mobile = '/images/hero/hero-banner-vic-mobile-1080x1920.webp', 
  image_url_local_fallback = '/images/hero/hero-banner-vic-1200.webp',
  hero_version = 1,
  updated_at = now()
WHERE section = 'homepage_hero_main';