-- Add new columns for mobile and desktop banner images
ALTER TABLE public.site_content 
ADD COLUMN image_url_desktop TEXT,
ADD COLUMN image_url_mobile TEXT;