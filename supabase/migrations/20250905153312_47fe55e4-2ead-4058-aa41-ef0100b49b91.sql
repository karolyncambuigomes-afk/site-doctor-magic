-- Create table for homepage carousel
CREATE TABLE public.homepage_carousel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL,
  model_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_carousel ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage homepage carousel" 
ON public.homepage_carousel 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create policy for public viewing
CREATE POLICY "Homepage carousel is viewable by everyone" 
ON public.homepage_carousel 
FOR SELECT 
USING (is_active = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homepage_carousel_updated_at
BEFORE UPDATE ON public.homepage_carousel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add unique constraint on order_index to prevent duplicates
CREATE UNIQUE INDEX idx_homepage_carousel_order ON public.homepage_carousel(order_index) WHERE is_active = true;