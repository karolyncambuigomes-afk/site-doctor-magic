-- Create preference_categories table for managing Browse by Preference section
CREATE TABLE public.preference_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preference_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage preference categories" 
ON public.preference_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Preference categories are viewable by everyone" 
ON public.preference_categories 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preference_categories_updated_at
BEFORE UPDATE ON public.preference_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing categories from CategoryFilters.tsx
INSERT INTO public.preference_categories (name, path, image_url, image_alt, order_index) VALUES
('Blonde', '/characteristics/blonde-escorts', '/images/model1.jpg', 'Blonde companions in London', 1),
('Brunette', '/characteristics/brunette-escorts', '/images/model2.jpg', 'Brunette companions in London', 2),
('English', '/characteristics/english-escorts', '/images/model3.jpg', 'English companions in London', 3),
('International', '/characteristics/international-escorts', '/images/model4.jpg', 'International companions in London', 4),
('VIP', '/characteristics/vip-escorts', '/images/kate1.jpg', 'VIP companions in London', 5),
('Petite', '/characteristics/petite-escorts', '/images/luisa1.jpg', 'Petite companions in London', 6);