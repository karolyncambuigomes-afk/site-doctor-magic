-- Create blog images storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for blog images bucket
CREATE POLICY "Blog images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- Update blog posts with correct image URLs based on slug mappings
UPDATE blog_posts 
SET image = CASE 
  WHEN slug = 'best-restaurants-london-dinner-dates' THEN '/src/assets/blog-restaurant-dining.webp'
  WHEN slug = 'london-annual-events-luxury-experiences' THEN '/src/assets/blog-london-events.webp'
  WHEN slug = 'exclusive-experiences-london-luxury' THEN '/src/assets/blog-exclusive-experiences.webp'
  WHEN slug = 'luxury-hotels-london-sophisticated-stays' THEN '/src/assets/blog-luxury-hotels.webp'
  WHEN slug = 'mayfair-hidden-gems-luxury-lifestyle' THEN '/src/assets/blog-luxury-hotels.webp'
  WHEN slug = 'knightsbridge-after-dark-premium-entertainment' THEN '/src/assets/blog-entertainment-culture.webp'
  WHEN slug = 'business-dining-canary-wharf-executive-choice' THEN '/src/assets/blog-restaurant-dining.webp'
  WHEN slug = 'chelsea-art-culture-sophisticated-experiences' THEN '/src/assets/blog-exclusive-experiences.webp'
  WHEN slug = 'belgravia-exclusive-venues-diplomatic-district' THEN '/src/assets/blog-luxury-hotels.webp'
  WHEN slug = 'kensington-museums-fine-dining-cultural-luxury' THEN '/src/assets/blog-entertainment-culture.webp'
  ELSE '/src/assets/blog-luxury-hotels.webp' -- Default fallback
END
WHERE image IS NULL;