-- Fix critical security vulnerabilities

-- 1. Remove dangerous public INSERT policy on model_applications
DROP POLICY IF EXISTS "Allow application submissions only" ON public.model_applications;

-- 2. Add secure INSERT policy requiring proper validation
CREATE POLICY "Authenticated users can submit applications"
ON public.model_applications
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND email IS NOT NULL 
  AND full_name IS NOT NULL
  AND length(trim(email)) > 0
  AND length(trim(full_name)) > 0
);

-- 3. Add trigger to prevent users from escalating their own roles
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- During updates, prevent users from changing their own role
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    -- Check if user is trying to update their own profile
    IF auth.uid() = NEW.id THEN
      -- Revert the role change
      NEW.role = OLD.role;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS prevent_self_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_self_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_role_escalation();

-- 4. Fix function security by updating search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, status, requested_at)
  VALUES (NEW.id, NEW.email, 'user', 'pending', now());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_status()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN NULL
    ELSE (
      SELECT role FROM public.profiles 
      WHERE id = auth.uid()
    )
  END;
$$;

-- 5. Add rate limiting table for application submissions
CREATE TABLE IF NOT EXISTS public.application_rate_limit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  email TEXT NOT NULL,
  submission_count INTEGER DEFAULT 1,
  last_submission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.application_rate_limit ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limiting data
CREATE POLICY "Admins can view rate limit data"
ON public.application_rate_limit
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 6. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit logs
CREATE POLICY "Admins can view security audit logs"
ON public.security_audit_log
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- 7. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_record_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, table_name, record_id, 
    old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_record_id,
    p_old_values, p_new_values
  );
END;
$$;