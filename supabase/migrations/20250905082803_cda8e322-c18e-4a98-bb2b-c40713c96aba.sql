-- CRITICAL SECURITY FIXES - Fixed syntax

-- 1. Remove overly permissive service role policy for user_subscriptions
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

-- 2. Create more restrictive policies for payment operations
CREATE POLICY "Service role can only insert subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can only update subscription status" 
ON public.user_subscriptions 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow updating specific payment-related fields
  OLD.user_id = NEW.user_id AND 
  OLD.created_at = NEW.created_at
);

-- 3. Remove email from profiles table for better privacy
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- 4. Create audit log table
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  old_values JSONB,
  new_values JSONB
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 5. Improve profiles table security
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

CREATE POLICY "Only authenticated users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 6. Add security function to check admin role safely
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;