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

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    // Initialize analytics here
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Privacy Info Section - Only for non-authenticated users */}
        {!user && (
          <div className="mb-4 pb-4 border-b border-stone-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
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
              
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>Limited Info</span>
                </div>
                <div className="w-px h-3 bg-border"></div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Full Access</span>
                </div>
                <Link to="/auth">
                  <Button size="sm" variant="outline" className="text-xs px-3 py-1.5 h-7">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Cookie Consent Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
              <Cookie className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground mb-1">
                Cookie Settings
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We use cookies to enhance your experience and analyze our traffic. 
                By continuing to use our site, you consent to our use of cookies.{' '}
                <Link to="/privacy-policy" className="text-stone-900 underline hover:no-underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="text-stone-600 border-stone-300 text-xs h-8"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-stone-900 text-white hover:bg-stone-800 text-xs h-8"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};