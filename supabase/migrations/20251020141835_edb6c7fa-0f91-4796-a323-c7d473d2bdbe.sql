-- Remove TODAS as policies antigas de INSERT
DROP POLICY IF EXISTS "approved_user_insert_applications" ON public.model_applications;
DROP POLICY IF EXISTS "approved_user_insert_with_validation" ON public.model_applications;
DROP POLICY IF EXISTS "public_can_submit_applications" ON public.model_applications;

-- Remove policies antigas de SELECT
DROP POLICY IF EXISTS "super_admin_select_applications" ON public.model_applications;
DROP POLICY IF EXISTS "admins_can_view_applications" ON public.model_applications;

-- Permite QUALQUER PESSOA (autenticada ou não) submeter aplicações
CREATE POLICY "public_can_submit_applications"
ON public.model_applications
FOR INSERT
TO public
WITH CHECK (
  -- Valida apenas campos obrigatórios
  email IS NOT NULL 
  AND full_name IS NOT NULL
  AND length(TRIM(BOTH FROM email)) > 0
  AND length(TRIM(BOTH FROM full_name)) > 0
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  
  -- Limite de tamanho para prevenir abuso
  AND length(full_name) <= 200
  AND length(COALESCE(phone, '')) <= 50
  AND length(COALESCE(motivation, '')) <= 5000
);

-- Permite todos os admins verem aplicações
CREATE POLICY "admins_can_view_applications"
ON public.model_applications
FOR SELECT
TO authenticated
USING (
  is_admin()
);

-- Criar função para prevenir spam (mesmo email múltiplas vezes)
CREATE OR REPLACE FUNCTION prevent_duplicate_applications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Conta aplicações do mesmo email nas últimas 24 horas
  SELECT COUNT(*) INTO recent_count
  FROM model_applications
  WHERE email = NEW.email
  AND created_at > now() - interval '24 hours';
  
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Too many applications from this email. Please wait 24 hours.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Aplicar trigger
DROP TRIGGER IF EXISTS check_duplicate_applications ON model_applications;
CREATE TRIGGER check_duplicate_applications
  BEFORE INSERT ON model_applications
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_applications();