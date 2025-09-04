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
        <section className="py-16 lg:py-20 bg-gradient-dark text-secondary-foreground">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="animate-fade-in-up order-1 lg:order-1">
                <h1 className="heading-lg mb-6 text-center lg:text-left">
                  About <span className="luxury-text-gradient">Five London</span>
                </h1>
                <p className="body-minimal text-muted-foreground mb-8 leading-relaxed text-center lg:text-left">
                  London's most trusted luxury escort agency. Exceptional standards, absolute discretion, uncompromising quality since 2018.
                </p>
                <div className="flex justify-center lg:justify-start">
                  <Button 
                    className="luxury-button text-lg px-8 py-4"
                    onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in order-2 lg:order-2">
                <div className="rounded-2xl h-64 md:h-80 lg:h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury1} 
                    alt="Elegant woman in luxury hotel lobby"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Our Story */}
        <section className="py-16 lg:py-20 bg-muted/50">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="animate-fade-in order-2 lg:order-1">
                <div className="rounded-2xl h-64 md:h-80 lg:h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury2} 
                    alt="Elegant woman at fine dining restaurant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </div>
              <div className="animate-fade-in-up order-1 lg:order-2 px-4 lg:px-0">
                <h2 className="heading-md mb-6 text-center lg:text-left">
                  Trust & <span className="luxury-text-gradient">Excellence</span>
                </h2>
                <p className="body-minimal text-muted-foreground leading-relaxed text-center lg:text-left">
                  We select only the most sophisticated, intelligent companions. Every detail is carefully managed with complete discretion and uncompromising standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="container-width">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="heading-md mb-4">
                Our <span className="luxury-text-gradient">Standards</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-sm mb-2">Discretion</h3>
                <p className="body-sm text-muted-foreground">Complete confidentiality in every interaction</p>
              </Card>

              <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-sm mb-2">Excellence</h3>
                <p className="body-sm text-muted-foreground">Uncompromising quality in every detail</p>
              </Card>

              <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-sm mb-2">Selectivity</h3>
                <p className="body-sm text-muted-foreground">Only the most exceptional companions</p>
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
        <section className="py-16 lg:py-20 bg-background">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="animate-fade-in-up order-1 lg:order-1 px-4 lg:px-0">
                <h2 className="heading-md mb-6 text-center lg:text-left">
                  Elite <span className="luxury-text-gradient">Companions</span>
                </h2>
                <p className="body-minimal text-muted-foreground leading-relaxed text-center lg:text-left">
                  Intelligent, educated women who excel in any social setting. Professional discretion and memorable experiences guaranteed.
                </p>
              </div>
              <div className="animate-fade-in order-2 lg:order-2">
                <div className="rounded-2xl h-64 md:h-80 lg:h-96 relative overflow-hidden">
                  <img 
                    src={aboutLuxury3} 
                    alt="Sophisticated woman at art gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
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