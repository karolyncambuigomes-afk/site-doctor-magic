import React from 'react';
import { ModelsGallery } from '@/components/ModelsGallery';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEOOptimized } from '@/components/SEOOptimized';
import { ContactBar } from '@/components/ContactBar';

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
      <SEOOptimized 
        title="Elite Escort Models in London - Sophisticated Companions | Five London"
        description="Browse our exclusive collection of sophisticated escort models in London. Elite companions for dinner dates, social events, business functions, and private meetings. Professional, discreet, and elegant."
        keywords="luxury escorts London, elite escort models, sophisticated companions London, high-class escorts, VIP escort models, premium escort gallery, London escort models, professional companions, exclusive escorts London, elite escort agency"
        canonicalUrl="/models"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="section-padding-lg bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="heading-1 title-margin-md text-primary-content">
                Elite Escort Models
              </h1>
              <p className="body-lead text-primary-content mb-16 md:mb-20">
                Discover London's most sophisticated companions. Available for dinner dates, business events, and exclusive experiences.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="separator-elegant"></div>
        </section>

        {/* Models Gallery */}
        <section className="bg-white">
        <ModelsGallery />
        </section>

        {/* About Our Elite Models - Collapsible Rich Content */}
        <section className="section-padding-lg bg-secondary-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-card-surface backdrop-blur-sm rounded-xl border-secondary-line shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <div className="text-center title-margin-lg">
                  <h2 className="heading-2 text-primary-content">About Our Elite Models</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8">
                <div className="flex flex-col gap-tight">
                  <h3 className="heading-3">Sophisticated Companions for Elite Clients</h3>
                  <p className="body-base text-secondary-content">
                    Our exclusive gallery features carefully selected international models who embody sophistication, intelligence, and natural beauty. Each companion represents the highest standards of elegance and cultural refinement, providing discerning gentlemen with exceptional experiences across London's most prestigious venues.
                  </p>
                  <p className="body-base text-secondary-content">
                    From intimate dinner dates at Michelin-starred restaurants to prestigious social events, our elite models excel in creating memorable experiences. Each companion is multilingual, well-educated, and possesses the social grace necessary for any sophisticated occasion.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="heading-3">Professional Escort Services in London</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="body-sm font-medium">Business Companionship</h4>
                      <p className="body-xs text-secondary-content">Professional accompaniment for corporate events, business dinners, and networking functions throughout the City and Canary Wharf.</p>
                    </div>
                    <div>
                      <h4 className="body-sm font-medium">Cultural Experiences</h4>
                      <p className="body-xs text-secondary-content">Sophisticated companions for theatre evenings, gallery openings, and exclusive cultural events in Covent Garden and South Bank.</p>
                    </div>
                    <div>
                      <h4 className="body-sm font-medium">Luxury Hotel Services</h4>
                      <p className="body-xs text-secondary-content">Discreet and professional services at London's finest hotels including The Ritz, The Savoy, and Shangri-La at The Shard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding-lg bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="heading-2 title-margin-md text-primary-content">
                Ready to Meet Your Perfect Companion?
              </h2>
              <p className="body-lead text-primary-content mb-6 sm:mb-8">
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
      
      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};