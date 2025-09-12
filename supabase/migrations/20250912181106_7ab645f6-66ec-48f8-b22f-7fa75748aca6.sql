-- Force fix the role data with explicit update
UPDATE profiles 
SET role = CASE 
  WHEN role = 'admin' THEN 'admin'
  ELSE 'member'
END;

-- Verify all roles are valid before adding constraint
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count 
  FROM profiles 
  WHERE role NOT IN ('admin', 'team', 'member');
  
  IF invalid_count > 0 THEN
    RAISE EXCEPTION 'Still have % invalid roles', invalid_count;
  END IF;
END
$$;