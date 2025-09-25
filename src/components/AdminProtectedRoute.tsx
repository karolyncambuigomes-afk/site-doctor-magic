import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { useAuth } from '@/components/AuthProvider';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  requiredPermission = 'admin.users.manage' 
}) => {
  const auth = useAuth();
  const { user, loading, isAdmin } = auth || {};
  const location = useSafeLocation();

  // Safety check for router context
  if (!location) {
    console.warn('AdminProtectedRoute: useLocation returned undefined');
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect non-authenticated users to admin login page
  if (!user) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Check if user is admin - simplified check
  if (!isAdmin) {
    return <Navigate to="/admin-access-denied" replace />;
  }

  return <>{children}</>;
};