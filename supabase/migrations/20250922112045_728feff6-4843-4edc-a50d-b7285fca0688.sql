-- Encrypt Two-Factor Authentication sensitive data
-- Add encrypted columns for 2FA secrets and backup codes

-- Add encrypted columns to admin_two_factor table
ALTER TABLE admin_two_factor 
ADD COLUMN secret_key_encrypted text,
ADD COLUMN backup_codes_encrypted text;

-- Create function to encrypt 2FA sensitive data
CREATE OR REPLACE FUNCTION encrypt_2fa_data(plain_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF plain_text IS NULL OR plain_text = '' THEN
    RETURN NULL;
  END IF;
  
  -- Use AES encryption with a 2FA-specific key
  RETURN encode(encrypt(plain_text::bytea, '2fa_encryption_key_2025_v1'::bytea, 'aes'), 'base64');
END;
$function$;

-- Create function to decrypt 2FA sensitive data (admin only)
CREATE OR REPLACE FUNCTION decrypt_2fa_data(encrypted_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only allow decryption for admin users
  IF NOT is_admin() THEN
    RETURN '***ENCRYPTED***';
  END IF;
  
  IF encrypted_text IS NULL OR encrypted_text = '' THEN
    RETURN NULL;
  END IF;
  
  RETURN convert_from(decrypt(decode(encrypted_text, 'base64'), '2fa_encryption_key_2025_v1'::bytea, 'aes'), 'UTF8');
EXCEPTION
  WHEN others THEN
    RETURN '***DECRYPTION_ERROR***';
END;
$function$;

-- Create trigger to automatically encrypt 2FA data
CREATE OR REPLACE FUNCTION encrypt_2fa_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Encrypt secret key if provided
  IF NEW.secret_key IS NOT NULL THEN
    NEW.secret_key_encrypted = encrypt_2fa_data(NEW.secret_key);
  END IF;
  
  -- Encrypt backup codes if provided (convert array to string for encryption)
  IF NEW.backup_codes IS NOT NULL THEN
    NEW.backup_codes_encrypted = encrypt_2fa_data(array_to_string(NEW.backup_codes, '|'));
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add trigger to encrypt 2FA data before insert/update
CREATE TRIGGER encrypt_2fa_data_trigger
  BEFORE INSERT OR UPDATE ON admin_two_factor
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_2fa_trigger();

-- Create function to safely get 2FA data (encrypted access only)
CREATE OR REPLACE FUNCTION get_2fa_data_secure(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  result jsonb;
  is_admin_user boolean;
BEGIN
  -- Check admin status
  is_admin_user := is_admin();
  
  -- Log the access attempt
  PERFORM log_admin_action(
    'access_2fa_data',
    'admin_two_factor',
    user_id_param,
    NULL,
    jsonb_build_object('is_admin', is_admin_user, 'timestamp', now()),
    'critical'
  );
  
  -- Only admins can access decrypted 2FA data
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required for 2FA data access';
  END IF;
  
  SELECT jsonb_build_object(
    'id', id,
    'user_id', user_id,
    'is_enabled', is_enabled,
    'secret_key', CASE 
      WHEN secret_key_encrypted IS NOT NULL 
      THEN decrypt_2fa_data(secret_key_encrypted)
      ELSE '***NOT_ENCRYPTED***'
    END,
    'backup_codes', CASE 
      WHEN backup_codes_encrypted IS NOT NULL 
      THEN string_to_array(decrypt_2fa_data(backup_codes_encrypted), '|')
      ELSE backup_codes
    END,
    'last_used', last_used,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO result
  FROM admin_two_factor 
  WHERE user_id = user_id_param;
  
  RETURN COALESCE(result, '{"error": "2FA data not found"}'::jsonb);
END;
$function$;

-- Encrypt existing 2FA data where encrypted columns are null
UPDATE admin_two_factor 
SET 
  secret_key_encrypted = CASE 
    WHEN secret_key IS NOT NULL AND secret_key_encrypted IS NULL 
    THEN encrypt_2fa_data(secret_key) 
    ELSE secret_key_encrypted 
  END,
  backup_codes_encrypted = CASE 
    WHEN backup_codes IS NOT NULL AND backup_codes_encrypted IS NULL 
    THEN encrypt_2fa_data(array_to_string(backup_codes, '|')) 
    ELSE backup_codes_encrypted 
  END;

-- Create function to clean up plaintext 2FA data
CREATE OR REPLACE FUNCTION cleanup_plaintext_2fa_data()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  cleanup_count integer := 0;
BEGIN
  -- Only allow admins to run this cleanup
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can clean up 2FA data';
  END IF;
  
  -- Clear plaintext data where encrypted versions exist
  UPDATE admin_two_factor 
  SET 
    secret_key = CASE WHEN secret_key_encrypted IS NOT NULL THEN NULL ELSE secret_key END,
    backup_codes = CASE WHEN backup_codes_encrypted IS NOT NULL THEN NULL ELSE backup_codes END;
  
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log the cleanup operation
  PERFORM log_admin_action(
    '2fa_cleanup_operation',
    'admin_two_factor',
    NULL,
    NULL,
    jsonb_build_object('records_cleaned', cleanup_count, 'timestamp', now()),
    'critical'
  );
  
  RETURN format('Successfully cleaned plaintext 2FA data from %s records', cleanup_count);
END;
$function$;