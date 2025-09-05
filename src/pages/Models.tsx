import React from 'react';
import { ModelsGallery } from '@/components/ModelsGallery';
import { SEO } from '@/components/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

export const Models: React.FC = () => {
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Our Models", url: "https://fivelondon.com/models" }
    ])
  ];

  return (
    <>
      <SEO 
        title="Elite Escort Models in London - Sophisticated Companions | Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Elite companions for dinner dates, social events, business functions, and private meetings. Professional, discreet, and elegant."
        keywords="luxury escorts London, elite escort models, sophisticated companions London, high-class escorts, VIP escort models, premium escort gallery, London escort models, professional companions, exclusive escorts London, elite escort agency"
        canonicalUrl="/models"
        structuredData={structuredData}
      />
      
      <ModelsGallery />
    </>
  );
};