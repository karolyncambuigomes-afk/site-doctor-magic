import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Shield, AlertTriangle, ArrowLeft, Settings } from 'lucide-react';

export const AdminAccessDenied: React.FC = () => {
  return (
    <>
      <SEOOptimized 
        title="Admin Access Denied - Five London"
        description="Administrative access is restricted to authorized personnel only"
        noIndex={true}
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <div className="max-w-md mx-auto">
            <Card className="border border-red-200 shadow-luxury">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600 luxury-heading-md">
                  Administrative Access Denied
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your account does not have the required administrator privileges to access this area
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Security Notice</p>
                      <p>This page is restricted to authorized system administrators only. Access attempts are logged and monitored.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    If you believe this is an error, please contact the system administrator.
                  </p>
                  
                  <div className="flex flex-col space-y-2">
                    <Link to="/models">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        View Our Models
                      </Button>
                    </Link>
                    
                    <Link to="/membership">
                      <Button variant="ghost" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Member Area
                      </Button>
                    </Link>
                    
                    <Link to="/">
                      <Button variant="ghost" className="w-full">
                        Return to Homepage
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-center text-muted-foreground space-y-1">
                    <p>Reference ID: {Date.now().toString(36).toUpperCase()}</p>
                    <p>Time: {new Date().toLocaleString()}</p>
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