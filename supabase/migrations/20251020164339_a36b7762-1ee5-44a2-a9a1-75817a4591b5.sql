-- Fix: Add UNIQUE constraint to email column in application_rate_limit
-- This allows the log_application_submission trigger to work with ON CONFLICT (email)

ALTER TABLE public.application_rate_limit 
ADD CONSTRAINT application_rate_limit_email_key UNIQUE (email);