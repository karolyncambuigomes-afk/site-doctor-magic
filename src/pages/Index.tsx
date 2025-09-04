import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { Shield, Clock, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ModelCard } from '@/components/ModelCard';
import { models } from '@/data/models';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Five London",
    "description": "London's premier luxury escort agency providing sophisticated companionship services",
    "url": "https://fivelondon.com",
    "logo": "https://fivelondon.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-20-4567-8901",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Discreet",
      description: "Complete confidentiality and privacy guaranteed"
    },
    {
      icon: Clock,
      title: "Available",
      description: "24/7 service with immediate confirmation"
    },
    {
      icon: Heart,
      title: "Curated",
      description: "Each companion personally vetted for sophistication"
    },
    {
      icon: Star,
      title: "Premium",
      description: "Luxury experiences tailored to exceed expectations"
    }
  ];

  return (
    <>
      <SEO 
        title="Premium Luxury Escort Services in London"
        description="Five London offers sophisticated, discreet luxury escort services in London. Book elite companions for dinner dates, business events, and social occasions. Available 24/7."
        keywords="luxury escort london, premium escort services, high-class companions london, elite escort agency, sophisticated escorts, VIP companion services"
        canonicalUrl="/"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main>
        <HeroSection />
        
        {/* Featured Companions - Ultra Minimal */}
        <section className="py-8">
          <div className="container-width-lg">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-6">
                Selected Companions
              </h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {models.slice(0, 4).map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/models">
                <button className="five-london-button-outline">
                  View All
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Philosophy - Ultra Minimal */}
        <section className="py-8 bg-gradient-subtle">
          <div className="container-width">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="space-y-8">
                <h2 className="heading-lg">
                  Our Philosophy
                </h2>
                <p className="body-luxury">
                  We believe luxury lies in the details — the perfect conversation, 
                  the thoughtful gesture, the seamless experience that transforms 
                  an evening into an unforgettable memory.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {features.map((feature) => (
                  <div key={feature.title} className="space-y-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 text-muted-foreground">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="heading-sm">{feature.title}</h3>
                      <p className="body-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="py-8">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-8">
                <h2 className="heading-lg">
                  Begin Your Experience
                </h2>
                <p className="body-luxury">
                  Contact us to arrange your perfect companion. 
                  Available 24/7 for immediate bookings.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <Link to="/contact">
                  <button className="five-london-button">
                    Enquire Now
                  </button>
                </Link>
                <a 
                  href="tel:+442045678901"
                  className="caption hover:text-foreground transition-luxury"
                >
                  +44 20 4567 8901
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Index;