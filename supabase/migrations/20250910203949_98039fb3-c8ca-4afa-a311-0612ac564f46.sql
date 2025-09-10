-- Add gallery_external_urls field to models table
ALTER TABLE public.models 
ADD COLUMN IF NOT EXISTS gallery_external_urls text[] DEFAULT '{}';

-- Verify the structure by updating constraints if needed
COMMENT ON COLUMN public.models.gallery_external_urls IS 'Array of external gallery image URLs';