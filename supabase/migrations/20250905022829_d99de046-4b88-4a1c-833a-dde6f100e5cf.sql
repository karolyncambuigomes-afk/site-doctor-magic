-- Create public gallery table for managing which images appear in the public gallery
CREATE TABLE public.public_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  model_id UUID NOT NULL,
  model_name TEXT NOT NULL,
  caption TEXT,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage public gallery" 
ON public.public_gallery 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Public gallery is viewable by everyone" 
ON public.public_gallery 
FOR SELECT 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_public_gallery_updated_at
BEFORE UPDATE ON public.public_gallery
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();