import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Utensils, Briefcase, Plane, Theater, Users, Calendar, Wine, Music, ChevronRight, Clock } from 'lucide-react';
import { useBlogLinks } from '@/hooks/useBlogLinks';
import { generateServiceSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const Services = () => {
  const { getBlogLinkForKeyword, getBlogTitleForKeyword } = useBlogLinks();
  
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Services", url: "https://fivelondon.com/services" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Luxury Companionship Services",
      "provider": {
        "@type": "Organization",
        "name": "Five London",
        "telephone": "+447436190679",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "London",
          "addressCountry": "GB"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "London",
        "addressCountry": "GB"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Luxury Escort Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Dinner Companion Services",
              "description": "Elegant companions for fine dining experiences at London's finest restaurants"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Business Event Companions",
              "description": "Professional companions for corporate functions and business events"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Travel Companion Services",
              "description": "Sophisticated travel companionship for business trips and leisure travel"
            }
          }
        ]
      }
    }
  ];

  const services = [
    {
      icon: Utensils,
      title: "Dinner Date Escorts",
      description: "Beautiful, intelligent companions for romantic dinner dates at London's finest restaurants",
      features: ["Michelin-starred restaurants", "Wine knowledge", "Sophisticated conversation", "Impeccable etiquette"],
      duration: "2-4 hours",
      ideal: "Perfect for romantic evenings, business dinners, or social events",
      blogLink: "/blog/best-restaurants-london-dinner-dates",
      blogTitle: "Best Restaurants in London for Special Dinner Dates"
    },
    {
      icon: Briefcase,
      title: "Corporate Event Escorts",
      description: "Elite professional companions for business events, conferences, and corporate functions",
      features: ["Corporate event experience", "Professional attire", "Business acumen", "Networking skills"],
      duration: "3-8 hours",
      ideal: "Ideal for conferences, galas, and corporate functions",
      blogLink: "/blog/exclusive-experiences-london-luxury",
      blogTitle: "Exclusive Business Experiences in London"
    },
    {
      icon: Plane,
      title: "Travel Escort Companions",
      description: "Sophisticated travel companions for business trips, luxury holidays, and international travel",
      features: ["International experience", "Cultural knowledge", "Passport ready", "Flexible schedules"],
      duration: "1-7 days",
      ideal: "Perfect for business trips or luxury getaways",
      blogLink: "/blog/luxury-hotels-london-sophisticated-stays",
      blogTitle: "Sophisticated Hotels in London"
    },
    {
      icon: Theater,
      title: "Cultural Event Escorts",
      description: "Cultured companions for theatre, opera, concerts, and London's cultural events",
      features: ["Arts appreciation", "Theatre knowledge", "Elegant evening wear", "Cultural conversations"],
      duration: "3-5 hours",
      ideal: "Wonderful for West End shows and cultural events",
      blogLink: "/blog/london-annual-events-luxury-experiences",
      blogTitle: "London's Exclusive Annual Events"
    },
    {
      icon: Users,
      title: "Social Event Escorts", 
      description: "Charming elite companions for parties, weddings, galas, and exclusive social events",
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
      title: "Overnight & Extended Escort Services",
      description: "Exclusive overnight and extended companionship for special occasions and intimate experiences",
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
        title="Elite London Escort Services | High-Class Companions | Dinner Dates & Travel"
        description="Premium escort services in London. Elite companions for dinner dates, business events, travel, intimate encounters. Beautiful, intelligent, sophisticated. Available 24/7 across Mayfair, Knightsbridge, Chelsea."
        keywords="luxury escort services London, premium companion services, dinner date escorts, business event companions, travel companion services, cultural event escorts, professional escort services, VIP companion services London, elite escort agency services"
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
                Elite Escort Services
              </h1>
              <p className="text-lg text-muted-foreground font-light">
                London's finest high-class companions for every occasion. Available 24/7.
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
                                "Michelin-starred restaurants": {
                                  text: "Michelin-starred restaurants",
                                  title: "Discover London's finest Michelin-starred restaurants for elegant dinner dates"
                                },
                                "Corporate event experience": {
                                  text: "Corporate event experience", 
                                  title: "Professional companions for exclusive London business events"
                                },
                                "International experience": {
                                  text: "International experience",
                                  title: "Sophisticated travel companions for luxury getaways"
                                },
                                "Theatre knowledge": {
                                  text: "Theatre knowledge",
                                  title: "London's exclusive annual events and cultural experiences"
                                },
                                "Event experience": {
                                  text: "Event experience",
                                  title: "Expert companions for London's premier social events"
                                },
                                "Wine knowledge": {
                                  text: "Wine knowledge", 
                                  title: "Fine dining and wine experiences in London"
                                },
                                "Music appreciation": {
                                  text: "Music appreciation",
                                  title: "London's entertainment calendar and concert experiences"
                                },
                                "Customized experiences": {
                                  text: "Customized experiences",
                                  title: "Exclusive luxury experiences in London"
                                }
                              };
                              
                              const linkConfig = linkableFeatures[feature];
                              
                              return (
                                <div key={i} className="flex items-center text-sm text-muted-foreground">
                                  <div className="w-1 h-1 bg-primary rounded-full mr-3"></div>
                                  {linkConfig ? (
                                    (() => {
                                      const dynamicLink = getBlogLinkForKeyword(feature);
                                      const dynamicTitle = getBlogTitleForKeyword(feature);
                                      return dynamicLink ? (
                                        <Link 
                                          to={dynamicLink}
                                          className="text-primary hover:text-primary/80 transition-colors underline"
                                          title={dynamicTitle || linkConfig.title}
                                          aria-label={dynamicTitle || linkConfig.title}
                                        >
                                          {linkConfig.text}
                                        </Link>
                                      ) : (
                                        <Link 
                                          to={service.blogLink}
                                          className="text-primary hover:text-primary/80 transition-colors underline"
                                          title={linkConfig.title}
                                          aria-label={linkConfig.title}
                                        >
                                          {linkConfig.text}
                                        </Link>
                                      );
                                    })()
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
                            title={`Read more about ${service.title.toLowerCase()} - ${service.blogTitle}`}
                            aria-label={`Learn more about ${service.title.toLowerCase()} experiences in London`}
                          >
                            <span>Read related article: {service.blogTitle}</span>
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
                Book Your Elite Escort Now
              </h2>
              <p className="text-muted-foreground mb-8">
                Available 24/7 across London. Instant booking via WhatsApp.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Book Now - Available 24/7
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