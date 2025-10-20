-- Fix search_path for pgcrypto functions
-- Ensure pgcrypto is in extensions schema and encryption functions can find it

-- 1) Ensure pgcrypto is in the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2) Adjust search_path of all encryption helper functions to include extensions schema
ALTER FUNCTION public.encrypt_sensitive_field(text, text) SET search_path = public, extensions;
ALTER FUNCTION public.decrypt_sensitive_field(text, text) SET search_path = public, extensions;
ALTER FUNCTION public.encrypt_pii_data(text, text)       SET search_path = public, extensions;
ALTER FUNCTION public.decrypt_pii_data(text, text)       SET search_path = public, extensions;
ALTER FUNCTION public.encrypt_2fa_data(text)             SET search_path = public, extensions;
ALTER FUNCTION public.decrypt_2fa_data(text)             SET search_path = public, extensions;