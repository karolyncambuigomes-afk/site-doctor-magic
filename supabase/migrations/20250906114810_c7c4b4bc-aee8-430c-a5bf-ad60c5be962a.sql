-- Add RLS policies for hero_slides to allow public access
CREATE POLICY "Hero slides are viewable by everyone" 
ON public.hero_slides 
FOR SELECT 
USING (active = true);

-- Add RLS policies for hero_settings to allow public access  
CREATE POLICY "Hero settings are viewable by everyone"
ON public.hero_settings
FOR SELECT
USING (true);