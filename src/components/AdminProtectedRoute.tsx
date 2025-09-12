import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { useAuth } from '@/components/AuthProvider';
import { usePermissions } from '@/hooks/usePermissions';

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
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const location = useSafeLocation();

  // Safety check for router context
  if (!location) {
    console.warn('AdminProtectedRoute: useLocation returned undefined');
    return <div>Loading...</div>;
  }

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect non-authenticated users to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location, adminLogin: true }} replace />;
  }

  // Check specific permission or fallback to admin role check
  const hasRequiredAccess = requiredPermission 
    ? hasPermission(requiredPermission)
    : isAdmin;

  // Redirect users without proper permissions to access denied page
  if (!hasRequiredAccess) {
    return <Navigate to="/admin-access-denied" replace />;
  }

  return <>{children}</>;
};