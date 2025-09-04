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

  // Debug - verificar se models está carregando
  console.log('Models array:', models, 'Length:', models?.length);

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
        
        {/* Loro Piana Style - Models Gallery */}
        <section className="py-16 md:py-20 lg:py-24 bg-background">
          <div className="container-width-lg">
            {/* Minimal Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-lg md:text-xl font-light tracking-[0.2em] uppercase text-foreground mb-4">
                Our Companions
              </h2>
              <div className="w-16 h-px bg-foreground/20 mx-auto"></div>
            </div>

            {/* Gallery Grid - Loro Piana Style */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {models && models.length > 0 ? models.slice(0, 8).map((model, index) => (
                <Link 
                  key={model.id}
                  to={`/models/${model.id}`} 
                  className="group block relative overflow-hidden aspect-[3/4] bg-muted"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={model.image}
                    alt={`${model.name} - Luxury Companion`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle Overlay - Only on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                  
                  {/* Minimal Info - Bottom Left */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                    <div className="text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-sm sm:text-base md:text-lg font-light mb-1">
                        {model.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80">
                        {model.location}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground">No models available</p>
                </div>
              )}
            </div>

            {/* View All Button - Loro Piana Style */}
            <div className="text-center mt-12 md:mt-16">
              <Link to="/models" className="group inline-block">
                <div className="border border-foreground/20 group-hover:border-foreground/40 transition-all duration-300 px-8 py-3">
                  <span className="text-sm tracking-[0.2em] uppercase font-light text-foreground group-hover:text-foreground/80 transition-colors">
                    View All
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Minimal Contact Section - Loro Piana Style */}
        <section className="py-16 md:py-20 bg-muted/10">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-lg md:text-xl font-light tracking-[0.2em] uppercase text-foreground">
                Begin Your Experience
              </h2>
              
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Contact us to arrange your perfect companion. Available 24/7 for immediate bookings.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <Link to="/contact" className="group">
                  <div className="border border-foreground/20 group-hover:border-foreground/40 transition-all duration-300 px-8 py-3">
                    <span className="text-sm tracking-[0.2em] uppercase font-light text-foreground group-hover:text-foreground/80 transition-colors">
                      Enquire Now
                    </span>
                  </div>
                </Link>
                <a 
                  href="tel:+442045678901"
                  className="text-sm tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors"
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