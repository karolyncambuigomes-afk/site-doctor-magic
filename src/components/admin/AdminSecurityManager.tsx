import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Key, Clock, AlertTriangle, Users, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  success: boolean;
  failure_reason?: string;
  two_factor_used: boolean;
  created_at: string;
}

interface AdminSession {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  last_activity: string;
  is_active: boolean;
  created_at: string;
}

interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  risk_level: string;
  created_at: string;
}

export const AdminSecurityManager: React.FC = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    if (auth?.isAdmin) {
      fetchSecurityData();
    }
  }, [auth?.isAdmin]);

  const fetchSecurityData = async () => {
    try {
      // Fetch login attempts
      const { data: attempts } = await supabase
        .from('admin_login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch active sessions
      const { data: activeSessions } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      // Fetch audit logs
      const { data: logs } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Check 2FA status
      const { data: twoFactorData } = await supabase
        .from('admin_two_factor')
        .select('is_enabled')
        .eq('user_id', auth?.user?.id)
        .single();

      setLoginAttempts(attempts || []);
      setSessions(activeSessions || []);
      setAuditLogs(logs || []);
      setTwoFactorEnabled(twoFactorData?.is_enabled || false);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch security data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    try {
      // Generate TOTP secret
      const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(36))
        .join('')
        .slice(0, 32);
      
      // Generate backup codes
      const codes = Array.from({ length: 8 }, () =>
        Array.from(crypto.getRandomValues(new Uint8Array(4)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      );

      setTotpSecret(secret);
      setBackupCodes(codes);
      setShowSecret(true);

      toast({
        title: "2FA Secret Generated",
        description: "Use your authenticator app to scan the QR code",
      });
    } catch (error) {
      console.error('Error generating 2FA secret:', error);
      toast({
        title: "Error",
        description: "Failed to generate 2FA secret",
        variant: "destructive"
      });
    }
  };

  const logAdminAction = async (action: string, resourceType?: string) => {
    try {
      await supabase.rpc('log_admin_action', {
        action_type_param: action,
        resource_type_param: resourceType,
        risk_level_param: 'medium'
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      await supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      await logAdminAction('TERMINATE_SESSION', 'sessions');
      fetchSecurityData();

      toast({
        title: "Session Terminated",
        description: "Session has been terminated successfully",
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive"
      });
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (!auth?.isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Security Management</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="attempts">Login Attempts</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Login Attempts (24h)</p>
                  <p className="text-2xl font-bold">
                    {loginAttempts.filter(a => 
                      new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Failed Logins (24h)</p>
                  <p className="text-2xl font-bold">
                    {loginAttempts.filter(a => 
                      !a.success && new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Key className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">2FA Status</p>
                  <p className="text-lg font-semibold">
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Admin Sessions</CardTitle>
              <CardDescription>
                Monitor and manage active administrator sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={session.is_active ? "default" : "secondary"}>
                        {session.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {session.user_id !== auth?.user?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => terminateSession(session.id)}
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>IP:</strong> {session.ip_address}</p>
                      <p><strong>Last Activity:</strong> {new Date(session.last_activity).toLocaleString()}</p>
                      <p><strong>Expires:</strong> {new Date(session.expires_at).toLocaleString()}</p>
                      {session.user_agent && (
                        <p><strong>User Agent:</strong> {session.user_agent.substring(0, 60)}...</p>
                      )}
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No active sessions found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Attempts</CardTitle>
              <CardDescription>
                Recent admin login attempts and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginAttempts.map((attempt) => (
                  <div key={attempt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={attempt.success ? "default" : "destructive"}>
                        {attempt.success ? "Success" : "Failed"}
                      </Badge>
                      {attempt.two_factor_used && (
                        <Badge variant="secondary">2FA Used</Badge>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Email:</strong> {attempt.email}</p>
                      <p><strong>IP:</strong> {attempt.ip_address}</p>
                      <p><strong>Time:</strong> {new Date(attempt.created_at).toLocaleString()}</p>
                      {attempt.failure_reason && (
                        <p><strong>Failure Reason:</strong> {attempt.failure_reason}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loginAttempts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No login attempts found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                Comprehensive log of all admin actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getRiskBadgeColor(log.risk_level)}>
                        {log.risk_level.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Action:</strong> {log.action_type}</p>
                      {log.resource_type && (
                        <p><strong>Resource:</strong> {log.resource_type}</p>
                      )}
                      {log.ip_address && (
                        <p><strong>IP:</strong> {log.ip_address}</p>
                      )}
                      {log.old_values && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs">Old Values</summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.old_values, null, 2)}
                          </pre>
                        </details>
                      )}
                      {log.new_values && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs">New Values</summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.new_values, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No audit logs found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2fa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Enhance your account security with two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!twoFactorEnabled ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Key className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Two-factor authentication is not enabled for your account
                  </p>
                  <Button onClick={enableTwoFactor}>
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Two-factor authentication is enabled and protecting your account
                  </p>
                  <Button variant="outline" onClick={() => setTwoFactorEnabled(false)}>
                    Disable 2FA
                  </Button>
                </div>
              )}

              {showSecret && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Setup Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>TOTP Secret Key</Label>
                      <Input value={totpSecret} readOnly className="font-mono" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Scan this QR code with your authenticator app or enter the secret manually
                      </p>
                    </div>
                    
                    <div>
                      <Label>Backup Codes (Save these securely)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {backupCodes.map((code, index) => (
                          <Input
                            key={index}
                            value={code}
                            readOnly
                            className="font-mono text-sm"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        These codes can be used if you lose access to your authenticator app
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};