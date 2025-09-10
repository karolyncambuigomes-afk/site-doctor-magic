-- Update user role to admin for karolyn@fivelondon.com
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'karolyn@fivelondon.com';