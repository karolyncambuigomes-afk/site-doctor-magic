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

        {/* SEO Content - Invisible */}
        <div className="sr-only">
          <h2>Premium London Escort Models Gallery - Elite Companions for Sophisticated Clients</h2>
          <p>Discover London's most exclusive collection of sophisticated escort models, carefully selected for their beauty, intelligence, and social grace. Our elite companions are available for dinner dates at Michelin-starred restaurants in Mayfair, business events in Canary Wharf, cultural experiences in Covent Garden, and exclusive social gatherings across London's most prestigious venues.</p>
          
          <h3>Sophisticated Companions for Elite Clients in London's Premier Locations</h3>
          <p>Our luxury escort models specialize in providing exceptional companionship throughout London's most exclusive areas. From the refined elegance of Mayfair and Knightsbridge to the cultural sophistication of South Kensington and the business excellence of the City, our companions seamlessly integrate into any high-society environment. Each model possesses university-level education, speaks multiple languages, and maintains the highest standards of discretion and professionalism expected by our distinguished clientele.</p>
          
          <h3>Professional Escort Services in London - Dinner Dates and Business Companions</h3>
          <p>Experience unparalleled companionship with our professional escorts who excel in various social settings. Whether accompanying you to exclusive restaurants like Sketch, The Ritz, or Rules, attending corporate functions at prestigious venues such as the Guildhall or Natural History Museum, or enjoying cultural events at the Royal Opera House or West End theatres, our models provide engaging conversation, impeccable etiquette, and sophisticated presence that enhances every occasion.</p>
          
          <h4>Elite Model Selection Process and Standards</h4>
          <p>Our rigorous selection process ensures that every escort model meets the exceptional standards expected by London's elite clientele. We carefully evaluate candidates based on their educational background, social skills, physical elegance, and ability to engage in sophisticated conversation on topics ranging from art and culture to business and international affairs. This meticulous approach guarantees that our clients receive only the finest companionship experiences in London.</p>
          
          <h4>Exclusive Areas Served Across London</h4>
          <p>Our escort models provide premium services throughout London's most prestigious postcodes, including Mayfair W1, Knightsbridge SW7, Chelsea SW3, Kensington SW5, Belgravia SW1, Covent Garden WC2, the City EC2, Canary Wharf E14, and Westminster SW1. Whether your engagement takes place at luxury hotels like The Savoy, Claridge's, or The Connaught, exclusive private members' clubs, or prestigious venues across the capital, our companions ensure exceptional experiences tailored to the sophisticated tastes of our discerning clientele.</p>
        </div>

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