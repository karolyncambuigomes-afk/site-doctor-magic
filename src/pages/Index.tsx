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
        
        {/* Featured Companions - Elegant Design */}
        <section className="py-20 lg:py-24 bg-background relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-accent to-primary rounded-full blur-3xl"></div>
          </div>
          
          <div className="container-width-lg relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center space-x-4 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <span className="caption text-primary tracking-[0.3em]">CURATED SELECTION</span>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
              
              <h2 className="heading-lg mb-6">
                Selected <span className="luxury-text-gradient">Companions</span>
              </h2>
              
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Meet our carefully selected companions, each embodying elegance, sophistication, 
                and the highest standards of discretion for your perfect London experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {models.slice(0, 4).map((model, index) => (
                <div 
                  key={model.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <ModelCard model={model} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/models" className="group">
                <button className="luxury-button px-10 py-4 text-base relative overflow-hidden">
                  <span className="relative z-10">View All Companions</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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