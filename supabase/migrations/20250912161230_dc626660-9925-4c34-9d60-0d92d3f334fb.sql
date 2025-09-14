-- SECURITY FIX: Set search_path for all security definer functions to prevent SQL injection
-- This fixes the "Function Search Path Mutable" security warnings

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, approved_at, requested_at)
  VALUES (NEW.id, NEW.email, 'user', 'approved', now(), now());
  RETURN NEW;
END;
$function$;

-- Fix handle_profile_updates function
CREATE OR REPLACE FUNCTION public.handle_profile_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow admins to modify sensitive fields
  IF NOT public.is_admin() THEN
    -- Prevent changes to sensitive fields for non-admins
    NEW.role = OLD.role;
    NEW.status = OLD.status;
    NEW.approved_by = OLD.approved_by;
    NEW.approved_at = OLD.approved_at;
  END IF;
  
  -- Always update the updated_at timestamp
  NEW.updated_at = now();
  
  RETURN NEW;
END;
$function$;

-- Fix log_application_submission function
CREATE OR REPLACE FUNCTION public.log_application_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  client_ip inet;
BEGIN
  -- Get client IP from headers if available (Edge Function context)
  client_ip := NULL; -- Will be set by application layer
  
  -- Insert or update rate limiting record
  INSERT INTO public.application_rate_limit (email, ip_address, submission_count, last_submission)
  VALUES (NEW.email, client_ip, 1, now())
  ON CONFLICT (email) 
  DO UPDATE SET 
    submission_count = application_rate_limit.submission_count + 1,
    last_submission = now(),
    ip_address = COALESCE(EXCLUDED.ip_address, application_rate_limit.ip_address);
  
  RETURN NEW;
END;
$function$;

-- Fix sync_main_image_from_gallery function
CREATE OR REPLACE FUNCTION public.sync_main_image_from_gallery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Fix migrate_gallery_arrays_to_table function
CREATE OR REPLACE FUNCTION public.migrate_gallery_arrays_to_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Verify all functions now have proper search_path settings
SELECT 
  proname AS function_name,
  CASE 
    WHEN 'search_path' = ANY(string_to_array(prosecdef, ',')) THEN 'SECURE'
    ELSE 'VULNERABLE'
  END AS security_status
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace 
  AND prosecdef IS NOT NULL
  AND proname IN (
    'handle_new_user', 
    'handle_profile_updates', 
    'log_application_submission',
    'sync_main_image_from_gallery',
    'migrate_gallery_arrays_to_table'
  )
ORDER BY function_name;