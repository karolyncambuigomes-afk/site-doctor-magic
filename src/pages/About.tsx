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
        <section className="py-20 lg:py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/50 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container-width relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="animate-fade-in space-y-8 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                    <Crown className="w-4 h-4" />
                    London's Premier Luxury Agency
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
                    Where <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent font-medium">Elegance</span>
                    <br />Meets Excellence
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                    For over five years, Five London has been the discreet choice of London's most distinguished gentlemen. 
                    We don't just provide companionship—we curate extraordinary experiences.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-medium"
                    onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                  >
                    Begin Your Experience
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-3 text-base border-2"
                  >
                    View Our Collection
                  </Button>
                </div>
              </div>
              
              <div className="relative animate-fade-in">
                <div className="relative rounded-3xl overflow-hidden h-96 lg:h-[500px] shadow-2xl">
                  <img 
                    src={aboutLuxury1} 
                    alt="Elegant woman embodying Five London's sophisticated standards"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Floating stats */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">5+</div>
                      <div className="text-xs text-muted-foreground">Years Excellence</div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="animate-fade-in order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden h-96 lg:h-[500px] shadow-2xl">
                  <img 
                    src={aboutLuxury2} 
                    alt="Sophisticated dining experience at London's finest restaurant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Quote overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <blockquote className="text-white text-lg font-light italic">
                      "Sophistication is not about being noticed, it's about being remembered."
                    </blockquote>
                  </div>
                </div>
              </div>
              
              <div className="animate-fade-in space-y-8 order-1 lg:order-2 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                    <Diamond className="w-4 h-4" />
                    Our Philosophy
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                    Beyond <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-medium">Expectations</span>
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      In a world of ordinary experiences, Five London stands apart. We understand that true luxury isn't just about beauty—it's about intelligence, wit, culture, and the ability to adapt seamlessly to any social setting.
                    </p>
                    <p className="text-base leading-relaxed">
                      Every companion in our collection has been carefully selected not just for their stunning appearance, but for their sophistication, education, and genuine warmth. They are accomplished women who can engage in meaningful conversation about art, business, travel, or any topic that interests you.
                    </p>
                  </div>
                </div>
                
                {/* Achievement badges */}
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl backdrop-blur-sm">
                      <achievement.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{achievement.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 lg:py-24 bg-background relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent"></div>
          </div>
          
          <div className="container-width relative">
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                <Sparkles className="w-4 h-4" />
                What Sets Us Apart
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                The <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-medium">Five London</span> Standard
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our commitment to excellence permeates every aspect of our service, from the initial consultation to the final farewell.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="relative p-8 text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-background/50 backdrop-blur-sm border-0 shadow-lg">
                  {/* Gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="animate-fade-in space-y-8 order-1 lg:order-1 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                    <CheckCircle className="w-4 h-4" />
                    Your Experience
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                    Seamless <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-medium">Sophistication</span>
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg leading-relaxed">
                      From the moment you contact us, every detail is meticulously orchestrated. Our dedicated concierge team ensures that your experience is flawless, from initial consultation to the final moments of your encounter.
                    </p>
                    <p className="text-base leading-relaxed">
                      Whether you need a sophisticated companion for a business dinner, a cultural event, or simply wish to enjoy the company of an exceptional woman, we make it effortless. No detail is too small, no request too complex.
                    </p>
                  </div>
                </div>
                
                {/* Process steps */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold mb-1">Discreet Consultation</h4>
                      <p className="text-sm text-muted-foreground">Share your preferences and requirements in complete confidence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold mb-1">Perfect Match</h4>
                      <p className="text-sm text-muted-foreground">We select the ideal companion based on your specific needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold mb-1">Exceptional Experience</h4>
                      <p className="text-sm text-muted-foreground">Enjoy an unforgettable encounter with complete discretion</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-fade-in order-2 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden h-96 lg:h-[600px] shadow-2xl">
                  <img 
                    src={aboutLuxury3} 
                    alt="Cultured companion at exclusive London art gallery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Quote overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-white space-y-2">
                      <div className="text-6xl font-serif text-white/40">"</div>
                      <p className="text-lg font-light italic -mt-8 ml-8">
                        True elegance is about being yourself, beautifully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-primary/50 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container-width text-center relative">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  <Crown className="w-4 h-4" />
                  Ready to Begin?
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight">
                  Experience the <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-medium">Five London</span> Difference
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join London's most discerning gentlemen who trust Five London for exceptional companionship. 
                  Your extraordinary experience is just one conversation away.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-10 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Begin Your Experience
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-10 py-4 text-lg border-2 rounded-full hover:bg-primary/5 transition-all duration-300"
                  onClick={() => window.location.href = '/models'}
                >
                  Explore Our Collection
                </Button>
              </div>
              
              {/* Contact info */}
              <div className="pt-8 border-t border-border/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Available 24/7
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Complete Discretion
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Established 2018
                  </div>
                </div>
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