-- Fix the search path security issue by setting it explicitly
DROP FUNCTION IF EXISTS public.fetch_migration_items(TEXT);

CREATE OR REPLACE FUNCTION public.fetch_migration_items(query_text TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  model_name TEXT, 
  title TEXT,
  slug TEXT,
  category TEXT,
  image_url TEXT,
  image TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- This function allows dynamic queries for migration purposes
  -- Only accessible by admins
  IF NOT (EXISTS (SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin')) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Execute the provided query
  RETURN QUERY EXECUTE query_text;
END;
$$;