import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Mail } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export const UserApprovalStatus: React.FC = () => {
  const auth = useAuth();
  const { user, userStatus, signOut } = auth || {};

  const getStatusIcon = () => {
    switch (userStatus) {
      case 'pending':
        return <Clock className="w-12 h-12 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <Clock className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (userStatus) {
      case 'pending':
        return {
          title: "Aguardando Aprovação",
          description: "Sua conta foi criada com sucesso e está aguardando aprovação de um administrador. Você receberá um email quando sua conta for aprovada.",
          bgColor: "bg-yellow-50 border-yellow-200"
        };
      case 'rejected':
        return {
          title: "Acesso Negado",
          description: "Sua solicitação de acesso foi negada. Entre em contato conosco se você acredita que isso é um erro.",
          bgColor: "bg-red-50 border-red-200"
        };
      default:
        return {
          title: "Status Desconhecido",
          description: "Não foi possível verificar o status da sua conta. Tente fazer login novamente.",
          bgColor: "bg-gray-50 border-gray-200"
        };
    }
  };

  const status = getStatusMessage();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-20 pb-16">
        <div className="container-width">
          <div className="max-w-md mx-auto">
            <Card className={`${status.bgColor} border-2`}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {getStatusIcon()}
                </div>
                <CardTitle className="text-xl">
                  {status.title}
                </CardTitle>
                <CardDescription className="text-center">
                  {status.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Email: {user?.email}</span>
                  </div>
                  
                  {userStatus === 'pending' && (
                    <div className="text-sm text-muted-foreground">
                      <p>O que acontece agora:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Um administrador revisará sua solicitação</li>
                        <li>Você receberá um email com a decisão</li>
                        <li>Isso pode levar até 24-48 horas</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={signOut}
                      className="flex-1"
                    >
                      Fazer Logout
                    </Button>
                    
                    {userStatus === 'rejected' && (
                      <Button 
                        variant="default"
                        className="flex-1"
                        onClick={() => window.location.href = '/contact'}
                      >
                        Entrar em Contato
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};