-- Create table for hero slides
CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT DEFAULT 'View Our Models',
  button_link TEXT DEFAULT '/models',
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for hero settings
CREATE TABLE public.hero_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_play BOOLEAN DEFAULT true,
  slide_duration INTEGER DEFAULT 5000,
  show_dots BOOLEAN DEFAULT true,
  show_scroll_indicator BOOLEAN DEFAULT true,
  overlay_opacity INTEGER DEFAULT 30,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_slides (admin only)
CREATE POLICY "Admins can view hero slides" 
ON public.hero_slides 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can create hero slides" 
ON public.hero_slides 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update hero slides" 
ON public.hero_slides 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can delete hero slides" 
ON public.hero_slides 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create policies for hero_settings (admin only)
CREATE POLICY "Admins can view hero settings" 
ON public.hero_settings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update hero settings" 
ON public.hero_settings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_settings_updated_at
BEFORE UPDATE ON public.hero_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero settings
INSERT INTO public.hero_settings (auto_play, slide_duration, show_dots, show_scroll_indicator, overlay_opacity)
VALUES (true, 5000, true, true, 30);

-- Insert some example slides
INSERT INTO public.hero_slides (title, subtitle, image_url, button_text, button_link, order_index, active) VALUES
('Five London', 'Sophisticated Companions in London', '/images/model1.jpg', 'View Our Models', '/models', 0, true),
('Sophisticated Elegance', 'Exclusive experiences in London', '/images/model2.jpg', 'View Our Models', '/models', 1, true),
('Discretion & Quality', 'Unparalleled companion services', '/images/model3.jpg', 'Contact Us', 'https://wa.me/447436190679', 2, true),
('Exceptional Standards', 'Where luxury meets sophistication', '/images/model4.jpg', 'View Our Models', '/models', 3, true);