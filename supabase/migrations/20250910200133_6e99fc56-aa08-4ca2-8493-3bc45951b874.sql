-- URGENT FIX: Correct banner hero URLs to point to existing .webp files in bucket
UPDATE public.site_content 
SET 
  image_url_desktop = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/local-cache/hero-banner-vic-1600.webp',
  image_url_mobile = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/local-cache/hero-banner-vic-mobile-1080x1920.webp',
  image_url = 'https://jiegopvbwpyfohhfvmwo.supabase.co/storage/v1/object/public/model-images/local-cache/hero-banner-vic-1200.webp',
  updated_at = now()
WHERE section = 'homepage_hero_main';