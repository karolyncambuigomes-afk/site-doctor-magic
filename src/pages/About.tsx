import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Award, Heart, Users, Clock, Star } from 'lucide-react';
import aboutLuxury1 from '@/assets/about-luxury-1.jpg';
import aboutLuxury2 from '@/assets/about-luxury-2.jpg';
import aboutLuxury3 from '@/assets/about-luxury-3.jpg';

const About = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Five London",
      "description": "London's premier luxury escort agency established in 2018, providing sophisticated companionship services with complete discretion",
      "foundingDate": "2018",
      "founders": [
        {
          "@type": "Person",
          "name": "Five London Management Team"
        }
      ],
      "areaServed": "London, United Kingdom",
      "serviceType": "Luxury Companionship Services"
    }
  };

  const values = [
    {
      icon: Shield,
      title: "Discretion",
      description: "Complete confidentiality and privacy in all our services"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Uncompromising quality in every aspect of our service"
    },
    {
      icon: Heart,
      title: "Sophistication",
      description: "Refined companions for discerning gentlemen"
    },
    {
      icon: Users,
      title: "Professionalism",
      description: "Dedicated team ensuring seamless experiences"
    }
  ];


  return (
    <>
      <SEO 
        title="About Five London - Premier Luxury Escort Agency"
        description="Learn about Five London, London's most prestigious escort agency. Established in 2018, we provide sophisticated, discreet companionship services with unmatched professionalism."
        keywords="about five london, luxury escort agency history, premium escort services london, elite companion agency"
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-dark text-secondary-foreground">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-fade-in-up">
                <h1 className="heading-lg mb-6">
                  About <span className="luxury-text-gradient">Five London</span>
                </h1>
                <p className="body-minimal text-muted-foreground mb-8 leading-relaxed">
                  Since 2018, Five London has been the epitome of luxury companionship in the heart of England's capital. We've built our reputation on discretion, sophistication, and unparalleled service quality.
                </p>
                <Button 
                  className="luxury-button text-lg px-8 py-4"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Contact Us
                </Button>
              </div>
              <div className="relative animate-fade-in">
                <div className="rounded-2xl h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury1} 
                    alt="Elegant woman in luxury hotel lobby"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="heading-sm font-bold">Excellence Since 2018</h3>
                    <p className="body-sm opacity-90">London's Premier Agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Our Story */}
        <section className="py-16 bg-muted/50">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="rounded-2xl h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury2} 
                    alt="Elegant woman at fine dining restaurant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              </div>
              <div className="animate-fade-in-up">
                <h2 className="heading-md mb-6">
                  Our <span className="luxury-text-gradient">Story</span>
                </h2>
                <div className="space-y-4 body-minimal text-muted-foreground leading-relaxed">
                  <p>
                    Five London was founded with a simple yet ambitious vision: to redefine luxury companionship in London. Our founders recognized a gap in the market for truly sophisticated, intelligent, and discreet companion services.
                  </p>
                  <p>
                    What started as a boutique agency has grown into London's most respected escort service, known for our unwavering commitment to quality, discretion, and client satisfaction. We've built lasting relationships with discerning gentlemen who value sophistication and professionalism.
                  </p>
                  <p>
                    Today, Five London represents the pinnacle of luxury companionship, with a carefully curated selection of exceptional women who embody intelligence, beauty, and grace. Our success is measured not just in numbers, but in the trust our clients place in us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-background">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                Our <span className="luxury-text-gradient">Values</span>
              </h2>
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do and define who we are
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card 
                  key={value.title}
                  className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="heading-sm mb-2">{value.title}</h3>
                  <p className="body-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/50">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                Why Choose <span className="luxury-text-gradient">Five London</span>
              </h2>
              <p className="body-minimal text-muted-foreground max-w-2xl mx-auto">
                What sets us apart in London's competitive luxury market
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="luxury-card p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-sm mb-2">Rigorous Selection Process</h3>
                    <p className="body-sm text-muted-foreground">
                      Every companion undergoes a comprehensive vetting process ensuring intelligence, sophistication, and professionalism meet our exacting standards.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="luxury-card p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-sm mb-2">24/7 Concierge Service</h3>
                    <p className="body-sm text-muted-foreground">
                      Our dedicated team is available around the clock to handle bookings, special requests, and ensure your experience exceeds expectations.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="luxury-card p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-sm mb-2">Absolute Discretion</h3>
                    <p className="body-sm text-muted-foreground">
                      We understand the importance of privacy. All interactions are handled with the utmost confidentiality and professional discretion.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="luxury-card p-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="heading-sm mb-2">Unmatched Quality</h3>
                    <p className="body-sm text-muted-foreground">
                      From first contact to the conclusion of your experience, we maintain the highest standards of service and attention to detail.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="py-8 bg-background">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Excellence Section */}
        <section className="py-16 bg-background">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="heading-md mb-6">
                  Setting the <span className="luxury-text-gradient">Standard</span>
                </h2>
                <div className="space-y-4 body-minimal text-muted-foreground leading-relaxed">
                  <p>
                    Our companions are more than just beautiful faces - they are intelligent, well-educated women who can engage in meaningful conversations and adapt to any social setting with grace and poise.
                  </p>
                  <p>
                    Whether accompanying you to a business dinner, cultural event, or private occasion, our companions understand the importance of discretion and professionalism while ensuring your experience is memorable and enjoyable.
                  </p>
                </div>
              </div>
              <div className="animate-fade-in">
                <div className="rounded-2xl h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury3} 
                    alt="Sophisticated woman at art gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h2 className="heading-md mb-4">
              Experience the <span className="luxury-text-gradient">Five London Difference</span>
            </h2>
            <p className="body-minimal text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our distinguished clientele and discover why Five London is London's most trusted luxury escort agency
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                className="luxury-button text-lg px-8 py-4"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Book Your Experience
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

export default About;