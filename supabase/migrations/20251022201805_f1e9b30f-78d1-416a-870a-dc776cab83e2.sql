-- Fix Critical Security Issue: Privilege Escalation via profiles.role
-- Create separate user_roles table with proper security

-- 1. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- 2. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for user_roles (only admins can manage roles)
CREATE POLICY "Only admins can view user roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
  )
);

CREATE POLICY "Only admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
  )
);

CREATE POLICY "Only admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
  )
);

CREATE POLICY "Only admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
  )
);

-- 4. Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- 5. Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'::app_role
    )
  END;
$$;

-- 6. Create helper function to check if user is team member
CREATE OR REPLACE FUNCTION public.is_team_secure()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin'::app_role, 'team'::app_role)
    )
  END;
$$;

-- 7. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id,
  CASE 
    WHEN role = 'admin' THEN 'admin'::app_role
    WHEN role = 'super_admin' THEN 'admin'::app_role
    WHEN role = 'team' THEN 'team'::app_role
    WHEN role = 'member' THEN 'member'::app_role
    ELSE 'member'::app_role
  END,
  created_at
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. Update profiles table policies to prevent self-role modification
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (not role)"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
    -- Prevent changing role column
    role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())
    OR is_admin_secure()
  )
);

-- 9. Add audit logging for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  old_role app_role,
  new_role app_role,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET
);

ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view role audit"
ON public.role_change_audit
FOR SELECT
USING (is_admin_secure());

-- 10. Create trigger for role change auditing
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_change_audit (user_id, changed_by, new_role)
    VALUES (NEW.user_id, auth.uid(), NEW.role);
  ELSIF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO public.role_change_audit (user_id, changed_by, old_role, new_role)
    VALUES (NEW.user_id, auth.uid(), OLD.role, NEW.role);
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_change_audit (user_id, changed_by, old_role)
    VALUES (OLD.user_id, auth.uid(), OLD.role);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_user_roles_changes ON public.user_roles;
CREATE TRIGGER audit_user_roles_changes
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.audit_role_changes();

-- 11. Update model_applications RLS to use secure functions
DROP POLICY IF EXISTS "Admins can view all applications" ON public.model_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_delete_applications" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_update_applications" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_only_update_with_audit" ON public.model_applications;
DROP POLICY IF EXISTS "super_admin_only_delete_with_audit" ON public.model_applications;

CREATE POLICY "Admins can view all applications"
ON public.model_applications
FOR SELECT
USING (is_admin_secure());

CREATE POLICY "Admins can update applications"
ON public.model_applications
FOR UPDATE
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

CREATE POLICY "Admins can delete applications"
ON public.model_applications
FOR DELETE
USING (is_admin_secure());