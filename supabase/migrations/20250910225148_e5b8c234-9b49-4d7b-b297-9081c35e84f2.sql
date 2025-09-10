-- Migration to sync existing gallery arrays to model_gallery table
-- This will help transition from array-based gallery to structured table

-- Function to migrate gallery data from arrays to model_gallery table
CREATE OR REPLACE FUNCTION migrate_gallery_arrays_to_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  model_record RECORD;
  external_url TEXT;
  local_url TEXT;
  url_index INTEGER;
BEGIN
  -- Loop through all models that have gallery arrays
  FOR model_record IN 
    SELECT id, gallery_external_urls, gallery_local_urls 
    FROM models 
    WHERE gallery_external_urls IS NOT NULL AND array_length(gallery_external_urls, 1) > 0
  LOOP
    -- Clear any existing gallery entries for this model first
    DELETE FROM model_gallery WHERE model_id = model_record.id;
    
    -- Insert each URL from the arrays into model_gallery
    FOR url_index IN 1..array_length(model_record.gallery_external_urls, 1) LOOP
      external_url := model_record.gallery_external_urls[url_index];
      local_url := NULL;
      
      -- Get corresponding local URL if it exists
      IF model_record.gallery_local_urls IS NOT NULL 
         AND url_index <= array_length(model_record.gallery_local_urls, 1) THEN
        local_url := model_record.gallery_local_urls[url_index];
      END IF;
      
      -- Use local URL if available, otherwise external URL
      INSERT INTO model_gallery (
        model_id, 
        image_url, 
        order_index, 
        visibility,
        caption
      ) VALUES (
        model_record.id,
        COALESCE(local_url, external_url),
        url_index - 1, -- Convert to 0-based index
        'public',      -- Default to public visibility
        'Image ' || url_index
      );
    END LOOP;
    
    -- Update the model's main image to be the first gallery image if it doesn't have one
    IF model_record.gallery_external_urls IS NOT NULL 
       AND array_length(model_record.gallery_external_urls, 1) > 0 THEN
      
      -- Get the first image from gallery
      DECLARE
        first_gallery_url TEXT;
      BEGIN
        SELECT image_url INTO first_gallery_url 
        FROM model_gallery 
        WHERE model_id = model_record.id 
        ORDER BY order_index 
        LIMIT 1;
        
        -- Update model's main image if it's empty or missing
        UPDATE models 
        SET image = COALESCE(image, first_gallery_url)
        WHERE id = model_record.id;
      END;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Gallery migration completed successfully';
END;
$$;

-- Run the migration
SELECT migrate_gallery_arrays_to_table();

-- Add trigger to sync main image when gallery order changes
CREATE OR REPLACE FUNCTION sync_main_image_from_gallery()
RETURNS TRIGGER AS $$
BEGIN
  -- When a gallery image is updated or inserted with order_index = 0
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.order_index = 0 THEN
    UPDATE models 
    SET image = NEW.image_url 
    WHERE id = NEW.model_id;
  END IF;
  
  -- When a gallery image is deleted and it was the main image
  IF TG_OP = 'DELETE' AND OLD.order_index = 0 THEN
    -- Set the next image as main image
    UPDATE models 
    SET image = (
      SELECT image_url 
      FROM model_gallery 
      WHERE model_id = OLD.model_id 
      ORDER BY order_index 
      LIMIT 1
    )
    WHERE id = OLD.model_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic main image sync
DROP TRIGGER IF EXISTS sync_main_image_trigger ON model_gallery;
CREATE TRIGGER sync_main_image_trigger
  AFTER INSERT OR UPDATE OR DELETE ON model_gallery
  FOR EACH ROW
  EXECUTE FUNCTION sync_main_image_from_gallery();