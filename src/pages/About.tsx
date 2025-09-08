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
        <section className="py-20 md:py-32 bg-white">
          <div className="container-width mx-auto px-6">
            <div className="text-center mb-20">
              {/* Hidden SEO H1 */}
              <h1 className="sr-only">Elite London Escort Agency - Premium High-Class Escort Services Since 2018</h1>
              
              {/* Main heading */}
              <h2 className="heading-display text-black mb-8">
                Five London Elite Escorts
              </h2>
              <div className="w-16 h-0.5 bg-black mx-auto mb-8 md:mb-12"></div>
              
              <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
                <p className="body-lg text-black">
                  Established as London's premier luxury companion agency, Five London represents an exclusive collection of sophisticated, intelligent, and captivating women who embody elegance and refinement.
                </p>
                
                <p className="body-base text-black">
                  Our carefully selected companions are available for discerning gentlemen seeking exceptional experiences - from intimate dinner dates and cultural events to international travel and private encounters. Each companion combines natural beauty with intellectual sophistication, ensuring every moment is memorable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-light text-black">✓</span>
                    </div>
                    <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">Discretion Assured</h3>
                    <p className="text-sm text-black">Complete confidentiality and professional service guaranteed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-light text-black">★</span>
                    </div>
                    <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">Elite Selection</h3>
                    <p className="text-sm text-black">Handpicked companions meeting the highest standards</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-light text-black">◆</span>
                    </div>
                    <h3 className="text-sm font-medium text-black mb-2 uppercase tracking-wider">24/7 Available</h3>
                    <p className="text-sm text-black">Round-the-clock booking service for your convenience</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Call Now - Same Day Booking
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden">
                <img 
                  src={aboutLuxury1} 
                  alt="Five London luxury companion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden">
                <img 
                  src={aboutLuxury2} 
                  alt="Elegant dining experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden">
                <img 
                  src={aboutLuxury3} 
                  alt="Sophisticated companion services"
                  className="w-full h-full object-cover"
                />
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

        {/* Story Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gray-100">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="w-full max-w-sm md:max-w-md mx-auto lg:mx-0 h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden px-4 md:px-0 order-2 lg:order-1">
                <img 
                  src={aboutLuxury2} 
                  alt="Fine dining experience"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4 md:space-y-6 text-center lg:text-left px-4 md:px-0 order-1 lg:order-2">
                <h2 className="heading-lg text-black">
                  Why Choose <span className="text-slate-800">Five London</span>
                </h2>
                <p className="body-lg text-black">
                  London's most exclusive companion agency. Our elite companions combine exceptional beauty with intelligence, sophistication, and genuine warmth.
                </p>
                <p className="body-base text-black">
                  Handpicked for their education, elegance, and conversational skills. Every encounter is crafted for complete satisfaction and absolute discretion.
                </p>
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

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Experience Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-gray-100">
          <div className="container-width">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="space-y-4 md:space-y-6 text-center lg:text-left px-4 md:px-0 order-2 lg:order-1">
                <h2 className="heading-lg text-black">
                  Your <span className="text-slate-800">Experience</span>
                </h2>
                <p className="body-lg text-black">
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

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Premium Locations Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container-width">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="heading-lg mb-4 text-black">
                Serving London's <span className="text-slate-800">Premier Locations</span>
              </h2>
              <p className="body-lg text-black max-w-2xl mx-auto">
                Our sophisticated companions are available across London's most exclusive districts, 
                each offering unique experiences tailored to the area's distinct character.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              <Link 
                to="/escorts-in-mayfair" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Mayfair
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Elite & Exclusive
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-knightsbridge" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Knightsbridge
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Luxury & Sophistication
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-chelsea" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Chelsea
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Trendy & Artistic
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-belgravia" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Belgravia
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Refined & Prestigious
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-kensington" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Kensington
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Cultural & Historic
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-canary-wharf" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Canary Wharf
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Business & Professional
                </p>
              </Link>
              
              <Link 
                to="/escorts-in-notting-hill" 
                className="group bg-background hover:bg-muted/50 border border-border rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-sm"
              >
                <h3 className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                  Notting Hill
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Vibrant & Creative
                </p>
              </Link>
              
              <Link 
                to="/locations" 
                className="group bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg p-4 md:p-6 transition-all duration-300 flex items-center justify-center"
              >
                <div className="text-center">
                  <h3 className="font-medium text-sm md:text-base text-primary">
                    View All
                  </h3>
                  <p className="text-xs md:text-sm text-primary/70 mt-1">
                    12 Locations
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Hidden SEO Content - Our Heritage & Story */}
        <div className="sr-only">
          <h2>Our Heritage & Story - Elite London Escort Agency Since 2018</h2>
          <p>Five London was established in 2018 with a revolutionary vision to redefine the standards of luxury companionship in London. Our founders, seasoned professionals with decades of experience in hospitality and personal services, recognized the need for a truly elite escort agency that would combine discretion, sophistication, and uncompromising quality.</p>
          <p>Since our inception, we have built an impeccable reputation as London's most trusted premium escort agency. Our journey began with a simple yet ambitious mission: to create an exclusive platform where discerning gentlemen could connect with the most sophisticated, intelligent, and beautiful women in London. What started as a boutique agency has evolved into London's premier destination for elite companionship.</p>
          <p>Our heritage is built on four fundamental pillars: absolute discretion, uncompromising quality, authentic connections, and professional excellence. These values have guided every decision we've made, from our rigorous selection process to our comprehensive training programs and our commitment to complete client confidentiality.</p>
          <p>Over the years, we have served hundreds of distinguished clients, including business executives, diplomats, celebrities, and successful entrepreneurs from around the world. Our reputation extends far beyond London, with clients traveling specifically to experience the exceptional service and companionship that Five London provides.</p>
          <p>Today, Five London represents the pinnacle of luxury escort services in the UK capital. We continue to evolve and innovate while maintaining the traditional values of discretion, elegance, and excellence that have made us London's most trusted elite escort agency.</p>
          
          <h2>Our Exquisite Selection Process - Elite Escort Verification London</h2>
          <p>Five London maintains the most rigorous and comprehensive selection process in the luxury escort industry. Our multi-stage verification system ensures that every companion meets our exceptionally high standards for beauty, intelligence, sophistication, and professionalism.</p>
          <p>Education and Intelligence Assessment: Every potential companion undergoes thorough interviews to assess their educational background, cultural knowledge, and conversational abilities. We seek women who are not only beautiful but also intellectually stimulating, with university degrees, international experience, and genuine passion for learning and growth.</p>
          <p>Professional Background Verification: We conduct comprehensive background checks, including identity verification, reference checks, and professional history review. This process ensures the safety and security of both our companions and clients while maintaining the highest standards of professionalism.</p>
          <p>Etiquette and Social Skills Training: Selected companions receive specialized training in social etiquette, fine dining protocols, business communication, and cultural awareness. This ensures they can seamlessly adapt to any social setting, from intimate dinners to corporate events and international travel.</p>
          <p>Continuous Quality Assurance: Our commitment to excellence doesn't end with selection. We provide ongoing support, training, and evaluation to ensure our companions continue to meet and exceed client expectations throughout their association with Five London.</p>
          <p>Health and Wellness Standards: All companions undergo regular health screenings and maintain comprehensive wellness programs. We believe that physical and mental well-being are essential for providing exceptional companionship experiences.</p>
        </div>

        {/* CTA Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto space-y-6 md:space-y-7 px-4 md:px-0">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight">
                Experience <span className="text-primary">Five London</span>
              </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Ready to experience London's finest elite companions? Join hundreds of satisfied clients who choose Five London for unforgettable encounters.
                </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Call Now - Same Day Available
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-6 md:px-8 py-3 w-full sm:w-auto"
                  onClick={() => window.location.href = '/models'}
                >
                  Browse Elite Companions
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