-- Create model_applications table
CREATE TABLE public.model_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  date_of_birth DATE,
  nationality TEXT,
  languages TEXT[],
  
  -- Physical Information
  height TEXT,
  measurements TEXT,
  dress_size TEXT,
  shoe_size TEXT,
  hair_color TEXT,
  eye_color TEXT,
  tattoos TEXT,
  piercings TEXT,
  
  -- Experience & Background
  modeling_experience TEXT,
  escort_experience TEXT,
  education TEXT,
  profession TEXT,
  interests TEXT[],
  
  -- Social Media & Contact
  instagram_handle TEXT,
  
  -- Media Files
  photos TEXT[], -- Array of image URLs
  videos TEXT[], -- Array of video URLs
  
  -- Application Details
  motivation TEXT, -- Why they want to join
  availability TEXT, -- When they're available
  location_preference TEXT,
  
  -- Admin Fields
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewing, approved, rejected
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all applications" 
ON public.model_applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can update applications" 
ON public.model_applications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create storage bucket for application media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('model-applications', 'model-applications', false);

-- Storage policies for application media
CREATE POLICY "Anyone can upload application media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'model-applications');

CREATE POLICY "Admins can view application media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'model-applications' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Trigger for updated_at
CREATE TRIGGER update_model_applications_updated_at
BEFORE UPDATE ON public.model_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();