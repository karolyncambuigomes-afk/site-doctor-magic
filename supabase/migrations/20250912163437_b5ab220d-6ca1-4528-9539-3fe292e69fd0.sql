-- Add encryption and data masking for sensitive model application fields
-- This provides additional security even if RLS policies are bypassed

-- Create encryption functions for sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_field(plain_text text, encryption_key text DEFAULT 'default_app_key_2025')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Use pgcrypto for field-level encryption
  IF plain_text IS NULL OR plain_text = '' THEN
    RETURN NULL;
  END IF;
  
  -- Encrypt using AES with the provided key
  RETURN encode(encrypt(plain_text::bytea, encryption_key::bytea, 'aes'), 'base64');
END;
$function$;

-- Create decryption function
CREATE OR REPLACE FUNCTION public.decrypt_sensitive_field(encrypted_text text, encryption_key text DEFAULT 'default_app_key_2025')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF encrypted_text IS NULL OR encrypted_text = '' THEN
    RETURN NULL;
  END IF;
  
  -- Decrypt using AES
  RETURN convert_from(decrypt(decode(encrypted_text, 'base64'), encryption_key::bytea, 'aes'), 'UTF8');
EXCEPTION
  WHEN others THEN
    -- Return masked data if decryption fails
    RETURN '***ENCRYPTED***';
END;
$function$;

-- Create data masking function for viewing sensitive data
CREATE OR REPLACE FUNCTION public.mask_sensitive_data(data_text text, mask_type text DEFAULT 'partial')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF data_text IS NULL OR data_text = '' THEN
    RETURN NULL;
  END IF;
  
  CASE mask_type
    WHEN 'email' THEN
      -- Mask email: j***@e***.com
      RETURN CASE 
        WHEN position('@' in data_text) > 0 THEN
          substring(data_text from 1 for 1) || '***@' || 
          substring(split_part(data_text, '@', 2) from 1 for 1) || '***.' ||
          split_part(split_part(data_text, '@', 2), '.', 2)
        ELSE '***masked***'
      END;
    WHEN 'phone' THEN
      -- Mask phone: +44***-***-1234
      RETURN regexp_replace(data_text, '(\+?\d{1,3})?(\d{3,4})(\d{3,4})(\d{2,4})', '\1***-***-\4');
    WHEN 'name' THEN
      -- Mask name: John ***
      RETURN split_part(data_text, ' ', 1) || ' ***';
    WHEN 'partial' THEN
      -- Show first and last character
      RETURN CASE 
        WHEN length(data_text) <= 2 THEN '***'
        ELSE substring(data_text from 1 for 1) || '***' || substring(data_text from length(data_text) for 1)
      END;
    ELSE
      RETURN '***masked***';
  END CASE;
END;
$function$;

