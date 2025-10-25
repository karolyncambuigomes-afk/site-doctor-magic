import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
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
      description: "Beautiful, intelligent companions for romantic dinner dates at London's finest restaurants, offering sophisticated conversation, wine expertise, and impeccable social grace for memorable culinary experiences across London's elite dining establishments.",
      features: ["Michelin-starred restaurants", "Wine knowledge", "Sophisticated conversation", "Impeccable etiquette", "Fine dining experience", "Restaurant recommendations", "Cultural awareness", "Private dining arrangements"],
      duration: "2-4 hours",
      ideal: "Perfect for romantic evenings, business dinners, or social events",
      blogLink: "/blog/best-restaurants-london-dinner-dates",
      blogTitle: "Best Restaurants in London for Special Dinner Dates",
      extendedContent: "Our dinner date escorts are connoisseurs of London's culinary scene, with intimate knowledge of establishments from Rules (London's oldest restaurant) to contemporary Michelin-starred venues like Core by Clare Smyth. They excel at creating memorable dining experiences whether at Sketch's quirky pink room, the sophisticated atmosphere of Dinner by Heston Blumenthal, or intimate wine bars in Covent Garden. Each companion possesses extensive knowledge of wine pairings, international cuisine, and dining etiquette, ensuring seamless experiences at any venue from casual gastropubs to exclusive private dining rooms. Their cultural sophistication extends to understanding seasonal menus, chef specialties, and the perfect balance of engaging conversation that enhances rather than overshadows the culinary experience."
    },
    {
      icon: Briefcase,
      title: "Corporate Event Escorts",
      description: "Elite professional companions for business events, conferences, and corporate functions, providing sophisticated representation, networking expertise, and professional grace for high-level business occasions across London's corporate landscape.",
      features: ["Corporate event experience", "Professional attire", "Business acumen", "Networking skills", "Industry knowledge", "Executive presence", "International protocols", "Client entertainment"],
      duration: "3-8 hours",
      ideal: "Ideal for conferences, galas, and corporate functions",
      blogLink: "/blog/exclusive-experiences-london-luxury",
      blogTitle: "Exclusive Business Experiences in London",
      extendedContent: "Our corporate event escorts possess MBA-level business understanding and extensive experience in London's financial districts including Canary Wharf, the City, and Mayfair's corporate venues. They excel at representing clients at high-profile events such as the London Business Awards, financial sector conferences, product launches at venues like the Guildhall, and exclusive networking events at private members' clubs. With backgrounds in finance, consulting, and international business, they engage intelligently in discussions about market trends, industry developments, and global business practices. Their professional wardrobe and executive presence ensure perfect representation at any corporate function, from intimate boardroom dinners to large-scale industry conferences at ExCeL London or the Barbican Centre."
    },
    {
      icon: Plane,
      title: "Travel Escort Companions",
      description: "Sophisticated travel companions for business trips, luxury holidays, and international travel, providing cultured conversation, local expertise, and elegant companionship for destinations worldwide including Paris, Monaco, Dubai, and New York.",
      features: ["International experience", "Cultural knowledge", "Passport ready", "Flexible schedules", "Multilingual abilities", "Luxury travel expertise", "Time zone adaptability", "Global networking"],
      duration: "1-7 days",
      ideal: "Perfect for business trips or luxury getaways",
      blogLink: "/blog/luxury-hotels-london-sophisticated-stays",
      blogTitle: "Sophisticated Hotels in London",
      extendedContent: "Our travel companions are seasoned international travelers with passports ready for immediate departure to destinations like Paris, Monaco, Dubai, New York, or the Swiss Alps. They possess extensive knowledge of luxury hotels including the George V in Paris, Hotel Hermitage in Monaco, Burj Al Arab in Dubai, and The Plaza in New York. With cultural fluency in multiple languages and deep understanding of international business etiquette, they seamlessly adapt to different time zones, currencies, and social customs. Their travel wardrobes are equipped for any climate or occasion, from business meetings in Hong Kong to yacht parties in the Mediterranean, ensuring perfect presentation at every destination."
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
      <SEOOptimized 
        title="Elite London Escort Services | High-Class Companions | Dinner Dates & Travel"
        description="Premium escort services in London. Elite companions for dinner dates, business events, travel, intimate encounters. Beautiful, intelligent, sophisticated. Available 24/7 across Mayfair, Knightsbridge, Chelsea."
        keywords="luxury escort services London, premium companion services, dinner date escorts, business event companions, travel companion services, cultural event escorts, professional escort services, VIP companion services London, elite escort agency services"
        canonicalUrl="/services"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                Elite Companion Services
              </h1>
              <p className="luxury-body-lg text-black mb-12 md:mb-12">
                Premium services from £500/hour. London's finest companions ready now.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>

        {/* Minimal Services Accordion */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-width">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]} className="space-y-3 sm:space-y-4">
                {services.map((service, index) => (
                  <AccordionItem 
                    key={service.title} 
                    value={`item-${index}`}
                    className="border border-border/30 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-1 sm:py-2 hover:border-primary/30 transition-all duration-300 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 sm:py-6 text-left">
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 w-full">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="luxury-heading-sm mb-1 text-black">{service.title}</h3>
                          <p className="luxury-body-xs text-black hidden sm:block">{service.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 luxury-body-xs sm:luxury-body-sm text-black">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                          <span className="hidden sm:inline">{service.duration}</span>
                          <span className="sm:hidden">{service.duration.split('-')[0]}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                     <AccordionContent className="pb-4 sm:pb-6">
                      <div className="ml-6 sm:ml-12 md:ml-16 space-y-4 sm:space-y-6">
                         {/* Mobile description */}
                          <div className="sm:hidden">
                            <p className="luxury-body-xs text-black">{service.description}</p>
                          </div>
                        
                        {/* Extended Content (Hidden SEO) */}
                        {service.extendedContent && (
                          <div className="sr-only">
                            <h4>Detailed {service.title} Information</h4>
                            <p>{service.extendedContent}</p>
                          </div>
                        )}
                        
                         {/* Features */}
                         <div>
                           <h4 className="luxury-body-xs sm:luxury-body-sm font-medium text-black mb-2 sm:mb-3">What's Included</h4>
                          <div className="grid grid-cols-1 gap-1 sm:gap-2">
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
                                 <div key={i} className="flex items-center luxury-body-xs sm:luxury-body-sm text-black">
                                   <div className="w-1 h-1 bg-black rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                                  {linkConfig ? (
                                    (() => {
                                      const dynamicLink = getBlogLinkForKeyword(feature);
                                      const dynamicTitle = getBlogTitleForKeyword(feature);
                                      return dynamicLink ? (
                                        <Link 
                                          to={dynamicLink}
                                          className="text-black hover:text-gray-600 transition-colors underline"
                                          title={dynamicTitle || linkConfig.title}
                                          aria-label={dynamicTitle || linkConfig.title}
                                        >
                                          {linkConfig.text}
                                        </Link>
                                      ) : (
                                        <Link 
                                          to={service.blogLink}
                                          className="text-black hover:text-gray-600 transition-colors underline"
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
                          <p className="luxury-body-xs sm:luxury-body-sm text-muted-foreground italic">
                            {service.ideal}
                          </p>
                        </div>

                        {/* Blog link */}
                        <div className="pt-3 sm:pt-4 border-t border-border/30">
                          <Link 
                            to={service.blogLink}
                            className="inline-flex items-center luxury-body-xs sm:luxury-body-sm text-primary hover:text-primary/80 transition-colors"
                            title={`Read more about ${service.title.toLowerCase()} - ${service.blogTitle}`}
                            aria-label={`Learn more about ${service.title.toLowerCase()} experiences in London`}
                          >
                            <span className="hidden sm:inline">Read related article: {service.blogTitle}</span>
                            <span className="sm:hidden">Read more</span>
                            <ChevronRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
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

        {/* About Our Premium Services - Collapsible Rich Content */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="luxury-heading-lg text-foreground">About Our Premium Services</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Dinner Date and Social Companionship</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Experience London's finest dining venues with sophisticated companions who excel in creating memorable social experiences. From intimate dinners at Michelin-starred restaurants to elegant cocktail receptions, our elite escorts provide engaging conversation and refined companionship.
                  </p>
                  <p className="luxury-body-md text-gray-700 leading-relaxed">
                    Perfect for business entertainment, special celebrations, or romantic evenings at prestigious venues including The Ritz, Sketch, and exclusive private dining rooms throughout Mayfair and Knightsbridge.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Business and Travel Companion Services</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Corporate Events</h4>
                      <p className="luxury-body-xs text-gray-600">Professional accompaniment for business functions, networking events, and corporate entertainment in the City and Canary Wharf.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Travel Companionship</h4>
                      <p className="luxury-body-xs text-gray-600">Sophisticated travel companions for business trips, weekend getaways, and luxury holidays worldwide.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Cultural Experiences</h4>
                      <p className="luxury-body-xs text-gray-600">Elegant companions for theatre evenings, gallery openings, and exclusive cultural events throughout London.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Minimal Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-extralight mb-3 sm:mb-4 text-black">
                Ready to Book? Call Now
              </h2>
              <p className="text-sm sm:text-base text-black mb-6 sm:mb-8">
                Most companions available same day. Call now for instant booking confirmation.
              </p>
              <Button 
                className="bg-black text-white hover:bg-gray-800 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Call Now - Same Day Available
              </Button>
            </div>
          </div>
        </section>
      </main>

      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};

export default Services;