import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Utensils, Briefcase, Plane, Theater, Users, Calendar, Wine, Music, ChevronRight, Clock } from 'lucide-react';

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
        {/* Minimal Hero */}
        <section className="py-24 bg-background">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl lg:text-6xl font-extralight mb-6 tracking-tight">
                Services
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                Sophisticated companionship for every occasion
              </p>
            </div>
          </div>
        </section>

        {/* Minimal Services Accordion */}
        <section className="py-16 bg-background">
          <div className="container-width">
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {services.map((service, index) => (
                  <AccordionItem 
                    key={service.title} 
                    value={`item-${index}`}
                    className="border border-border/30 rounded-2xl px-6 py-2 hover:border-primary/30 transition-all duration-300 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="hover:no-underline py-6 text-left">
                      <div className="flex items-center space-x-4 w-full">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-light mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="ml-16 space-y-6">
                        {/* Features */}
                        <div>
                          <h4 className="text-sm font-medium text-primary mb-3">What's Included</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.features.map((feature, i) => {
                              const linkableFeatures = {
                                "Michelin-starred restaurants": true,
                                "Corporate event experience": true,
                                "International experience": true,
                                "Theatre knowledge": true,
                                "Event experience": true,
                                "Wine knowledge": true,
                                "Music appreciation": true,
                                "Customized experiences": true
                              };
                              
                              return (
                                <div key={i} className="flex items-center text-sm text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-3"></div>
                                  {linkableFeatures[feature] ? (
                                    <Link 
                                      to={service.blogLink}
                                      className="text-primary hover:text-primary/80 transition-colors underline"
                                    >
                                      {feature}
                                    </Link>
                                  ) : (
                                    feature
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Ideal for */}
                        <div>
                          <p className="text-sm text-muted-foreground italic">
                            {service.ideal}
                          </p>
                        </div>

                        {/* Blog link */}
                        <div className="pt-4 border-t border-border/30">
                          <Link 
                            to={service.blogLink}
                            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <span>Related article</span>
                            <ChevronRight className="ml-1 w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Minimal Contact Section */}
        <section className="py-24 bg-muted/20">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-extralight mb-4">
                Ready to begin?
              </h2>
              <p className="text-muted-foreground mb-8">
                Contact our team for a consultation
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Get in touch
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