import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'warning';
  action_required: boolean;
  documentation_url?: string;
}

export const SecurityStatusManager: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleaningUp, setCleaningUp] = useState(false);
  
  const { toast } = useToast();
  const auth = useAuth();

  const knownSecurityIssues: SecurityIssue[] = [
    {
      id: 'leaked_password_protection',
      title: 'Leaked Password Protection Disabled',
      description: 'Password protection against leaked credentials is currently disabled. This should be enabled to prevent users from using compromised passwords.',
      level: 'warning',
      action_required: true,
      documentation_url: 'https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection'
    },
    {
      id: 'postgres_upgrade',
      title: 'Postgres Version Security Patches',
      description: 'Your Postgres database version has available security patches. Upgrading is recommended to maintain security.',
      level: 'warning',
      action_required: true,
      documentation_url: 'https://supabase.com/docs/guides/platform/upgrading'
    }
  ];

  useEffect(() => {
    if (auth?.isAdmin) {
      fetchSecurityStatus();
    }
  }, [auth?.isAdmin]);

  const fetchSecurityStatus = async () => {
    try {
      // Get auth security status
      const { data: authStatus, error: authError } = await supabase
        .rpc('get_auth_security_status');

      if (authError) {
        console.error('Error fetching auth security status:', authError);
      }

      // Validate profile relationships
      const { data: validation, error: validationError } = await supabase
        .rpc('validate_profile_relationships');

      if (validationError) {
        console.error('Error validating relationships:', validationError);
      }

      setSecurityStatus(authStatus);
      setValidationResults(validation || []);
    } catch (error) {
      console.error('Error fetching security status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch security status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanupOrphanedRecords = async () => {
    setCleaningUp(true);
    try {
      const { data: result, error } = await supabase
        .rpc('cleanup_orphaned_records');

      if (error) throw error;

      toast({
        title: "Cleanup Complete",
        description: result,
      });

      // Refresh validation results
      await fetchSecurityStatus();
    } catch (error) {
      console.error('Error cleaning up orphaned records:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up orphaned records",
        variant: "destructive"
      });
    } finally {
      setCleaningUp(false);
    }
  };

  const cleanupPlaintextPiiData = async () => {
    try {
      const { data: result, error } = await supabase
        .rpc('cleanup_plaintext_pii_data');

      if (error) throw error;

      toast({
        title: "PII Cleanup Complete",
        description: result,
      });
    } catch (error) {
      console.error('Error cleaning up PII data:', error);
      toast({
        title: "PII Cleanup Failed",
        description: "Failed to clean up plaintext PII data",
        variant: "destructive"
      });
    }
  };

  const cleanup2faData = async () => {
    try {
      const { data: result, error } = await supabase
        .rpc('cleanup_plaintext_2fa_data');

      if (error) throw error;

      toast({
        title: "2FA Cleanup Complete",
        description: result,
      });
    } catch (error) {
      console.error('Error cleaning up 2FA data:', error);
      toast({
        title: "2FA Cleanup Failed",
        description: "Failed to clean up plaintext 2FA data",
        variant: "destructive"
      });
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
          <p className="text-muted-foreground">Loading security status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Security Status & Compliance</h1>
      </div>

      {/* Known Security Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Known Security Issues
          </CardTitle>
          <CardDescription>
            Security issues that require manual action in Supabase Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {knownSecurityIssues.map((issue) => (
            <Alert key={issue.id} className="border-orange-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <strong>{issue.title}</strong>
                      <Badge variant={issue.level === 'critical' ? 'destructive' : 'secondary'}>
                        {issue.level.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {issue.description}
                    </p>
                  </div>
                  {issue.documentation_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(issue.documentation_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Fix Guide
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Database Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Database Relationship Validation</CardTitle>
          <CardDescription>
            Check for orphaned records and relationship integrity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validationResults.length > 0 ? (
            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{result.table_name}</p>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </div>
                  <Badge variant={result.issue_count > 0 ? "destructive" : "secondary"}>
                    {result.issue_count} issues
                  </Badge>
                </div>
              ))}
              <Button 
                onClick={cleanupOrphanedRecords}
                disabled={cleaningUp}
                className="w-full"
              >
                {cleaningUp ? "Cleaning..." : "Clean Up Orphaned Records"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-muted-foreground">No relationship issues found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Data Security Cleanup</CardTitle>
          <CardDescription>
            Clean up plaintext sensitive data after encryption is implemented
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={cleanupPlaintextPiiData} variant="outline">
              Clean Up Plaintext PII Data
            </Button>
            <Button onClick={cleanup2faData} variant="outline">
              Clean Up Plaintext 2FA Data
            </Button>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> These actions will permanently remove plaintext sensitive data 
              where encrypted versions exist. Ensure encryption is working properly before running cleanup.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Security Status Summary */}
      {securityStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Security Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Security Check:</strong> {securityStatus.security_check}</p>
              <p><strong>Postgres Upgrade:</strong> {securityStatus.postgres_upgrade}</p>
              <p><strong>Recommendation:</strong> {securityStatus.recommendation}</p>
              <p className="text-sm text-muted-foreground">
                Last checked: {new Date(securityStatus.last_check).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};