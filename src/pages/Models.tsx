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
        {/* Minimal Hero */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="heading-display mb-4 sm:mb-6 text-black">
                Elite Escort Models
              </h1>
              <p className="body-lg text-black">
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
        <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="heading-display mb-4 sm:mb-6 text-black">
                Ready to Meet Your Perfect Companion?
              </h2>
              <p className="body-lg text-black mb-6 sm:mb-8">
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