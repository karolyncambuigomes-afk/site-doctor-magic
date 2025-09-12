-- Fix roles step by step
-- 1. First update the user role to member
UPDATE profiles SET role = 'member' WHERE role = 'user' OR role NOT IN ('admin', 'team', 'member');

-- 2. Now verify the data is clean
-- Check current roles after update