import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModelsGallery } from '@/components/ModelsGallery';
import { SEO } from '@/components/SEO';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

export const Members: React.FC = () => {
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Members Area", url: "https://fivelondon.com/members" }
    ])
  ];

  return (
    <ProtectedRoute requiresAccess={true}>
      <SEO 
        title="Members Area - Premium Escort Gallery | Five London"
        description="Exclusive access to premium escort models in London. Full photo galleries, detailed profiles, and exclusive companions available only to premium members."
        keywords="premium escorts London, exclusive escort gallery, VIP companions London, luxury escort members, elite escort access, Five London members"
        canonicalUrl="/members"
        structuredData={structuredData}
      />
      
      <ModelsGallery isPremium={true} />
    </ProtectedRoute>
  );
};