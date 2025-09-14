-- CRITICAL SECURITY FIX: Enhanced protection for application_rate_limit table
-- This prevents harvesting of user email addresses and IP data

-- First, ensure RLS is properly enabled and forced
ALTER TABLE public.application_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_rate_limit FORCE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view rate limit data" ON public.application_rate_limit;

-- Create a more restrictive admin-only SELECT policy
CREATE POLICY "Admin users only can view rate limit data" 
ON public.application_rate_limit 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Ensure no other operations are allowed by anyone
CREATE POLICY "Deny all INSERT operations" 
ON public.application_rate_limit 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Deny all UPDATE operations" 
ON public.application_rate_limit 
FOR UPDATE 
USING (false);

CREATE POLICY "Deny all DELETE operations" 
ON public.application_rate_limit 
FOR DELETE 
USING (false);

-- Create a secure function for internal rate limiting that doesn't expose sensitive data
CREATE OR REPLACE FUNCTION public.check_application_rate_limit(user_email text, user_ip inet DEFAULT NULL)
RETURNS jsonb AS $$
DECLARE
  current_count integer := 0;
  last_submission_time timestamp with time zone;
  rate_limit_window interval := '1 hour'::interval;
  max_submissions integer := 3;
  result jsonb;
BEGIN
  -- Check submission count within the rate limit window
  SELECT 
    COALESCE(submission_count, 0),
    last_submission
  INTO current_count, last_submission_time
  FROM public.application_rate_limit 
  WHERE email = user_email 
  AND created_at > (now() - rate_limit_window);
  
  -- If no recent submissions, allow
  IF current_count = 0 OR last_submission_time IS NULL THEN
    result := jsonb_build_object(
      'allowed', true,
      'remaining', max_submissions - 1,
      'reset_time', now() + rate_limit_window
    );
  -- If within rate limit, allow and increment
  ELSIF current_count < max_submissions THEN
    result := jsonb_build_object(
      'allowed', true,
      'remaining', max_submissions - current_count - 1,
      'reset_time', last_submission_time + rate_limit_window
    );
  -- If over rate limit, deny
  ELSE
    result := jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_time', last_submission_time + rate_limit_window
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update the application submission logging function to use the rate limiting
CREATE OR REPLACE FUNCTION public.log_application_submission()
RETURNS TRIGGER AS $$
DECLARE
  client_ip inet;
BEGIN
  -- Get client IP from headers if available (Edge Function context)
  client_ip := NULL; -- Will be set by application layer
  
  -- Insert or update rate limiting record
  INSERT INTO public.application_rate_limit (email, ip_address, submission_count, last_submission)
  VALUES (NEW.email, client_ip, 1, now())
  ON CONFLICT (email) 
  DO UPDATE SET 
    submission_count = application_rate_limit.submission_count + 1,
    last_submission = now(),
    ip_address = COALESCE(EXCLUDED.ip_address, application_rate_limit.ip_address);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;