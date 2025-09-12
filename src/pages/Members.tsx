import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export const Members: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to models page since exclusive models are now shown there
    navigate('/models', { replace: true });
  }, [navigate]);

  return (
    <>
      <SEO 
        title="Members Area - Redirecting to Models | Five London"
        description="Redirecting to our main models gallery where exclusive models are displayed for premium members."
        canonicalUrl="/models"
      />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground">Taking you to our models gallery where exclusive models are displayed.</p>
        </div>
      </div>
    </>
  );
};