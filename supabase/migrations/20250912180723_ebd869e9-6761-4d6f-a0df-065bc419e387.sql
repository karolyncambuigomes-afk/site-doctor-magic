-- Create RBAC System with Admin, Team, Member roles
-- 1. Update role enum to include new roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'member';

-- 2. Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(role, permission_id)
);

-- 4. Create user management audit log
CREATE TABLE IF NOT EXISTS public.user_management_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id),
    target_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- 'role_change', 'user_create', 'user_delete', 'login_admin'
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_management_audit ENABLE ROW LEVEL SECURITY;

-- 5. Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
-- Admin permissions
('admin.users.manage', 'Create, update, delete users', 'admin'),
('admin.roles.manage', 'Assign and remove user roles', 'admin'),
('admin.system.configure', 'Configure system settings', 'admin'),
('admin.audit.view', 'View audit logs and security events', 'admin'),
('admin.content.manage', 'Manage site content and blog posts', 'admin'),
('admin.models.manage', 'Manage model profiles and applications', 'admin'),

-- Team permissions  
('team.models.view', 'View model applications and profiles', 'team'),
('team.content.edit', 'Edit content and blog posts', 'team'),
('team.reviews.moderate', 'Moderate and approve reviews', 'team'),
('team.analytics.view', 'View analytics and reports', 'team'),

-- Member permissions
('member.profile.view', 'View own profile', 'member'),
('member.profile.edit', 'Edit own profile', 'member'),
('member.content.view', 'View public content', 'member'),
('member.models.view', 'View public model profiles', 'member')

ON CONFLICT (name) DO NOTHING;

-- 6. Assign permissions to roles (least privilege)
INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'admin', id FROM public.permissions WHERE category = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'admin', id FROM public.permissions WHERE category IN ('team', 'member')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'team', id FROM public.permissions WHERE category = 'team'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'team', id FROM public.permissions WHERE category = 'member'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'member', id FROM public.permissions WHERE category = 'member'
ON CONFLICT DO NOTHING;

-- 7. Create enhanced permission checking functions
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

-- 8. Create user management functions
CREATE OR REPLACE FUNCTION public.update_user_role_with_audit(
  target_user_id UUID, 
  new_role app_role,
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
  -- Check if current user has admin permissions
  admin_id := auth.uid();
  IF NOT public.has_permission(admin_id, 'admin.roles.manage') THEN
    RAISE EXCEPTION 'Access denied: Insufficient permissions to manage roles';
  END IF;
  
  -- Get current role
  SELECT role INTO old_role FROM profiles WHERE id = target_user_id;
  
  IF old_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Update the role
  UPDATE profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  -- Log the change
  INSERT INTO user_management_audit (
    admin_user_id, target_user_id, action, old_values, new_values
  ) VALUES (
    admin_id, 
    target_user_id, 
    'role_change',
    jsonb_build_object('role', old_role, 'notes', admin_notes),
    jsonb_build_object('role', new_role, 'notes', admin_notes)
  );
END;
$$;

-- 9. Create audit logging function for admin logins
CREATE OR REPLACE FUNCTION public.log_admin_login()
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_management_audit (
    admin_user_id, action, new_values
  ) VALUES (
    auth.uid(),
    'login_admin',
    jsonb_build_object('timestamp', now(), 'user_id', auth.uid())
  );
END;
$$;

-- 10. Create RLS policies for new tables
-- Permissions - viewable by authenticated users, manageable by admins
CREATE POLICY "Authenticated users can view permissions" 
ON public.permissions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage permissions" 
ON public.permissions FOR ALL 
TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.system.configure'));

-- Role permissions - viewable by authenticated users, manageable by admins
CREATE POLICY "Authenticated users can view role permissions" 
ON public.role_permissions FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admins can manage role permissions" 
ON public.role_permissions FOR ALL 
TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.system.configure'));

-- User management audit - only admins can view
CREATE POLICY "Admins can view user management audit" 
ON public.user_management_audit FOR SELECT 
TO authenticated 
USING (public.has_permission(auth.uid(), 'admin.audit.view'));

-- 11. Update existing profiles table to use new default role
UPDATE profiles SET role = 'member' WHERE role = 'user';

-- 12. Create trigger to log profile changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log role changes
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO user_management_audit (
      admin_user_id, target_user_id, action, old_values, new_values
    ) VALUES (
      auth.uid(),
      NEW.id,
      'role_change_direct',
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_profile_role_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_profile_changes();