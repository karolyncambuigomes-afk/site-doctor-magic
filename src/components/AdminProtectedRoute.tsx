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
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white pt-20 pb-16">
          <div className="container-width">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border border-red-200 shadow-luxury">
                <CardHeader className="pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-light tracking-wide text-red-600">
                    Admin Access Required
                  </CardTitle>
                  <CardDescription className="text-lg">
                    You need administrator privileges to access this area
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2 text-red-500" />
                      Admin Panel Access
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This area is restricted to administrators only. 
                      If you believe you should have access, please contact the system administrator.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Note: Member access and admin access are separate systems.
                      Premium membership does not grant administrative privileges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return <>{children}</>;
};