-- Complete roles migration after enum values are added
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Migrate existing roles
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT id, CAST(role AS public.app_role), created_at
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin_roles()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT CASE WHEN auth.uid() IS NULL THEN false ELSE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin'::public.app_role, 'super_admin'::public.app_role)) END $$;

-- RLS policies
CREATE POLICY "usr_view_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "adm_view_all" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "sadm_insert" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "sadm_update" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'super_admin'::public.app_role));
CREATE POLICY "sadm_delete" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'::public.app_role));

-- Audit table
CREATE TABLE IF NOT EXISTS public.user_role_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL, changed_by UUID REFERENCES auth.users(id),
  old_role public.app_role, new_role public.app_role, changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(), reason TEXT
);
ALTER TABLE public.user_role_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "adm_audit_view" ON public.user_role_audit FOR SELECT TO authenticated USING (public.is_admin_roles());

-- Audit trigger
CREATE OR REPLACE FUNCTION public.audit_user_role_changes() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN INSERT INTO public.user_role_audit (user_id, changed_by, new_role) VALUES (NEW.user_id, auth.uid(), NEW.role);
  ELSIF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN INSERT INTO public.user_role_audit (user_id, changed_by, old_role, new_role) VALUES (NEW.user_id, auth.uid(), OLD.role, NEW.role);
  ELSIF TG_OP = 'DELETE' THEN INSERT INTO public.user_role_audit (user_id, changed_by, old_role) VALUES (OLD.user_id, auth.uid(), OLD.role);
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS aud_roles_trig ON public.user_roles;
CREATE TRIGGER aud_roles_trig AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.audit_user_role_changes();

-- Fix model_gallery with expiration
DROP POLICY IF EXISTS "Public can view public gallery images" ON public.model_gallery;
DROP POLICY IF EXISTS "Authenticated users can view members-only images" ON public.model_gallery;
DROP POLICY IF EXISTS "Admins and super admins can manage model gallery" ON public.model_gallery;
CREATE POLICY "pub_gallery" ON public.model_gallery FOR SELECT TO authenticated, anon USING (visibility = 'public');
CREATE POLICY "mem_gallery" ON public.model_gallery FOR SELECT TO authenticated USING (visibility = 'public' OR (visibility IN ('members_only', 'members') AND EXISTS (SELECT 1 FROM public.user_subscriptions WHERE user_id = auth.uid() AND active = true AND (expires_at IS NULL OR expires_at > now()))) OR public.is_admin_roles());
CREATE POLICY "adm_gallery" ON public.model_gallery FOR ALL TO authenticated USING (public.is_admin_roles()) WITH CHECK (public.is_admin_roles());

-- Fix models with expiration
DROP POLICY IF EXISTS "Authenticated users can view all model data" ON public.models;
DROP POLICY IF EXISTS "Premium users can view full model data" ON public.models;
DROP POLICY IF EXISTS "Admins and super admins can manage all models" ON public.models;
CREATE POLICY "view_models_exp" ON public.models FOR SELECT TO authenticated, anon USING (public.is_admin_roles() OR (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.user_subscriptions WHERE user_id = auth.uid() AND active = true AND (expires_at IS NULL OR expires_at > now()))) OR (members_only = false OR members_only IS NULL));
CREATE POLICY "adm_models" ON public.models FOR ALL TO authenticated USING (public.is_admin_roles()) WITH CHECK (public.is_admin_roles());

COMMENT ON TABLE public.user_roles IS 'SECURITY: Roles isolated from profiles to prevent privilege escalation';
COMMENT ON FUNCTION public.has_role IS 'SECURITY: Checks roles without recursive RLS';
COMMENT ON FUNCTION public.is_admin_roles IS 'SECURITY: Admin check using isolated user_roles table';