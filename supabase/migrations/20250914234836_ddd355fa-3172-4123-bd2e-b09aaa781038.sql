-- Address security linter warnings - fix only existing tables

-- Fix permissions table (INFO issue 1)
DROP POLICY IF EXISTS "permissions_read_policy" ON public.permissions;
CREATE POLICY "permissions_read_policy" 
ON public.permissions 
FOR SELECT 
USING (true); -- Permissions can be read by anyone as they're metadata

-- Fix role_permissions table (INFO issue 2) 
DROP POLICY IF EXISTS "role_permissions_admin_only" ON public.role_permissions;
CREATE POLICY "role_permissions_admin_only" 
ON public.role_permissions 
FOR ALL 
USING (is_admin());

-- Ensure RLS is enabled on these tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY; 

-- Add security comments for documentation
COMMENT ON TABLE public.role_permissions IS 'SECURITY: Role permissions are restricted to admin access only.';
COMMENT ON TABLE public.permissions IS 'SECURITY: Permission metadata is publicly readable for application functionality.';