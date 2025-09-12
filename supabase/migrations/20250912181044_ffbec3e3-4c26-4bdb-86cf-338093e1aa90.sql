-- Fix remaining invalid role data
UPDATE profiles SET role = 'member' WHERE role = 'user';
UPDATE profiles SET role = 'member' WHERE role NOT IN ('admin', 'team', 'member');

-- Now add the constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'team', 'member'));