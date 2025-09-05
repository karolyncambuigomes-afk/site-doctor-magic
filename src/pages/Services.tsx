import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Utensils, Briefcase, Plane, Theater, Users, Calendar, Wine, Music, ExternalLink } from 'lucide-react';

const Services = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Luxury Companionship Services",
    "provider": {
      "@type": "Organization",
      "name": "Five London"
    },
    "areaServed": "London, United Kingdom",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Luxury Escort Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Dinner Dates",
            "description": "Elegant companions for fine dining experiences"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Business Events",
            "description": "Professional companions for corporate functions"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Travel Companion",
            "description": "Sophisticated travel companionship services"
          }
        }
      ]
    }
  };

  const services = [
    {
      icon: Utensils,
      title: "Dinner Dates",
      description: "Elegant companions for fine dining experiences at London's most prestigious restaurants",
      features: ["Michelin-starred restaurants", "Wine knowledge", "Sophisticated conversation", "Impeccable etiquette"],
      duration: "2-4 hours",
      ideal: "Perfect for romantic evenings or business dinners",
      blogLink: "/blog/best-restaurants-london-dinner-dates",
      blogTitle: "Best Restaurants in London for Special Dinner Dates"
    },
    {
      icon: Briefcase,
      title: "Business Events",
      description: "Professional and sophisticated companions for corporate functions and networking events",
      features: ["Corporate event experience", "Professional attire", "Business acumen", "Networking skills"],
      duration: "3-8 hours",
      ideal: "Ideal for conferences, galas, and corporate functions",
      blogLink: "/blog/exclusive-experiences-london-luxury",
      blogTitle: "Exclusive Business Experiences in London"
    },
    {
      icon: Plane,
      title: "Travel Companion",
      description: "Cultured and well-traveled companions for business trips and luxury vacations",
      features: ["International experience", "Cultural knowledge", "Passport ready", "Flexible schedules"],
      duration: "1-7 days",
      ideal: "Perfect for business trips or luxury getaways",
      blogLink: "/blog/luxury-hotels-london-sophisticated-stays",
      blogTitle: "Sophisticated Hotels in London"
    },
    {
      icon: Theater,
      title: "Theatre & Opera",
      description: "Culturally sophisticated companions for London's finest entertainment venues",
      features: ["Arts appreciation", "Theatre knowledge", "Elegant evening wear", "Cultural conversations"],
      duration: "3-5 hours",
      ideal: "Wonderful for West End shows and cultural events",
      blogLink: "/blog/london-annual-events-luxury-experiences",
      blogTitle: "London's Exclusive Annual Events"
    },
    {
      icon: Users,
      title: "Social Events",
      description: "Charming companions for parties, weddings, and exclusive social gatherings",
      features: ["Social grace", "Adaptability", "Engaging personality", "Event experience"],
      duration: "4-8 hours",
      ideal: "Great for weddings, parties, and social occasions",
      blogLink: "/blog/london-annual-events-luxury-experiences",
      blogTitle: "London's Social Calendar"
    },
    {
      icon: Wine,
      title: "Wine & Cocktails",
      description: "Sophisticated companions for wine tastings, cocktail events, and bar experiences",
      features: ["Wine knowledge", "Cocktail appreciation", "Bar etiquette", "Lively conversation"],
      duration: "2-4 hours",
      ideal: "Perfect for wine bars and cocktail lounges",
      blogLink: "/blog/best-restaurants-london-dinner-dates",
      blogTitle: "Fine Dining & Wine Experiences"
    },
    {
      icon: Music,
      title: "Entertainment Events",
      description: "Vivacious companions for concerts, festivals, and entertainment venues",
      features: ["Music appreciation", "Event enthusiasm", "Social energy", "Entertainment knowledge"],
      duration: "3-6 hours",
      ideal: "Excellent for concerts and entertainment events",
      blogLink: "/blog/london-annual-events-luxury-experiences",
      blogTitle: "London's Entertainment Calendar"
    },
    {
      icon: Calendar,
      title: "Extended Companionship",
      description: "Longer arrangements for special occasions or extended social needs",
      features: ["Flexible scheduling", "Personal attention", "Customized experiences", "Dedicated service"],
      duration: "8+ hours",
      ideal: "For special occasions and extended engagements",
      blogLink: "/blog/exclusive-experiences-london-luxury",
      blogTitle: "Exclusive Experiences in London"
    }
  ];

  return (
    <>
      <SEO 
        title="Luxury Escort Services in London - Five London"
        description="Explore Five London's comprehensive range of luxury escort services including dinner dates, business events, travel companions, and cultural experiences. Available 24/7."
        keywords="luxury escort services london, dinner date escort, business event companion, travel escort, theatre companion, social event escort"
        canonicalUrl="/services"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Sophisticated Hero Section */}
        <section className="relative py-32 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
          <div className="container-width text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-light mb-8 tracking-tight">
                Bespoke <span className="bg-gradient-to-r from-primary via-muted-foreground to-primary bg-clip-text text-transparent">Experiences</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed">
                Curated companionship for the discerning individual. 
                <br className="hidden sm:block" />
                Where sophistication meets unparalleled service.
              </p>
            </div>
          </div>
        </section>

        {/* Premium Services Grid */}
        <section className="py-24 bg-background">
          <div className="container-width">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-light mb-6 tracking-tight">
                Our <span className="text-primary">Services</span>
              </h2>
              <div className="w-24 h-0.5 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service, index) => (
                <div 
                  key={service.title}
                  className="group relative bg-card border border-border/40 rounded-3xl p-8 hover:border-primary/30 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors duration-500">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-light mb-4 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Duration */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-sm text-muted-foreground">{service.duration}</span>
                      <div className="w-6 h-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional Services */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.slice(6).map((service, index) => (
                <div 
                  key={service.title}
                  className="group bg-card border border-border/40 rounded-3xl p-10 hover:border-primary/30 transition-all duration-700 hover:shadow-xl"
                >
                  <div className="flex items-start space-x-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-500">
                      <service.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-light mb-4 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-3">Duration:</span>
                        <span className="text-primary font-medium">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Elegant Process Section */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]"></div>
          <div className="container-width relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-light mb-6 tracking-tight">
                How It <span className="text-primary">Works</span>
              </h2>
              <div className="w-24 h-0.5 bg-primary mx-auto"></div>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    step: "01",
                    title: "Consultation",
                    description: "Discuss your preferences and requirements with our dedicated concierge team",
                    icon: "💬"
                  },
                  {
                    step: "02", 
                    title: "Selection",
                    description: "We carefully match you with the perfect companion based on your unique needs",
                    icon: "✨"
                  },
                  {
                    step: "03",
                    title: "Experience",
                    description: "Enjoy an exceptional encounter crafted to exceed your expectations",
                    icon: "🌟"
                  }
                ].map((step, index) => (
                  <div 
                    key={step.step}
                    className="text-center group"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative mb-8">
                      <div className="w-24 h-24 mx-auto bg-card border border-border/40 rounded-full flex items-center justify-center text-2xl group-hover:border-primary/50 transition-all duration-500 group-hover:shadow-lg">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-light mb-4 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-muted/20">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-light mb-8 tracking-tight">
                Begin Your <span className="text-primary">Journey</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Contact our concierge team to arrange your bespoke experience. 
                Discretion and excellence, guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Start Consultation
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-primary/30 text-foreground hover:bg-primary/10 px-12 py-4 text-lg rounded-full transition-all duration-300"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Services;