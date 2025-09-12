import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

export const RouteLogger: React.FC = () => {
  const location = useLocation();
  const auth = useAuth();
  const { user, isAdmin, hasAccess, loading } = auth || {};

  useEffect(() => {
    console.log('🚦 Route Navigation:', {
      path: location.pathname,
      userEmail: user?.email || 'Not logged in',
      isAdmin: isAdmin,
      hasAccess: hasAccess,
      loading: loading,
      timestamp: new Date().toISOString()
    });
  }, [location.pathname, user?.email, isAdmin, hasAccess, loading]);

  return null;
};