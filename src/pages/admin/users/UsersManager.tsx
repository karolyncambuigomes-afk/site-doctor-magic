import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX, Shield, Mail, Calendar, Search, Crown, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreateMemberModal } from '@/components/admin/CreateMemberModal';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

interface UserStats {
  total_users: number;
  pending_users: number;
  approved_users: number;
  rejected_users: number;
  admin_users: number;
}

export const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    pending_users: 0,
    approved_users: 0,
    rejected_users: 0,
    admin_users: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'admin'>('all');
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar dados adicionais do auth.users via RPC ou edge function se necessário
      const usersWithAuth = profilesData?.map(profile => ({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        status: profile.status,
        created_at: profile.created_at,
        last_sign_in_at: profile.last_sign_in_at,
        email_confirmed_at: profile.email_confirmed_at
      })) || [];

      setUsers(usersWithAuth);

      // Calcular estatísticas
      const totalUsers = usersWithAuth.length;
      const pendingUsers = usersWithAuth.filter(u => u.status === 'pending').length;
      const approvedUsers = usersWithAuth.filter(u => u.status === 'approved').length;
      const rejectedUsers = usersWithAuth.filter(u => u.status === 'rejected').length;
      const adminUsers = usersWithAuth.filter(u => u.role === 'admin').length;

      setStats({
        total_users: totalUsers,
        pending_users: pendingUsers,
        approved_users: approvedUsers,
        rejected_users: rejectedUsers,
        admin_users: adminUsers
      });
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do usuário",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .rpc('update_user_role', {
          user_id: userId,
          new_role: newRole
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Role do usuário atualizada para ${newRole}!`
      });

      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar role do usuário",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${userEmail}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar usuário: " + error.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.error) {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Sucesso",
          description: "Usuário deletado com sucesso"
        });
        loadUsers(); // Reload the users list
      }
    } catch (error) {
      console.error('Unexpected error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar usuário",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'admin') return user.role === 'admin';
    return user.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'approved':
        return <Badge variant="default">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'user':
        return <Badge variant="outline">Usuário</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Gerenciar Usuários - Five London Admin"
        description="Gerencie usuários e permissões do sistema"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie usuários, aprovações e permissões do sistema
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.admin_users}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pendentes
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('approved')}
            >
              Aprovados
            </Button>
            <Button
              variant={filterStatus === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('admin')}
            >
              Admins
            </Button>
            <Button
              onClick={() => setIsCreateMemberModalOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-variant text-white"
              size="sm"
            >
              <Crown className="mr-2 h-4 w-4" />
              Criar Membro Exclusivo
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              Gerencie aprovações e permissões dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.email}</span>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Created on: {new Date(user.created_at).toLocaleDateString('en-GB')}</div>
                      {user.last_sign_in_at && (
                        <div>Last login: {new Date(user.last_sign_in_at).toLocaleDateString('en-GB')}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserStatus(user.id, 'approved')}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserStatus(user.id, 'rejected')}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                    
                    {user.role === 'user' && user.status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserRole(user.id, 'admin')}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Tornar Admin
                      </Button>
                    )}
                    
                     {user.role === 'admin' && (
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => updateUserRole(user.id, 'user')}
                       >
                         Remover Admin
                       </Button>
                     )}
                     
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => deleteUser(user.id, user.email)}
                       className="text-red-600 hover:text-red-700 hover:border-red-300"
                     >
                       <Trash2 className="h-4 w-4 mr-1" />
                       Deletar
                     </Button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <CreateMemberModal
          isOpen={isCreateMemberModalOpen}
          onClose={() => setIsCreateMemberModalOpen(false)}
          onSuccess={() => loadUsers()}
        />
      </div>
    </AdminLayout>
  );
};