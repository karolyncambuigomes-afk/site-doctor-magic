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
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h1 className="heading-lg mb-6 animate-fade-in-up">
              Our <span className="luxury-text-gradient">Services</span>
            </h1>
            <p className="body-minimal text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Sophisticated companionship tailored to every occasion. From intimate dinner dates to exclusive business events, experience luxury redefined.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                Exquisite <span className="luxury-text-gradient">Experiences</span>
              </h2>
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto">
                Each service crafted to perfection with uncompromising attention to detail
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {services.map((service, index) => (
                <Card 
                  key={service.title}
                  className="luxury-card p-6 group hover:scale-[1.02] transition-all duration-500 border-0 shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                      <service.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-sm mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                      <p className="body-sm text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Included Features</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.features.map((feature, i) => (
                              <div key={i} className="flex items-center text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-primary">Duration:</span>
                              <span className="text-sm text-muted-foreground">{service.duration}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground/80 italic mt-3">
                            {service.ideal}
                          </p>
                          
                          {/* Blog Link */}
                          <div className="mt-4 pt-3 border-t border-border/30">
                            <Link 
                              to={service.blogLink}
                              className="inline-flex items-center text-xs text-primary hover:text-primary/80 transition-colors group"
                            >
                              <span className="mr-2">📖</span>
                              <span className="underline decoration-dotted underline-offset-2 group-hover:decoration-solid">
                                {service.blogTitle}
                              </span>
                              <ExternalLink className="ml-2 w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Process */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                How to <span className="luxury-text-gradient">Book</span>
              </h2>
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto">
                Our discreet and seamless booking process ensures your perfect experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Service",
                  description: "Browse our curated services and select the perfect experience"
                },
                {
                  step: "02", 
                  title: "Contact Our Team",
                  description: "Reach out discreetly to discuss your requirements"
                },
                {
                  step: "03",
                  title: "Enjoy Your Experience",
                  description: "Meet your chosen companion for an unforgettable encounter"
                }
              ].map((step, index) => (
                <Card 
                  key={step.step}
                  className="luxury-card p-6 text-center relative overflow-hidden border-0 shadow-lg group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute top-3 right-3 text-4xl font-bold text-primary/8 group-hover:text-primary/12 transition-colors">
                    {step.step}
                  </div>
                  <div className="relative z-10">
                    <h3 className="heading-sm mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="body-sm text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Information */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                <span className="luxury-text-gradient">Transparent</span> Pricing
              </h2>
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto">
                Competitive rates with complete transparency and no hidden fees
              </p>
            </div>

            <Card className="luxury-card p-10 max-w-5xl mx-auto border-0 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="heading-sm mb-6">What's Included</h3>
                  <div className="space-y-4">
                    {[
                      "Professional companion service",
                      "Sophisticated conversation and companionship", 
                      "Elegant presentation and attire",
                      "Complete discretion and confidentiality",
                      "Dedicated concierge support"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0"></div>
                        <span className="body-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="heading-sm mb-6">Additional Information</h3>
                  <div className="space-y-4">
                    {[
                      "Rates vary by companion and duration",
                      "Travel expenses separate for outcalls",
                      "Payment required in advance", 
                      "Cancellation policy applies",
                      "Custom packages available"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-accent rounded-full mr-4 flex-shrink-0"></div>
                        <span className="body-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-center mt-10 pt-8 border-t border-border/50">
                <p className="body-sm text-muted-foreground mb-6">
                  For detailed pricing information and custom packages, please contact our team
                </p>
                <Button 
                  className="luxury-button text-lg px-8 py-4"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Get Pricing Information
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h2 className="heading-md mb-4">
              Ready to <span className="luxury-text-gradient">Book Your Experience</span>?
            </h2>
            <p className="body-minimal text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our concierge team to arrange your perfect companion for any occasion
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                className="luxury-button text-lg px-8 py-4"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Book Now
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 border-2 border-primary/30 text-secondary-foreground hover:bg-primary/10"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Services;