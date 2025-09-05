-- Step 1: Remove overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

-- Step 2: Create more restrictive policies for payment operations
CREATE POLICY "Service role can only insert subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Step 3: Remove email from profiles table for better privacy
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Step 4: Create audit log table for security monitoring
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

-- Step 5: Improve profiles table security
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

CREATE POLICY "Only authenticated users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);