import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Briefcase, Plane, Theater, Users, Calendar, Wine, Music } from 'lucide-react';

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
      ideal: "Perfect for romantic evenings or business dinners"
    },
    {
      icon: Briefcase,
      title: "Business Events",
      description: "Professional and sophisticated companions for corporate functions and networking events",
      features: ["Corporate event experience", "Professional attire", "Business acumen", "Networking skills"],
      duration: "3-8 hours",
      ideal: "Ideal for conferences, galas, and corporate functions"
    },
    {
      icon: Plane,
      title: "Travel Companion",
      description: "Cultured and well-traveled companions for business trips and luxury vacations",
      features: ["International experience", "Cultural knowledge", "Passport ready", "Flexible schedules"],
      duration: "1-7 days",
      ideal: "Perfect for business trips or luxury getaways"
    },
    {
      icon: Theater,
      title: "Theatre & Opera",
      description: "Culturally sophisticated companions for London's finest entertainment venues",
      features: ["Arts appreciation", "Theatre knowledge", "Elegant evening wear", "Cultural conversations"],
      duration: "3-5 hours",
      ideal: "Wonderful for West End shows and cultural events"
    },
    {
      icon: Users,
      title: "Social Events",
      description: "Charming companions for parties, weddings, and exclusive social gatherings",
      features: ["Social grace", "Adaptability", "Engaging personality", "Event experience"],
      duration: "4-8 hours",
      ideal: "Great for weddings, parties, and social occasions"
    },
    {
      icon: Wine,
      title: "Wine & Cocktails",
      description: "Sophisticated companions for wine tastings, cocktail events, and bar experiences",
      features: ["Wine knowledge", "Cocktail appreciation", "Bar etiquette", "Lively conversation"],
      duration: "2-4 hours",
      ideal: "Perfect for wine bars and cocktail lounges"
    },
    {
      icon: Music,
      title: "Entertainment Events",
      description: "Vivacious companions for concerts, festivals, and entertainment venues",
      features: ["Music appreciation", "Event enthusiasm", "Social energy", "Entertainment knowledge"],
      duration: "3-6 hours",
      ideal: "Excellent for concerts and entertainment events"
    },
    {
      icon: Calendar,
      title: "Extended Companionship",
      description: "Longer arrangements for special occasions or extended social needs",
      features: ["Flexible scheduling", "Personal attention", "Customized experiences", "Dedicated service"],
      duration: "8+ hours",
      ideal: "For special occasions and extended engagements"
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
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 animate-fade-in-up">
              Our <span className="luxury-text-gradient">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              From intimate dinner dates to exclusive business events, we provide sophisticated companionship tailored to every occasion and preference
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-8 bg-background">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card 
                  key={service.title}
                  className="luxury-card p-8 group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-heading font-bold mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Features</h4>
                          <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                            {service.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-semibold text-primary">Duration: </span>
                            <span className="text-muted-foreground">{service.duration}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground italic">
                          {service.ideal}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Process */}
        <section className="py-8 bg-muted/50">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                How to <span className="luxury-text-gradient">Book</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our simple and discreet booking process ensures your perfect experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Service",
                  description: "Browse our services and select the perfect companionship experience for your needs"
                },
                {
                  step: "02", 
                  title: "Contact Our Team",
                  description: "Reach out via phone, email, or our contact form to discuss your requirements"
                },
                {
                  step: "03",
                  title: "Enjoy Your Experience",
                  description: "Meet your chosen companion and enjoy an unforgettable, sophisticated experience"
                }
              ].map((step, index) => (
                <Card 
                  key={step.step}
                  className="luxury-card p-8 text-center relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                    {step.step}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-heading font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Information */}
        <section className="py-8 bg-background">
          <div className="container-width">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                <span className="luxury-text-gradient">Transparent</span> Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our rates are competitive and transparent with no hidden fees
              </p>
            </div>

            <Card className="luxury-card p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-4">What's Included</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Professional companion service
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Sophisticated conversation and companionship
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Elegant presentation and attire
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Complete discretion and confidentiality
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Dedicated concierge support
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-4">Additional Information</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Rates vary by companion and duration
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Travel expenses separate for outcalls
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Payment required in advance
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Cancellation policy applies
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      Custom packages available
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground mb-4">
                  For detailed pricing information and custom packages, please contact our team
                </p>
                <Button className="luxury-button text-lg px-8 py-4">
                  Get Pricing Information
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to <span className="luxury-text-gradient">Book Your Experience</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our concierge team to arrange your perfect companion for any occasion
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="luxury-button text-lg px-8 py-4">
                Book Now
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 border-2 border-primary/30 text-secondary-foreground hover:bg-primary/10"
              >
                Call: +44 20 4567 8901
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