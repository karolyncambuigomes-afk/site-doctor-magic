import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';
import { Shield, Award, Users, Clock, Star, CheckCircle, Heart, Globe, Lock, Sparkles, Diamond, Crown } from 'lucide-react';
import aboutLuxury1 from '@/assets/about-luxury-1.jpg';
import aboutLuxury2 from '@/assets/about-luxury-2.jpg';
import aboutLuxury3 from '@/assets/about-luxury-3.jpg';

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

  // Company values data
  const values = [
    {
      icon: Shield,
      title: "Discretion & Privacy",
      description: "Absolute confidentiality and privacy protection for all our clients and companions. We understand the importance of maintaining your reputation and privacy in all interactions."
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only the finest companions who meet our rigorous standards of elegance, sophistication, and professionalism. Each companion is carefully selected and verified."
    },
    {
      icon: Users,
      title: "Personalized Service",
      description: "Tailored experiences designed to meet your unique preferences and requirements. We take time to understand your needs and match you perfectly."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock service to accommodate your schedule and spontaneous needs. Our dedicated team is always available to assist you."
    },
    {
      icon: Heart,
      title: "Authentic Connections",
      description: "We facilitate genuine connections between sophisticated individuals who appreciate the finer things in life and seek meaningful companionship."
    },
    {
      icon: Globe,
      title: "International Standards",
      description: "Operating with international standards of excellence, we serve discerning clients from around the world with consistent quality and professionalism."
    }
  ];

  // Achievements data
  const achievements = [
    {
      icon: Star,
      text: "Over 1000+ satisfied clients worldwide",
      detail: "Building lasting relationships with discerning individuals globally"
    },
    {
      icon: Award,
      text: "5+ years of excellence in luxury companionship",
      detail: "Established reputation for uncompromising quality and service"
    },
    {
      icon: Shield,
      text: "100% discretion guarantee",
      detail: "Zero breaches of client confidentiality in our operating history"
    },
    {
      icon: CheckCircle,
      text: "Verified and professional companions",
      detail: "Rigorous screening process ensures only the finest companions"
    },
    {
      icon: Lock,
      text: "Secure and confidential booking system",
      detail: "Advanced encryption and privacy protection for all communications"
    },
    {
      icon: Sparkles,
      text: "Bespoke luxury experiences",
      detail: "Customized services tailored to individual preferences and occasions"
    }
  ];


  return (
    <>
      <SEO 
        title="About Five London - Premier Luxury Escort Agency"
        description="Learn about Five London, London's premier luxury escort agency. Discover our commitment to excellence, discretion, and providing sophisticated companionship services with the highest professional standards."
        keywords="about Five London, luxury escort agency London, premium escort services, sophisticated companionship, professional escort agency, elite escorts London, luxury dating services"
        canonicalUrl="/about"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Breadcrumbs */}
          <section className="py-6 border-b">
            <div className="container mx-auto px-4">
              <Breadcrumbs 
                items={[
                  { label: "About Us" }
                ]}
              />
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="heading-display mb-6 text-foreground">
                    About Five London
                  </h1>
                  <p className="body-lg text-muted-foreground mb-8 leading-relaxed">
                    Five London stands as the epitome of luxury companionship services in the heart of England's capital. Founded on principles of discretion, elegance, and uncompromising quality, we have established ourselves as the premier destination for sophisticated individuals seeking exceptional companionship experiences.
                  </p>
                  <p className="body-md text-muted-foreground leading-relaxed">
                    Our commitment to excellence has made us the trusted choice for discerning clients who demand nothing but the finest in luxury companionship services.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src={aboutLuxury1} 
                    alt="Luxury lifestyle and elegance representing Five London's premium services"
                    className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src={aboutLuxury2} 
                    alt="Sophisticated dining and entertainment experiences in London"
                    className="rounded-2xl shadow-xl w-full h-[450px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="heading-lg mb-6 text-foreground">Our Story</h2>
                  <p className="body-md text-muted-foreground mb-6 leading-relaxed">
                    Five London was born from a vision to redefine the luxury companionship industry in London. Recognizing the need for a service that truly understands the discerning tastes of sophisticated individuals, we set out to create an agency that would set new standards in elegance, discretion, and personalized service.
                  </p>
                  <p className="body-md text-muted-foreground mb-6 leading-relaxed">
                    Over the years, we have carefully curated a portfolio of exceptional companions who embody the qualities our clients value most: intelligence, elegance, sophistication, and genuine warmth. Each companion is selected not only for their beauty but for their ability to engage in meaningful conversations and adapt to any social setting.
                  </p>
                  <p className="body-md text-muted-foreground leading-relaxed">
                    Today, Five London is recognized as London's most exclusive luxury escort agency, serving clients from around the world who seek unparalleled companionship experiences in one of the world's most vibrant cities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-6 text-foreground">Why Choose Five London</h2>
                <p className="body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  We distinguish ourselves through our unwavering commitment to excellence, attention to detail, and understanding of what truly matters to our discerning clientele.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {values.map((value, index) => (
                  <div key={index} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <value.icon className="w-12 h-12 text-primary mb-6" />
                    <h3 className="heading-sm mb-4 text-card-foreground">{value.title}</h3>
                    <p className="body-md text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <img 
                  src={aboutLuxury3} 
                  alt="Exclusive events and premium lifestyle experiences in London"
                  className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <h3 className="heading-md mb-4">Experience the Difference</h3>
                    <p className="body-lg max-w-2xl mx-auto leading-relaxed">
                      Join thousands of satisfied clients who have discovered what makes Five London the premier choice for luxury companionship in London.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section className="py-16 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-6 text-foreground">Our Achievements</h2>
                <p className="body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Our track record speaks for itself. These milestones represent our commitment to excellence and the trust our clients place in us.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <achievement.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="heading-sm mb-3 text-card-foreground">{achievement.text}</h3>
                    <p className="body-sm text-muted-foreground leading-relaxed">{achievement.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Commitment Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="heading-lg mb-8 text-foreground">Our Commitment to Excellence</h2>
                <div className="space-y-8">
                  <p className="body-lg text-muted-foreground leading-relaxed">
                    At Five London, we understand that our clients are successful, sophisticated individuals who expect nothing less than perfection. This understanding drives every aspect of our service, from the initial consultation to the final farewell.
                  </p>
                  <p className="body-md text-muted-foreground leading-relaxed">
                    We continuously invest in training our team, refining our processes, and staying ahead of industry trends to ensure that we always exceed expectations. Our commitment extends beyond just providing companionship – we create experiences that are truly unforgettable.
                  </p>
                  <p className="body-md text-muted-foreground leading-relaxed">
                    Whether you're attending a business function, exploring London's cultural offerings, or simply seeking sophisticated company for an evening out, Five London provides the perfect companion to enhance your experience and ensure every moment is extraordinary.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="heading-lg mb-6 text-foreground">Ready to Experience Excellence?</h2>
              <p className="body-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Contact us today to discover how Five London can provide you with an unforgettable luxury companionship experience. Our dedicated team is ready to assist you in creating the perfect arrangement tailored to your specific needs and preferences.
              </p>
              <a
                href="https://wa.me/447397123456"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          </section>
        </main>
        
        <Footer />
    </>
  );
};

export default About;