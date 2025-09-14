-- Drop the triggers first, then recreate the function with proper search path
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON public.seo_settings;
DROP TRIGGER IF EXISTS update_page_seo_updated_at ON public.page_seo;
DROP TRIGGER IF EXISTS update_seo_templates_updated_at ON public.seo_templates;

-- Drop and recreate the function with proper security
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

-- Recreate the triggers
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();

CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();

CREATE TRIGGER update_seo_templates_updated_at
BEFORE UPDATE ON public.seo_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_seo_updated_at_column();