-- Alterar o role do usuário para admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'karolyncambuigomes@gmail.com';