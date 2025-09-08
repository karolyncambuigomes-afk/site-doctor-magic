import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Award, Heart, Users, Clock, Star, Diamond, Crown, Sparkles, CheckCircle } from 'lucide-react';
import aboutLuxury1 from '@/assets/about-luxury-1.jpg';
import aboutLuxury2 from '@/assets/about-luxury-2.jpg';
import aboutLuxury3 from '@/assets/about-luxury-3.jpg';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';

const About = () => {
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "About Us", url: "https://fivelondon.com/about" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Five London",
        "description": "London's premier luxury escort agency established with a commitment to providing sophisticated companionship services with complete discretion and uncompromising excellence",
        "foundingDate": "2020",
        "areaServed": {
          "@type": "City",
          "name": "London",
          "addressCountry": "GB"
        },
        "serviceType": "Luxury Companionship Services",
        "hasCredential": [
          "Verified Agency",
          "Discrete Service Provider",
          "Premium Quality Assurance"
        ]
      }
    }
  ];

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
        title="About Five London | Elite London Escort Agency Since 2018 | Premium Companions"
        description="London's most trusted high-class escort agency since 2018. Elite companions offering exceptional beauty, intelligence, and sophistication. Discreet, professional service across Mayfair, Knightsbridge, Chelsea."
        keywords="about Five London, luxury escort agency London, premium companion services, elite escort agency, sophisticated companions London, high-class escort services, VIP escort agency, professional companion services, exclusive escort London"
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main id="main-content" className="pt-12 sm:pt-16">
        {/* Breadcrumbs */}
        <section className="py-4 border-b border-border/30">
          <div className="container-width">
            <Breadcrumbs 
              items={[
                { label: 'About Us' }
              ]} 
            />
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="sr-only">Elite London Escort Agency - Premium High-Class Escort Services Since 2018</h1>
              <h2 className="heading-display mb-4 sm:mb-6 text-black">
                Five London Elite Escorts
              </h2>
              <p className="body-lg text-black">
                London's premier luxury companion agency representing sophisticated, intelligent, and captivating women.
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-width">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center">
                <h3 className="heading-lg mb-4 text-black">Why Choose Five London</h3>
                <p className="body-lg text-black">
                  London's most exclusive companion agency. Our elite companions combine exceptional beauty with intelligence, sophistication, and genuine warmth.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 text-black">
                      <value.icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-medium text-black">{value.title}</h4>
                    <p className="text-black text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Values Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container-width">
            <div className="text-center mb-12 md:mb-14 px-4 md:px-0">
              <h2 className="heading-lg mb-4 text-black">
                Our <span className="text-slate-800">Values</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">
              {values.map((value, index) => (
                <div key={index} className="text-center space-y-3 md:space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-black">
                    <value.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-black">{value.title}</h3>
                  <p className="text-black text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-extralight mb-4">Ready to Book?</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8">
                Contact us for discreet consultation and same-day booking.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Contact Us Now
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