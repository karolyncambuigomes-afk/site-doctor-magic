import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Crown, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAccess?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAccess = false 
}) => {
  const { user, loading, hasAccess } = useAuth();
  const location = useLocation();

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

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiresAccess && !hasAccess) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-20 pb-16">
          <div className="container-width">
            <div className="max-w-2xl mx-auto text-center">
              <Card className="border border-border/50 shadow-luxury">
                <CardHeader className="pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-light tracking-wide">
                    Premium Access Required
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Unlock exclusive access to our companions and premium features
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-amber-500" />
                        Free Access Includes:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Browse companion gallery</li>
                        <li>• Basic information and profiles</li>
                        <li>• Contact information</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center">
                        <Crown className="w-4 h-4 mr-2 text-amber-500" />
                        Premium Access Includes:
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        <li>• Full companion profiles</li>
                        <li>• High-resolution galleries</li>
                        <li>• Detailed information & pricing</li>
                        <li>• Priority booking</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={() => window.location.href = '/upgrade'}
                      className="five-london-button w-full py-3"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium - £49.99
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Secure payment processed by Stripe. Cancel anytime.
                  </p>
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