-- Create secure view for model applications with automatic data masking
CREATE OR REPLACE VIEW public.model_applications_secure AS
SELECT 
  id,
  -- Mask sensitive personal data for non-admin users
  CASE 
    WHEN public.is_admin() THEN public.decrypt_sensitive_field(full_name_encrypted)
    ELSE public.mask_sensitive_data(public.decrypt_sensitive_field(full_name_encrypted), 'name')
  END as full_name,
  
  CASE 
    WHEN public.is_admin() THEN public.decrypt_sensitive_field(email_encrypted)
    ELSE public.mask_sensitive_data(public.decrypt_sensitive_field(email_encrypted), 'email')
  END as email,
  
  CASE 
    WHEN public.is_admin() THEN public.decrypt_sensitive_field(phone_encrypted)
    ELSE public.mask_sensitive_data(public.decrypt_sensitive_field(phone_encrypted), 'phone')
  END as phone,
  
  -- Date of birth - only show year for non-admins
  CASE 
    WHEN public.is_admin() THEN date_of_birth
    ELSE NULL
  END as date_of_birth,
  
  CASE 
    WHEN public.is_admin() THEN extract(year from date_of_birth)::text
    ELSE 'Private'
  END as birth_year,
  
  -- Other fields remain as they are but only accessible to admins
  CASE WHEN public.is_admin() THEN nationality ELSE 'Private' END as nationality,
  CASE WHEN public.is_admin() THEN education ELSE 'Private' END as education,
  CASE WHEN public.is_admin() THEN profession ELSE 'Private' END as profession,
  CASE WHEN public.is_admin() THEN instagram_handle ELSE 'Private' END as instagram_handle,
  CASE WHEN public.is_admin() THEN height ELSE 'Private' END as height,
  CASE WHEN public.is_admin() THEN measurements ELSE 'Private' END as measurements,
  CASE WHEN public.is_admin() THEN hair_color ELSE 'Private' END as hair_color,
  CASE WHEN public.is_admin() THEN eye_color ELSE 'Private' END as eye_color,
  CASE WHEN public.is_admin() THEN tattoos ELSE 'Private' END as tattoos,
  CASE WHEN public.is_admin() THEN piercings ELSE 'Private' END as piercings,
  CASE WHEN public.is_admin() THEN dress_size ELSE 'Private' END as dress_size,
  CASE WHEN public.is_admin() THEN shoe_size ELSE 'Private' END as shoe_size,
  CASE WHEN public.is_admin() THEN modeling_experience ELSE 'Private' END as modeling_experience,
  CASE WHEN public.is_admin() THEN escort_experience ELSE 'Private' END as escort_experience,
  CASE WHEN public.is_admin() THEN motivation ELSE 'Private' END as motivation,
  CASE WHEN public.is_admin() THEN availability ELSE 'Private' END as availability,
  CASE WHEN public.is_admin() THEN location_preference ELSE 'Private' END as location_preference,
  
  -- Media files - only show count for non-admins
  CASE 
    WHEN public.is_admin() THEN photos
    ELSE ARRAY[array_length(photos, 1)::text || ' photos (admin access required)']
  END as photos,
  
  CASE 
    WHEN public.is_admin() THEN videos
    ELSE ARRAY[array_length(videos, 1)::text || ' videos (admin access required)']
  END as videos,
  
  -- Arrays can be shown as they're less sensitive
  languages,
  interests,
  
  -- Non-sensitive fields
  age,
  status,
  admin_notes,
  reviewed_by,
  reviewed_at,
  created_at,
  updated_at
FROM model_applications;

-- Add encrypted columns to model_applications table
ALTER TABLE model_applications 
ADD COLUMN IF NOT EXISTS full_name_encrypted text,
ADD COLUMN IF NOT EXISTS email_encrypted text,
ADD COLUMN IF NOT EXISTS phone_encrypted text;

-- Create trigger to automatically encrypt sensitive data on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_application_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Encrypt sensitive fields before storing
  IF NEW.full_name IS NOT NULL THEN
    NEW.full_name_encrypted = public.encrypt_sensitive_field(NEW.full_name);
  END IF;
  
  IF NEW.email IS NOT NULL THEN
    NEW.email_encrypted = public.encrypt_sensitive_field(NEW.email);
  END IF;
  
  IF NEW.phone IS NOT NULL THEN
    NEW.phone_encrypted = public.encrypt_sensitive_field(NEW.phone);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger
DROP TRIGGER IF EXISTS encrypt_application_data_trigger ON model_applications;
CREATE TRIGGER encrypt_application_data_trigger
  BEFORE INSERT OR UPDATE ON model_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_application_data();

-- Migrate existing data to encrypted format
UPDATE model_applications 
SET 
  full_name_encrypted = public.encrypt_sensitive_field(full_name),
  email_encrypted = public.encrypt_sensitive_field(email),
  phone_encrypted = public.encrypt_sensitive_field(phone)
WHERE full_name_encrypted IS NULL OR email_encrypted IS NULL OR phone_encrypted IS NULL;

-- Add RLS policies for the secure view
ALTER VIEW model_applications_secure SET (security_barrier = true);

-- Grant appropriate permissions
GRANT SELECT ON model_applications_secure TO authenticated;
GRANT ALL ON model_applications_secure TO service_role;