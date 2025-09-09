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
      
      <main className="pt-16">
        <section className="py-12 md:py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="luxury-heading-xl text-foreground mb-4">
              Premium Members Gallery - Exclusive Access
            </h1>
            <h2 className="luxury-body-lg text-muted-foreground mb-8">
              Elite Escort Models - Members Only
            </h2>
          </div>
        </section>
        
        <ModelsGallery isPremium={true} />
      </main>
    </ProtectedRoute>
  );
};