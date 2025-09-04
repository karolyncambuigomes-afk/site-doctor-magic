import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-stone-600">
            We use cookies to enhance your experience and analyze our traffic. 
            By continuing to use our site, you consent to our use of cookies.{' '}
            <Link to="/privacy-policy" className="text-stone-900 underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="text-stone-600 border-stone-300"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-stone-900 text-white hover:bg-stone-800"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};