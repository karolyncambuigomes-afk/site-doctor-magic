import React from 'react';
import { ModelsGallery } from '@/components/ModelsGallery';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Models: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Luxury Escort Models in London - Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Choose from elegant companions for dinner dates, social events, and private meetings."
        keywords="luxury escorts London, elite companions, sophisticated models, escort gallery, London escorts"
      />
      
      {/* Layout Preview Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/models-preview')}
          className="bg-background/95 backdrop-blur-sm border shadow-lg"
        >
          🎨 Escolher Layout
        </Button>
      </div>
      
      <ModelsGallery />
    </>
  );
};