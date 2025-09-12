import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Shield, Users, UserPlus, Activity } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: string;
  admin_user_id: string;
  target_user_id: string;
  action: string;
  old_values: any;
  new_values: any;
  timestamp: string;
}

export const UserManagement: React.FC = () => {
  const { hasPermission } = usePermissions();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (hasPermission('admin.users.manage')) {
      fetchUsers();
      fetchAuditLogs();
    }
  }, [hasPermission]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_management_audit')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase
        .rpc('update_user_role_with_audit', {
          target_user_id: selectedUser.id,
          new_role: newRole,
          admin_notes: adminNotes || null
        });

      if (error) throw error;

      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      fetchAuditLogs();
      setSelectedUser(null);
      setNewRole('');
      setAdminNotes('');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'team': return 'default';
      case 'member': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (!hasPermission('admin.users.manage')) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">Access Denied</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You don't have permission to manage users.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage user accounts and role assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{user.email}</div>
                  <div className="flex gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Change Role
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change User Role</AlertDialogTitle>
                      <AlertDialogDescription>
                        Update the role for {user.email}. This action will be logged.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">New Role</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notes">Admin Notes (Optional)</Label>
                        <Input
                          id="notes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Reason for role change..."
                        />
                      </div>
                    </div>
                    
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => {
                        setSelectedUser(null);
                        setNewRole('');
                        setAdminNotes('');
                      }}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={updateUserRole}>
                        Update Role
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      {hasPermission('admin.audit.view') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Audit Logs
            </CardTitle>
            <CardDescription>
              Track role changes and administrative actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium capitalize">{log.action.replace('_', ' ')}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.old_values && (
                          <span>From: {log.old_values.role} </span>
                        )}
                        {log.new_values && (
                          <span>To: {log.new_values.role}</span>
                        )}
                        {log.new_values?.notes && (
                          <span className="ml-2 italic">({log.new_values.notes})</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {auditLogs.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No audit logs found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};