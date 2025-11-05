import React, { useState, useEffect } from 'react';
import { SafeLink } from '@/components/ui/safe-link';

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent error handling
    }
  }
};

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = safeStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    safeStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    safeStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[100] p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 flex-1">
          We use cookies to enhance your experience and analyze site usage. By continuing to browse, you agree to our{' '}
          <SafeLink to="/privacy-policy" className="underline text-primary">
            Privacy Policy
          </SafeLink>.
        </div>
        <div className="flex gap-2">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};