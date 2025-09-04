-- Create models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  price TEXT,
  pricing JSONB,
  image TEXT,
  services TEXT[],
  characteristics TEXT[],
  availability TEXT,
  rating DECIMAL(2,1),
  reviews INTEGER,
  description TEXT,
  height TEXT,
  measurements TEXT,
  hair TEXT,
  eyes TEXT,
  nationality TEXT,
  education TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create model gallery table for multiple photos
CREATE TABLE public.model_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for website visitors)
CREATE POLICY "Models are viewable by everyone" 
ON public.models 
FOR SELECT 
USING (true);

CREATE POLICY "Model gallery is viewable by everyone" 
ON public.model_gallery 
FOR SELECT 
USING (true);

-- Create policies for admin access
CREATE POLICY "Admin users can manage models" 
ON public.models 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Admin users can manage model gallery" 
ON public.model_gallery 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Profile policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for model images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('model-images', 'model-images', true);

-- Create storage policies
CREATE POLICY "Model images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'model-images');

CREATE POLICY "Admin users can upload model images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'model-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin users can update model images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'model-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin users can delete model images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'model-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);