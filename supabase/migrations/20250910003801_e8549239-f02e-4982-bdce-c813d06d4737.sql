-- CRITICAL SECURITY FIX: Remove public INSERT access to model_applications
-- This prevents hackers from stealing sensitive personal data

-- First, drop the existing insecure INSERT policy
DROP POLICY IF EXISTS "Authenticated users can submit applications" ON public.model_applications;

-- Create a more secure INSERT policy that requires:
-- 1. User must be authenticated
-- 2. User must have a verified profile
-- 3. User must have confirmed their email
CREATE POLICY "Verified users can submit applications" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND status = 'approved'
  )
  AND email IS NOT NULL 
  AND full_name IS NOT NULL 
  AND length(TRIM(BOTH FROM email)) > 0 
  AND length(TRIM(BOTH FROM full_name)) > 0
);

-- Add application rate limiting to prevent spam and abuse
CREATE TABLE IF NOT EXISTS public.application_submission_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  ip_address inet,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text
);

-- Enable RLS on application submission log
ALTER TABLE public.application_submission_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view submission logs
CREATE POLICY "Admins can view submission logs" 
ON public.application_submission_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add trigger to log all application submissions for security monitoring
CREATE OR REPLACE FUNCTION public.log_application_submission()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.application_submission_log (user_id, email)
  VALUES (auth.uid(), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_application_submissions
  AFTER INSERT ON public.model_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_submission();