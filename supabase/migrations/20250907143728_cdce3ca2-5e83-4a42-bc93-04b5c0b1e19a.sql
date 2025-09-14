-- Add video support to hero_slides table
ALTER TABLE public.hero_slides 
ADD COLUMN video_url text,
ADD COLUMN media_type text DEFAULT 'image';

-- Update existing records to have media_type as 'image'
UPDATE public.hero_slides 
SET media_type = 'image' 
WHERE media_type IS NULL;