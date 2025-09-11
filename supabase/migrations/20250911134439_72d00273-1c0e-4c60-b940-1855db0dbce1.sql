-- Create site_banners table following model_gallery pattern
CREATE TABLE public.site_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'hero', 'about', 'services', etc.
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'public', -- 'public', 'admin_only'
  device_type TEXT DEFAULT 'all', -- 'desktop', 'mobile', 'all'
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin users can manage site banners" 
ON public.site_banners 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create policy for public viewing
CREATE POLICY "Site banners are viewable by everyone" 
ON public.site_banners 
FOR SELECT 
USING (is_active = true AND visibility = 'public');