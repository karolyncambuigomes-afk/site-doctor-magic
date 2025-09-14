-- Fix existing blog posts with null published_at
UPDATE blog_posts 
SET published_at = created_at 
WHERE published_at IS NULL AND is_published = true;