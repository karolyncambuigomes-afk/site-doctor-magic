-- Add service_keywords column to blog_posts table to link blog posts to service features
ALTER TABLE public.blog_posts 
ADD COLUMN service_keywords TEXT[] DEFAULT NULL;

-- Add comment to explain the purpose
COMMENT ON COLUMN public.blog_posts.service_keywords IS 'Array of service feature keywords that should link to this blog post';