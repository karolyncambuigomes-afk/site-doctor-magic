import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

export const Admin: React.FC = () => {
  const { user, loading, hasAccess } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO 
        title="Administração - Five London"
        description="Painel administrativo"
        keywords="admin, administração, painel"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <h1 className="text-4xl font-bold mb-8">Administração</h1>
        </div>
      </div>
      
      <Footer />
    </>
  );
};