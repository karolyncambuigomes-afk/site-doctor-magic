-- Add homepage carousel fields to models table
ALTER TABLE public.models 
ADD COLUMN show_on_homepage boolean DEFAULT false,
ADD COLUMN homepage_order integer DEFAULT NULL;

-- Create index for homepage queries
CREATE INDEX idx_models_homepage ON public.models(show_on_homepage, homepage_order) WHERE show_on_homepage = true;

-- Migrate existing data from homepage_carousel to models table
UPDATE public.models 
SET 
  show_on_homepage = true,
  homepage_order = hc.order_index
FROM public.homepage_carousel hc 
WHERE models.id = hc.model_id AND hc.is_active = true;

-- Comment on new columns
COMMENT ON COLUMN public.models.show_on_homepage IS 'Whether this model should appear on the homepage carousel';
COMMENT ON COLUMN public.models.homepage_order IS 'Position in the homepage carousel (1, 2, 3, etc.)';