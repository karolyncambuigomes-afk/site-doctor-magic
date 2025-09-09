import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { SEO } from '@/components/SEO';

// Simplified Supabase client - no custom storage
const supabaseUrl = 'https://jiegopvbwpyfohhfvmwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZWdvcHZid3B5Zm9oaGZ2bXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjUxNzMsImV4cCI6MjA3MjYwMTE3M30.WJQz8B9y5IEHQMtWtH_Xpmg9_1cym4xEMW_rhqCtIcs';

const adminSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await adminSupabase.auth.getSession();
        
        if (session?.user) {
          console.log('Admin já autenticado, redirecionando...');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Tentando login admin com:', formData.email);

      const { data, error: signInError } = await adminSupabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (signInError) {
        console.error('Erro de autenticação:', signInError);
        
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos');
        } else if (signInError.message.includes('JSON')) {
          setError('Erro de comunicação com servidor. Tente novamente.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        console.log('Login bem-sucedido:', data.user.email);
        
        // Verificar se é admin
        const { data: profileData, error: profileError } = await adminSupabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Erro ao verificar perfil:', profileError);
          setError('Erro ao verificar permissões de administrador');
          await adminSupabase.auth.signOut();
          return;
        }

        if (profileData?.role !== 'admin') {
          setError('Acesso negado: Apenas administradores podem acessar');
          await adminSupabase.auth.signOut();
          return;
        }

        console.log('Admin verificado, redirecionando...');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admin Login - Five London"
        description="Painel administrativo Five London"
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-luxury-heading">
              Admin Login
            </CardTitle>
            <CardDescription>
              Acesso restrito ao painel administrativo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fivelondon.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Apenas administradores autorizados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};