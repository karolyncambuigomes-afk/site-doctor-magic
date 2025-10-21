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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[60] p-4 md:p-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm md:text-base text-gray-900 flex-1 text-center sm:text-left leading-relaxed">
          We use cookies to enhance your experience and analyze site usage. By continuing to browse, you agree to our{' '}
          <SafeLink to="/privacy-policy" className="underline text-primary font-medium">
            Privacy Policy
          </SafeLink>.
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={declineCookies}
            className="flex-1 sm:flex-initial px-5 py-3 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] font-medium"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 sm:flex-initial px-5 py-3 text-sm md:text-base bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors min-h-[44px] font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};