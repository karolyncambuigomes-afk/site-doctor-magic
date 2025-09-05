import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Award, Heart, Users, Clock, Star, Diamond, Crown, Sparkles, CheckCircle } from 'lucide-react';
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
      title: "Absolute Discretion",
      description: "Your privacy is sacred. Every interaction is conducted with the utmost confidentiality and respect."
    },
    {
      icon: Diamond,
      title: "Uncompromising Excellence",
      description: "From the first contact to the final goodbye, every detail is crafted to exceed your expectations."
    },
    {
      icon: Crown,
      title: "Elite Selection",
      description: "Our companions are not just beautiful—they're intelligent, cultured, and sophisticated conversationalists."
    },
    {
      icon: Heart,
      title: "Authentic Connections",
      description: "We believe in creating genuine moments that feel natural, comfortable, and truly memorable."
    }
  ];

  const achievements = [
    { icon: Star, text: "London's Most Trusted Agency Since 2018" },
    { icon: Users, text: "Over 500 Satisfied Distinguished Clients" },
    { icon: Award, text: "100% Confidentiality Record" },
    { icon: Sparkles, text: "24/7 Concierge Service Available" }
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
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-20 items-center">
              <div className="space-y-6 md:space-y-8 text-center lg:text-left px-4 md:px-0">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-light tracking-tight">
                  About <span className="text-primary">Five London</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                  London's most trusted luxury escort agency. Exceptional standards, absolute discretion since 2018.
                </p>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Contact Us
                </Button>
              </div>
              
              <div className="flex justify-center lg:justify-end px-4 md:px-0">
                <div className="w-full max-w-sm md:max-w-md h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden">
                  <img 
                    src={aboutLuxury1} 
                    alt="Five London"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-24 lg:py-32 bg-muted/20">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
              <div className="w-full max-w-sm md:max-w-md mx-auto lg:mx-0 h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden px-4 md:px-0">
                <img 
                  src={aboutLuxury2} 
                  alt="Fine dining experience"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-6 md:space-y-6 text-center lg:text-left px-4 md:px-0 mt-8 lg:mt-0">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight">
                  Our <span className="text-primary">Philosophy</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  We understand that true luxury isn't just about beauty—it's about intelligence, sophistication, and genuine connection.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Every companion is carefully selected for their grace, education, and ability to create authentic moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container-width">
            <div className="text-center mb-12 md:mb-16 px-4 md:px-0">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight mb-4">
                Our <span className="text-primary">Values</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">
              {values.map((value, index) => (
                <div key={index} className="text-center space-y-3 md:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-primary">
                    <value.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-base md:text-lg font-medium">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 md:py-24 lg:py-32 bg-muted/20">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
              <div className="space-y-6 md:space-y-6 text-center lg:text-left px-4 md:px-0 order-2 lg:order-1 mt-8 lg:mt-0">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight">
                  Your <span className="text-primary">Experience</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  From consultation to companionship, every detail is carefully managed with complete discretion.
                </p>
              </div>
              
              <div className="w-full max-w-sm md:max-w-md mx-auto lg:mx-0 h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden px-4 md:px-0 order-1 lg:order-2">
                <img 
                  src={aboutLuxury3} 
                  alt="Elegant experience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-background">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight">
                Experience <span className="text-primary">Five London</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Join London's most discerning gentlemen who trust Five London for exceptional companionship.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Contact Us
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.location.href = '/models'}
                >
                  View Collection
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

export default About;