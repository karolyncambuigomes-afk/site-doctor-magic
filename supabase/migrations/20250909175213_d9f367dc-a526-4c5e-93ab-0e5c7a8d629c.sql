-- Create a new admin user account in profiles table
-- This will create an admin account for testing purposes
INSERT INTO public.profiles (
  id, 
  email, 
  role, 
  status, 
  requested_at, 
  approved_at, 
  approved_by
) VALUES (
  gen_random_uuid(),
  'admin@fivelondon.com',
  'admin',
  'approved',
  now(),
  now(),
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1)
) ON CONFLICT (email) DO NOTHING;

-- Also ensure the existing admin is properly set up
UPDATE public.profiles 
SET 
  status = 'approved',
  approved_at = COALESCE(approved_at, now()),
  role = 'admin'
WHERE email = 'karolyncambuigomes@gmail.com';