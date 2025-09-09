-- Fix the search path security issue for the SEO function
DROP FUNCTION IF EXISTS public.update_seo_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_seo_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;