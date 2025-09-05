-- Authorize karolyncambuigomes@gmail.com as main administrator
-- First, let's find and update any existing profile
UPDATE public.profiles 
SET 
  status = 'approved',
  role = 'admin',
  approved_at = now(),
  approved_by = id
WHERE email = 'karolyncambuigomes@gmail.com';

-- If no profile exists, we'll also need to handle that case
-- Let's check if we need to create it by looking at auth.users
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the UUID from auth.users for this email
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'karolyncambuigomes@gmail.com';
    
    -- If user exists in auth but not in profiles, create the profile
    IF user_uuid IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, role, status, approved_at, approved_by, requested_at)
        VALUES (user_uuid, 'karolyncambuigomes@gmail.com', 'admin', 'approved', now(), user_uuid, now())
        ON CONFLICT (id) DO UPDATE SET
            status = 'approved',
            role = 'admin',
            approved_at = now(),
            approved_by = user_uuid;
    END IF;
END $$;