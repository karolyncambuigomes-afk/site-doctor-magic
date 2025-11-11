-- Enable HTTP extension for calling edge functions
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create function to purge blog cache via Edge Function
CREATE OR REPLACE FUNCTION public.purge_blog_cache_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_status integer;
BEGIN
  -- Call the purge-blog-cache edge function
  -- Using async http request to not block the transaction
  PERFORM net.http_post(
    url := 'https://jiegopvbwpyfohhfvmwo.supabase.co/functions/v1/purge-blog-cache',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'urls', ARRAY['/blog', '/blog/*'],
      'trigger', 'database_webhook',
      'operation', TG_OP,
      'post_slug', CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.slug 
        ELSE NEW.slug 
      END
    )
  );
  
  -- Log the cache purge request
  RAISE NOTICE 'Blog cache purge triggered for operation: %, slug: %', 
    TG_OP, 
    CASE WHEN TG_OP = 'DELETE' THEN OLD.slug ELSE NEW.slug END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on blog_posts table
DROP TRIGGER IF EXISTS trigger_purge_blog_cache ON public.blog_posts;

CREATE TRIGGER trigger_purge_blog_cache
AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.purge_blog_cache_webhook();