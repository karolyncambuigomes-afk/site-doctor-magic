import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  const { user, loading, isAdmin } = auth || {};
  const location = useSafeLocation();

  console.log('🔐 AdminProtectedRoute render:', { 
    hasAuth: !!auth, 
    user: !!user, 
    loading, 
    isAdmin, 
    location: location?.pathname 
  });

  // Safety check for router context
  if (!location) {
    console.warn('AdminProtectedRoute: useLocation returned undefined');
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/models" replace />;
  }

  return <>{children}</>;
};