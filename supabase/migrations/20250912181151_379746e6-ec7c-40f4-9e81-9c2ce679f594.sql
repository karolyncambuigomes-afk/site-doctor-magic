-- Complete RBAC setup with constraints and all components
-- 1. Add role constraint now that data is clean
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'team', 'member'));

-- 2. Create enhanced permission checking functions
CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles p
    JOIN role_permissions rp ON rp.role = p.role::app_role
    JOIN permissions perm ON perm.id = rp.permission_id
    WHERE p.id = user_id 
    AND perm.name = permission_name
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TABLE(permission_name TEXT, description TEXT, category TEXT)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT perm.name, perm.description, perm.category
  FROM profiles p
  JOIN role_permissions rp ON rp.role = p.role::app_role
  JOIN permissions perm ON perm.id = rp.permission_id
  WHERE p.id = user_id
  ORDER BY perm.category, perm.name;
$$;

-- 3. Create user management functions
CREATE OR REPLACE FUNCTION public.update_user_role_with_audit(
  target_user_id UUID, 
  new_role TEXT,
  admin_notes TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_role TEXT;
  admin_id UUID;
BEGIN
  admin_id := auth.uid();
  IF NOT public.has_permission(admin_id, 'admin.roles.manage') THEN
    RAISE EXCEPTION 'Access denied: Insufficient permissions to manage roles';
  END IF;
  
  IF new_role NOT IN ('admin', 'team', 'member') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;
  
  SELECT role INTO old_role FROM profiles WHERE id = target_user_id;
  IF old_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  UPDATE profiles SET role = new_role, updated_at = now() WHERE id = target_user_id;
  
  INSERT INTO user_management_audit (
    admin_user_id, target_user_id, action, old_values, new_values
  ) VALUES (
    admin_id, target_user_id, 'role_change',
    jsonb_build_object('role', old_role, 'notes', admin_notes),
    jsonb_build_object('role', new_role, 'notes', admin_notes)
  );
END;
$$;

-- 4. Create audit logging function for admin logins
CREATE OR REPLACE FUNCTION public.log_admin_login()
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_management_audit (admin_user_id, action, new_values) 
  VALUES (auth.uid(), 'login_admin', jsonb_build_object('timestamp', now(), 'user_id', auth.uid()));
END;
$$;

-- 5. Create RLS policies for new tables
-- Permissions policies
CREATE POLICY "Authenticated users can view permissions" 
ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage permissions" 
ON public.permissions FOR ALL TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.system.configure'));

-- Role permissions policies
CREATE POLICY "Authenticated users can view role permissions" 
ON public.role_permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage role permissions" 
ON public.role_permissions FOR ALL TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.system.configure'));

-- User management audit policies
CREATE POLICY "Admins can view user management audit" 
ON public.user_management_audit FOR SELECT TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.audit.view'));

-- 6. Create trigger to log profile changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO user_management_audit (admin_user_id, target_user_id, action, old_values, new_values)
    VALUES (auth.uid(), NEW.id, 'role_change_direct',
      jsonb_build_object('role', OLD.role), jsonb_build_object('role', NEW.role));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_profile_role_changes ON profiles;
CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION audit_profile_changes();