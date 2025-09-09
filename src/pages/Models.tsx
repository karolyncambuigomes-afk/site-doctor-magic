import React from 'react';
import { ModelsGallery } from '@/components/ModelsGallery';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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
      
      <Navigation />
      
      <main className="pt-16">
        {/* Elegant Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-background to-background/95">
          <div className="absolute inset-0 bg-[url('/images/clariges-lobby.jpg')] bg-cover bg-center bg-no-repeat opacity-15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="luxury-heading-xl mb-4 text-foreground font-light tracking-wide leading-tight">
                Elite Escort Models
              </h1>
              <p className="luxury-body-lg mb-6 text-muted-foreground">
                Discover London's most sophisticated companions. Available for dinner dates, business events, and exclusive experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Models Gallery */}
        <section className="bg-white">
          <ModelsGallery />
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="luxury-heading-lg mb-4 sm:mb-6 text-foreground">
                Ready to Meet Your Perfect Companion?
              </h2>
              <p className="luxury-body-lg text-foreground mb-6 sm:mb-8">
                Contact our concierge team to arrange your exclusive experience with one of our elite models.
              </p>
              <a
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white hover:bg-gray-800 px-6 py-3 transition-all duration-300 font-medium tracking-wider uppercase text-sm"
              >
                Contact Now
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};