-- Create admin profile for karolyncambuigomes@gmail.com
INSERT INTO public.profiles (id, email, role, status, approved_at, approved_by, requested_at)
VALUES (
  'ef4365b3-6a19-4249-b622-d42693393493', 
  'karolyncambuigomes@gmail.com', 
  'admin', 
  'approved', 
  now(), 
  'ef4365b3-6a19-4249-b622-d42693393493', 
  now()
)
ON CONFLICT (id) DO UPDATE SET
  status = 'approved',
  role = 'admin',
  email = 'karolyncambuigomes@gmail.com',
  approved_at = now(),
  approved_by = 'ef4365b3-6a19-4249-b622-d42693393493';