-- Security Fix for Model Applications Table - Phase 1 (Fixed)
-- Drop policies first, then functions, then recreate everything properly

-- 1. Drop all existing policies on model_applications first
DROP POLICY IF EXISTS "admin_and_super_admin_select" ON public.model_applications;
DROP POLICY IF EXISTS "admin_and_super_admin_update" ON public.model_applications;
DROP POLICY IF EXISTS "admin_and_super_admin_delete" ON public.model_applications;
DROP POLICY IF EXISTS "validated_user_insert_only" ON public.model_applications;

-- 2. Now drop the function that was causing conflicts
DROP FUNCTION IF EXISTS public.log_admin_action(text,text,uuid,jsonb,jsonb,text);

-- 3. Create the missing is_super_admin function
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  END;
$$;