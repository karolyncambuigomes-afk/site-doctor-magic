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
        <section className="pt-8 pb-2 md:pt-12 md:pb-3 lg:pt-16 lg:pb-4 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                Elite Escort Models
              </h1>
              <p className="luxury-body-lg text-black">
                Discover London's most sophisticated companions. Available for dinner dates, business events, and exclusive experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Models Gallery */}
        <section className="bg-white">
        <ModelsGallery />
        </section>

        {/* About Our Elite Models - Collapsible Rich Content */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <details className="mb-8">
              <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-gray-800 hover:text-gray-600 transition-colors">
                <h2>About Our Elite Models</h2>
              </summary>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Sophisticated Companions for Elite Clients</h3>
                  <p className="luxury-body-md text-gray-700 leading-relaxed">
                    Our exclusive gallery features carefully selected international models who embody sophistication, intelligence, and natural beauty. Each companion represents the highest standards of elegance and cultural refinement, providing discerning gentlemen with exceptional experiences across London's most prestigious venues.
                  </p>
                  <p className="luxury-body-md text-gray-700 leading-relaxed">
                    From intimate dinner dates at Michelin-starred restaurants to prestigious social events, our elite models excel in creating memorable experiences. Each companion is multilingual, well-educated, and possesses the social grace necessary for any sophisticated occasion.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Professional Escort Services in London</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Business Companionship</h4>
                      <p className="luxury-body-xs text-gray-600">Professional accompaniment for corporate events, business dinners, and networking functions throughout the City and Canary Wharf.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Cultural Experiences</h4>
                      <p className="luxury-body-xs text-gray-600">Sophisticated companions for theatre evenings, gallery openings, and exclusive cultural events in Covent Garden and South Bank.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Luxury Hotel Services</h4>
                      <p className="luxury-body-xs text-gray-600">Discreet and professional services at London's finest hotels including The Ritz, The Savoy, and Shangri-La at The Shard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h2 className="luxury-heading-lg mb-4 sm:mb-6 text-black">
                Ready to Meet Your Perfect Companion?
              </h2>
              <p className="luxury-body-lg text-black mb-6 sm:mb-8">
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