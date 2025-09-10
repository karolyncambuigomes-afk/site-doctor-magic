import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { ModelsGallery } from '@/components/ModelsGallery';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const ModelGallery: React.FC = () => {
  return (
    <>
      <SEO 
        title="Model Gallery - Elegant London Companions | Five London"
        description="Browse our exclusive gallery of sophisticated and elegant London companions. View photos and profiles of our premium models available for companionship."
        keywords="model gallery, London companions, elegant escorts, premium models, sophisticated companions, escort gallery"
        canonicalUrl="/model-gallery"
      />
      <Navigation />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Breadcrumbs items={[{ label: 'Model Gallery' }]} />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
                Model Gallery
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover our exclusive collection of sophisticated London companions. 
                Each model represents the pinnacle of elegance, intelligence, and charm.
              </p>
            </div>
          </div>
        </section>

        {/* Models Gallery */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ModelsGallery />
          </div>
        </section>

        {/* Premium Notice */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-light text-foreground">
              Exclusive Access Available
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Some content is exclusively available to our premium members. 
              Join our membership to unlock access to our complete gallery and additional features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/membership" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View Membership Options
              </a>
              <a 
                href="/contact" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};