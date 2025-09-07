-- SECURITY FIX: Revise RLS policies for profiles table to prevent email exposure
-- Remove conflicting policies and create secure, explicit policies

-- First, drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile except role" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only authenticated users can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- Create new secure policies with explicit authentication checks

-- 1. Users can only view their own profile (authenticated users only)
CREATE POLICY "authenticated_users_own_profile_select" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = id);

-- 2. Users can update their own profile but not role/status (authenticated users only)
CREATE POLICY "authenticated_users_own_profile_update" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND OLD.role = NEW.role 
        AND OLD.status = NEW.status
        AND OLD.approved_by = NEW.approved_by
        AND OLD.approved_at = NEW.approved_at
    );

-- 3. Only allow profile creation through the trigger (authenticated users only)
CREATE POLICY "authenticated_users_create_own_profile" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 4. Admins can view all profiles (must be authenticated AND admin)
CREATE POLICY "admin_users_view_all_profiles" ON public.profiles
    FOR SELECT 
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND public.get_current_user_role() = 'admin'
    );

-- 5. Admins can update any profile including role/status (must be authenticated AND admin)
CREATE POLICY "admin_users_update_all_profiles" ON public.profiles
    FOR UPDATE 
    TO authenticated
    USING (
        auth.uid() IS NOT NULL 
        AND public.get_current_user_role() = 'admin'
    );

-- 6. Admins can create profiles (must be authenticated AND admin)
CREATE POLICY "admin_users_create_profiles" ON public.profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND public.get_current_user_role() = 'admin'
    );

-- 7. Explicitly deny ALL access to anonymous users
CREATE POLICY "deny_anonymous_access" ON public.profiles
    FOR ALL 
    TO anon
    USING (false)
    WITH CHECK (false);

-- Ensure the is_admin function is secure and only works for authenticated users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  END;
$$;

-- Update get_current_user_role function to be more secure
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN NULL
    ELSE (
      SELECT role FROM public.profiles 
      WHERE id = auth.uid()
    )
  END;
$$;