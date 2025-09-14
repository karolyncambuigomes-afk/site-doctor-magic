-- First add unique constraint to email if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_email_unique'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
    END IF;
END $$;

-- Create a new admin user account in profiles table
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

-- Ensure the existing admin is properly set up
UPDATE public.profiles 
SET 
  status = 'approved',
  approved_at = COALESCE(approved_at, now()),
  role = 'admin'
WHERE email = 'karolyncambuigomes@gmail.com';