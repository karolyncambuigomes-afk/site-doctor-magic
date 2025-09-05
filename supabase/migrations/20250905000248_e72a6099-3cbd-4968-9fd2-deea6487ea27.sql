-- Create site_content table for managing website content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE, -- 'hero', 'about', 'services', etc.
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  image_alt TEXT,
  button_text TEXT,
  button_url TEXT,
  meta_data JSONB, -- for additional flexible data
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Site content is viewable by everyone" 
ON public.site_content 
FOR SELECT 
USING (is_active = true);

-- Create policies for admin access
CREATE POLICY "Admin users can manage site content" 
ON public.site_content 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content for key sections
INSERT INTO public.site_content (section, title, subtitle, content, image_url, button_text, button_url) VALUES
(
  'hero',
  'Five London',
  'Premier Luxury Companion Services',
  'Experience the pinnacle of sophistication with our exclusive collection of elite companions. Each model embodies elegance, intelligence, and discretion for the most discerning clientele.',
  '/images/hero-elegant-woman.jpg',
  'Explore Our Models',
  '/models'
),
(
  'about_intro',
  'About Five London',
  'Excellence in Every Detail',
  'Five London represents the epitome of luxury companion services in the heart of London. We pride ourselves on providing sophisticated, intelligent, and elegant companions for the most discerning clientele.',
  '/images/about-luxury-1.jpg',
  'Learn More',
  '/contact'
),
(
  'about_mission',
  'Our Mission',
  'Redefining Luxury Experiences',
  'We are committed to delivering unparalleled experiences through our carefully selected companions. Each member of our exclusive collection embodies sophistication, intelligence, and discretion.',
  '/images/about-luxury-2.jpg',
  '',
  ''
),
(
  'about_values',
  'Our Values',
  'Discretion, Elegance, Excellence',
  'Privacy and discretion are paramount in everything we do. We maintain the highest standards of professionalism while ensuring every encounter is memorable and refined.',
  '/images/about-luxury-3.jpg',
  '',
  ''
);