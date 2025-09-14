-- Add local image URL fields to site_content table
ALTER TABLE site_content 
ADD COLUMN image_url_local_desktop TEXT,
ADD COLUMN image_url_local_mobile TEXT,
ADD COLUMN image_url_local_fallback TEXT;