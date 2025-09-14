-- CRITICAL SECURITY FIX: Restrict access to model applications to admins only
-- This prevents potential data theft of sensitive applicant information

-- First, remove the existing "Anyone can submit applications" policy
-- and replace with a more restrictive one that still allows submissions
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.model_applications;

-- Create a policy that allows anonymous submissions but prevents viewing submitted data
CREATE POLICY "Allow application submissions only" 
ON public.model_applications 
FOR INSERT 
WITH CHECK (true);

-- Remove any broad SELECT policies and ensure only admins can view applications
DROP POLICY IF EXISTS "Public can view applications" ON public.model_applications;

-- Ensure only admins can view all applications (this policy already exists but confirming)
-- The existing "Admins can view all applications" policy is correct

-- Add additional security: Only allow admins to manage application status
CREATE POLICY "Only admins can update application status" 
ON public.model_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Enable RLS if not already enabled
ALTER TABLE public.model_applications ENABLE ROW LEVEL SECURITY;