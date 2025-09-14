import React from 'react';
import { ModelsGallery } from '@/components/ModelsGalleryLayouts';
import { SEO } from '@/components/SEO';

// Opção 1: Layout Minimalista (inspirado na Five London)
export const ModelsMinimal: React.FC = () => {
  return (
    <>
      <SEO 
        title="Luxury Escort Models in London - Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Choose from elegant companions for dinner dates, social events, and private meetings."
        keywords="luxury escorts London, elite companions, sophisticated models, escort gallery, London escorts"
      />
      <ModelsGallery layoutStyle="minimal" />
    </>
  );
};

// Opção 2: Layout Elegante
export const ModelsElegant: React.FC = () => {
  return (
    <>
      <SEO 
        title="Luxury Escort Models in London - Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Choose from elegant companions for dinner dates, social events, and private meetings."
        keywords="luxury escorts London, elite companions, sophisticated models, escort gallery, London escorts"
      />
      <ModelsGallery layoutStyle="elegant" />
    </>
  );
};

// Opção 3: Layout Moderno
export const ModelsModern: React.FC = () => {
  return (
    <>
      <SEO 
        title="Luxury Escort Models in London - Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Choose from elegant companions for dinner dates, social events, and private meetings."
        keywords="luxury escorts London, elite companions, sophisticated models, escort gallery, London escorts"
      />
      <ModelsGallery layoutStyle="modern" />
    </>
  );
};