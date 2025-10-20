-- Fix: Make ip_address nullable in application_rate_limit
-- The trigger cannot access client IP in database context, so allow NULL values
-- Rate limiting will work based on email (which has UNIQUE constraint)
ALTER TABLE public.application_rate_limit 
ALTER COLUMN ip_address DROP NOT NULL;

-- Add comment to document this decision
COMMENT ON COLUMN public.application_rate_limit.ip_address IS 
  'Client IP address for additional rate limiting. NULL when IP cannot be determined in database trigger context. Rate limiting primarily based on email.';