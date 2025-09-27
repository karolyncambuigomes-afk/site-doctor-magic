-- Security Fix for Model Applications Table - Complete Reset
-- Drop everything with CASCADE and rebuild from scratch

-- 1. Drop the function with CASCADE to remove all dependent policies
DROP FUNCTION IF EXISTS public.log_admin_action(text,text,uuid,jsonb,jsonb,text) CASCADE;

-- 2. Ensure RLS is still enabled
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;

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

-- 4. Create enhanced admin action logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  resource_type text,
  resource_id uuid,
  old_values jsonb DEFAULT NULL,
  new_values jsonb DEFAULT NULL,
  risk_level text DEFAULT 'medium'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    risk_level,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    risk_level,
    inet_client_addr(),
    'database_function',
    now()
  );
END;
$$;