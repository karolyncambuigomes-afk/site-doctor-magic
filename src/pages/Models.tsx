import React from 'react';
import { ModelsGallery } from '@/components/ModelsGallery';
import { SEO } from '@/components/SEO';

export const Models: React.FC = () => {
  return (
    <>
      <SEO 
        title="Luxury Escort Models in London - Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Choose from elegant companions for dinner dates, social events, and private meetings."
        keywords="luxury escorts London, elite companions, sophisticated models, escort gallery, London escorts"
      />
      
      <ModelsGallery />
    </>
  );
};