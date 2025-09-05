import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Shield, Eye, Lock, Cookie } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('privacyConsent', 'accepted');
    setShowConsent(false);
    // Initialize analytics here
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const declineAll = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('privacyConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Combined Privacy + Cookie Info */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            
            {/* Privacy Section - Only for non-authenticated users */}
            {!user && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    Privacy Protected
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Detailed profiles are available after registration to protect our companions' privacy and ensure discretion.
                  </p>
                </div>
              </div>
            )}

            {/* Cookie Section */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 shrink-0">
                <Cookie className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Cookie & Analytics
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We use cookies to enhance your experience and analyze our traffic. 
                  {' '}
                  <Link to="/privacy-policy" className="text-stone-900 underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Single Accept/Decline Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={declineAll}
              className="text-stone-600 border-stone-300 text-sm h-9 px-6"
            >
              Não Aceitar
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="bg-stone-900 text-white hover:bg-stone-800 text-sm h-9 px-6"
            >
              Aceitar Tudo
            </Button>
          </div>
        </div>
        
        {/* Register button for non-authenticated users */}
        {!user && (
          <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-center">
            <Link to="/auth">
              <Button size="sm" variant="outline" className="text-xs px-4 py-2 h-8">
                Registrar para Ver Perfis Completos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};