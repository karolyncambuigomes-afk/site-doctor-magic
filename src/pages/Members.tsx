import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export const Members: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to membership page instead of models
    navigate('/membership', { replace: true });
  }, [navigate]);

  return (
    <>
      <SEO 
        title="Members Area - Redirecting to Membership | Five London"
        description="Redirecting to our membership page for exclusive access and benefits."
        canonicalUrl="/membership"
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground">Taking you to our membership page for exclusive access.</p>
        </div>
      </div>
    </>
  );
};