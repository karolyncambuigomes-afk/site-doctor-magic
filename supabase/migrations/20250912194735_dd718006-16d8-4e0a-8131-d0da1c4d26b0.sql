-- Admin Security and Audit Logging Enhancement

-- Create admin login tracking table
CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT false,
    failure_reason TEXT,
    two_factor_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rate limiting table for admin access
CREATE TABLE IF NOT EXISTS admin_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP or email
    attempt_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(identifier)
);

-- Create comprehensive audit log for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    resource_type TEXT, -- users, models, content, etc.
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    risk_level TEXT DEFAULT 'low', -- low, medium, high, critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create two-factor authentication table
CREATE TABLE IF NOT EXISTS admin_two_factor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
    secret_key TEXT NOT NULL, -- TOTP secret, encrypted
    backup_codes TEXT[], -- Encrypted backup codes
    is_enabled BOOLEAN DEFAULT false,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies

-- Admin login attempts - only viewable by admins
ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all login attempts"
ON admin_login_attempts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Admin sessions - users can view their own, admins can view all
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
ON admin_sessions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
ON admin_sessions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Users can update their own sessions"
ON admin_sessions FOR UPDATE
USING (user_id = auth.uid());

-- Rate limits - only admins can view
ALTER TABLE admin_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view rate limits"
ON admin_rate_limits FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Audit log - only admins can view
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON admin_audit_log FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Two-factor auth - users can manage their own
ALTER TABLE admin_two_factor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own 2FA"
ON admin_two_factor FOR ALL
USING (user_id = auth.uid());

-- Functions

-- Log admin login attempts
CREATE OR REPLACE FUNCTION log_admin_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO admin_login_attempts (
        user_id, 
        email, 
        success,
        created_at
    ) VALUES (
        auth.uid(),
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        true,
        now()
    );
END;
$$;

-- Check rate limits
CREATE OR REPLACE FUNCTION check_admin_rate_limit(identifier_value TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    max_attempts INTEGER := 5;
    window_minutes INTEGER := 15;
    block_minutes INTEGER := 30;
    current_attempts INTEGER;
    window_start_time TIMESTAMP WITH TIME ZONE;
    blocked_until_time TIMESTAMP WITH TIME ZONE;
    result JSONB;
BEGIN
    -- Clean up old records
    DELETE FROM admin_rate_limits 
    WHERE window_start < (now() - INTERVAL '1 hour');
    
    -- Get current attempts
    SELECT attempt_count, window_start, blocked_until
    INTO current_attempts, window_start_time, blocked_until_time
    FROM admin_rate_limits
    WHERE identifier = identifier_value;
    
    -- Check if currently blocked
    IF blocked_until_time IS NOT NULL AND blocked_until_time > now() THEN
        result := jsonb_build_object(
            'allowed', false,
            'reason', 'rate_limited',
            'blocked_until', blocked_until_time,
            'remaining_attempts', 0
        );
        RETURN result;
    END IF;
    
    -- Reset if window expired
    IF window_start_time IS NULL OR window_start_time < (now() - (window_minutes || ' minutes')::INTERVAL) THEN
        INSERT INTO admin_rate_limits (identifier, attempt_count, window_start)
        VALUES (identifier_value, 1, now())
        ON CONFLICT (identifier) DO UPDATE SET
            attempt_count = 1,
            window_start = now(),
            blocked_until = NULL;
        
        result := jsonb_build_object(
            'allowed', true,
            'remaining_attempts', max_attempts - 1
        );
        RETURN result;
    END IF;
    
    -- Increment attempts
    current_attempts := COALESCE(current_attempts, 0) + 1;
    
    -- Check if exceeded limit
    IF current_attempts >= max_attempts THEN
        UPDATE admin_rate_limits
        SET attempt_count = current_attempts,
            blocked_until = now() + (block_minutes || ' minutes')::INTERVAL
        WHERE identifier = identifier_value;
        
        result := jsonb_build_object(
            'allowed', false,
            'reason', 'rate_limited',
            'blocked_until', now() + (block_minutes || ' minutes')::INTERVAL,
            'remaining_attempts', 0
        );
    ELSE
        UPDATE admin_rate_limits
        SET attempt_count = current_attempts
        WHERE identifier = identifier_value;
        
        result := jsonb_build_object(
            'allowed', true,
            'remaining_attempts', max_attempts - current_attempts
        );
    END IF;
    
    RETURN result;
END;
$$;

-- Log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    action_type_param TEXT,
    resource_type_param TEXT DEFAULT NULL,
    resource_id_param UUID DEFAULT NULL,
    old_values_param JSONB DEFAULT NULL,
    new_values_param JSONB DEFAULT NULL,
    risk_level_param TEXT DEFAULT 'low'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO admin_audit_log (
        admin_user_id,
        action_type,
        resource_type,
        resource_id,
        old_values,
        new_values,
        risk_level
    ) VALUES (
        auth.uid(),
        action_type_param,
        resource_type_param,
        resource_id_param,
        old_values_param,
        new_values_param,
        risk_level_param
    );
END;
$$;

-- Cleanup old sessions and logs
CREATE OR REPLACE FUNCTION cleanup_admin_security_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Mark expired sessions as inactive
    UPDATE admin_sessions 
    SET is_active = false 
    WHERE expires_at < now() AND is_active = true;
    
    -- Delete old login attempts (keep 30 days)
    DELETE FROM admin_login_attempts 
    WHERE created_at < (now() - INTERVAL '30 days');
    
    -- Delete old rate limit entries (keep 1 day)
    DELETE FROM admin_rate_limits 
    WHERE created_at < (now() - INTERVAL '1 day');
    
    -- Archive old audit logs (keep 1 year, then move to archive table)
    -- For now, just keep them - implement archiving later if needed
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_user_id ON admin_login_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_email ON admin_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_admin_login_attempts_created_at ON admin_login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_rate_limits_identifier ON admin_rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action_type ON admin_audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_two_factor_user_id ON admin_two_factor(user_id);