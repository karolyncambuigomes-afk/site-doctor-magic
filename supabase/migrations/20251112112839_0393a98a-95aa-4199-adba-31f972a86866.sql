-- Enable pg_net extension for HTTP requests (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to purge blog cache automatically
CREATE OR REPLACE FUNCTION public.trigger_blog_cache_purge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_slug TEXT;
  purge_urls TEXT[];
  request_id BIGINT;
  function_url TEXT;
BEGIN
  -- Get the slug from the affected post
  IF TG_OP = 'DELETE' THEN
    post_slug := OLD.slug;
  ELSE
    post_slug := NEW.slug;
  END IF;
  
  -- Build the array of URLs to purge
  purge_urls := ARRAY['/blog', '/blog/*', '/blog/' || post_slug];
  
  -- Build the edge function URL
  function_url := 'https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/purge-blog-cache';
  
  -- Make async HTTP POST request to purge cache
  -- Using pg_net for non-blocking execution
  BEGIN
    SELECT INTO request_id extensions.net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'urls', purge_urls
      )
    );
    
    -- Log the cache purge request
    RAISE NOTICE 'Blog cache purge triggered for slug: %, request_id: %', post_slug, request_id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the operation
    RAISE WARNING 'Failed to trigger blog cache purge for slug %: %', post_slug, SQLERRM;
  END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for automatic blog cache purging
DROP TRIGGER IF EXISTS auto_purge_blog_cache ON blog_posts;

CREATE TRIGGER auto_purge_blog_cache
  AFTER INSERT OR UPDATE OR DELETE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_blog_cache_purge();

-- Add comment for documentation
COMMENT ON FUNCTION public.trigger_blog_cache_purge() IS 
  'Automatically triggers blog cache purge (Cloudflare + Prerender.io) when blog posts are created, updated, or deleted';

COMMENT ON TRIGGER auto_purge_blog_cache ON blog_posts IS 
  'Automatically purges blog cache for affected URLs when posts change';