-- Create RBAC System with proper enum and role structure
-- 1. First create the app_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'team', 'member');
    END IF;
END $$;

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
    admin_user_id UUID,
    target_user_id UUID,
    action TEXT NOT NULL,
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
SELECT 'admin'::app_role, id FROM public.permissions WHERE category = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'admin'::app_role, id FROM public.permissions WHERE category IN ('team', 'member')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'team'::app_role, id FROM public.permissions WHERE category = 'team'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'team'::app_role, id FROM public.permissions WHERE category = 'member'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id) 
SELECT 'member'::app_role, id FROM public.permissions WHERE category = 'member'
ON CONFLICT DO NOTHING;