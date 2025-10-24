import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOOptimized } from "@/components/SEOOptimized";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactBar } from "@/components/ContactBar";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
} from "@/utils/structuredData";
import { getCanonicalUrl } from "@/utils/urlHelpers";
import {
  Shield,
  Award,
  Users,
  Clock,
  Star,
  CheckCircle,
  Heart,
  Globe,
  Lock,
  Sparkles,
  Diamond,
  Crown,
} from "lucide-react";

const About = () => {
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: getCanonicalUrl('/') },
      { name: "About Us", url: getCanonicalUrl('/about') },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      mainEntity: {
        "@type": "Organization",
        name: "Five London",
        description:
          "London's premier luxury escort agency established with a commitment to providing sophisticated companionship services with complete discretion and uncompromising excellence",
        foundingDate: "2020",
        areaServed: {
          "@type": "City",
          name: "London",
          addressCountry: "GB",
        },
        serviceType: "Luxury Companionship Services",
        hasCredential: [
          "Verified Agency",
          "Discrete Service Provider",
          "Premium Quality Assurance",
        ],
      },
    },
  ];

  // Company values data
  const values = [
    {
      icon: Shield,
      title: "Discretion & Privacy",
      description:
        "Absolute confidentiality and privacy protection for all our clients and companions. We understand the importance of maintaining your reputation and privacy in all interactions.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Only the finest companions who meet our rigorous standards of elegance, sophistication, and professionalism. Each companion is carefully selected and verified.",
    },
    {
      icon: Users,
      title: "Personalized Service",
      description:
        "Tailored experiences designed to meet your unique preferences and requirements. We take time to understand your needs and match you perfectly.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Round-the-clock service to accommodate your schedule and spontaneous needs. Our dedicated team is always available to assist you.",
    },
    {
      icon: Heart,
      title: "Authentic Connections",
      description:
        "We facilitate genuine connections between sophisticated individuals who appreciate the finer things in life and seek meaningful companionship.",
    },
    {
      icon: Globe,
      title: "International Standards",
      description:
        "Operating with international standards of excellence, we serve discerning clients from around the world with consistent quality and professionalism.",
    },
  ];

  // Achievements data
  const achievements = [
    {
      icon: Star,
      text: "Over 1000+ satisfied clients worldwide",
      detail:
        "Building lasting relationships with discerning individuals globally",
    },
    {
      icon: Award,
      text: "5+ years of excellence in luxury companionship",
      detail: "Established reputation for uncompromising quality and service",
    },
    {
      icon: Shield,
      text: "100% discretion guarantee",
      detail:
        "Zero breaches of client confidentiality in our operating history",
    },
    {
      icon: CheckCircle,
      text: "Verified and professional companions",
      detail: "Rigorous screening process ensures only the finest companions",
    },
    {
      icon: Lock,
      text: "Secure and confidential booking system",
      detail:
        "Advanced encryption and privacy protection for all communications",
    },
    {
      icon: Sparkles,
      text: "Bespoke luxury experiences",
      detail:
        "Customized services tailored to individual preferences and occasions",
    },
  ];

  return (
    <>
      <SEOOptimized
        title="About Five London - Premier Luxury Escort Agency"
        description="Learn about Five London, London's premier luxury escort agency. Discover our commitment to excellence, discretion, and providing sophisticated companionship services with the highest professional standards."
        keywords="about Five London, luxury escort agency London, premium escort services, sophisticated companionship, professional escort agency, elite escorts London, luxury dating services"
        canonicalUrl="/about"
        structuredData={structuredData}
      />

      <Navigation />

      <main className="pt-0 bg-white">
        {/* Hero Section */}
        <section className="section-padding-lg bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="heading-1 title-margin-md text-primary-content">
                About Five London
              </h1>
              <p className="body-lead text-primary-content mb-12 md:mb-12">
                London's premier luxury escort agency. Discover our commitment
                to excellence, discretion, and sophisticated companionship
                services.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="separator-elegant"></div>
        </section>

        {/* Image Section */}
        <section className="section-padding-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <OptimizedImage
                src="/images/about-luxury-1.webp"
                alt="Luxury lifestyle and elegance representing Five London's premium services"
                className="rounded-2xl shadow-2xl w-full"
                aspectRatio="auto"
                priority={true}
              />
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-padding-lg bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-content items-center">
              <div className="order-2 lg:order-1">
                <OptimizedImage
                  src="/images/about-luxury-2.webp"
                  alt="Sophisticated dining and entertainment experiences in London"
                  className="rounded-2xl shadow-xl w-full"
                  aspectRatio="auto"
                />
              </div>
              <div className="order-1 lg:order-2 flex flex-col gap-element">
                <h2 className="heading-2 text-primary-content">Our Story</h2>
                <p className="body-base text-secondary-content">
                  Five London was born from a vision to redefine the luxury
                  companionship industry in London. Recognizing the need for a
                  service that truly understands the discerning tastes of
                  sophisticated individuals, we set out to create an agency that
                  would set new standards in elegance, discretion, and
                  personalized service.
                </p>
                <p className="luxury-body-md text-gray-800 mb-6 leading-relaxed">
                  Over the years, we have carefully curated a portfolio of
                  exceptional companions who embody the qualities our clients
                  value most: intelligence, elegance, sophistication, and
                  genuine warmth. Each companion is selected not only for their
                  beauty but for their ability to engage in meaningful
                  conversations and adapt to any social setting.
                </p>
                <p className="luxury-body-md text-gray-800 leading-relaxed">
                  Today, Five London is recognized as London's most exclusive
                  luxury escort agency, serving clients from around the world
                  who seek unparalleled companionship experiences in one of the
                  world's most vibrant cities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="luxury-heading-lg mb-6 text-black">
                Why Choose Five London
              </h2>
              <p className="luxury-body-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                We distinguish ourselves through our unwavering commitment to
                excellence, attention to detail, and understanding of what truly
                matters to our discerning clientele.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 mb-16">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-6">
                  <value.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="luxury-heading-sm mb-3 text-black">
                      {value.title}
                    </h3>
                    <p className="luxury-body-md text-gray-800 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <OptimizedImage
                src="/images/about-luxury-3.webp"
                alt="Exclusive events and premium lifestyle experiences in London"
                className="rounded-2xl shadow-2xl w-full"
                aspectRatio="auto"
              />
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="luxury-heading-md mb-4">
                    Experience the Difference
                  </h3>
                  <p className="luxury-body-lg max-w-2xl mx-auto leading-relaxed">
                    Join thousands of satisfied clients who have discovered what
                    makes Five London the premier choice for luxury
                    companionship in London.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="luxury-heading-lg mb-6 text-black">
                Our Achievements
              </h2>
              <p className="luxury-body-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                Our track record speaks for itself. These milestones represent
                our commitment to excellence and the trust our clients place in
                us.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center">
                    <achievement.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="luxury-heading-sm mb-2 text-black">
                      {achievement.text}
                    </h3>
                    <p className="luxury-body-sm text-gray-600 leading-relaxed">
                      {achievement.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="luxury-heading-lg mb-8 text-black">
                Our Commitment to Excellence
              </h2>
              <div className="space-y-8">
                <p className="luxury-body-lg text-gray-800 leading-relaxed">
                  At Five London, we understand that our clients are successful,
                  sophisticated individuals who expect nothing less than
                  perfection. This understanding drives every aspect of our
                  service, from the initial consultation to the final farewell.
                </p>
                <p className="luxury-body-md text-gray-800 leading-relaxed">
                  We continuously invest in training our team, refining our
                  processes, and staying ahead of industry trends to ensure that
                  we always exceed expectations. Our commitment extends beyond
                  just providing companionship – we create experiences that are
                  truly unforgettable.
                </p>
                <p className="luxury-body-md text-gray-800 leading-relaxed">
                  Whether you're attending a business function, exploring
                  London's cultural offerings, or simply seeking sophisticated
                  company for an evening out, Five London provides the perfect
                  companion to enhance your experience and ensure every moment
                  is extraordinary.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="luxury-heading-lg text-foreground">About Five London Premium Agency</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">
                    Elite Escort Services Since 2020
                  </h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Five London has established itself as London's premier
                    luxury escort agency, serving discerning clients across
                    Mayfair, Knightsbridge, Belgravia, and Central London. Our
                    carefully selected companions represent the pinnacle of
                    sophistication, elegance, and professionalism in the
                    industry.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">
                        Professional Standards
                      </h4>
                      <p className="luxury-body-xs text-muted-foreground">
                        Every companion undergoes rigorous screening to ensure
                        they meet our exceptional standards of beauty,
                        intelligence, and social grace.
                      </p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">
                        Discreet Service
                      </h4>
                      <p className="luxury-body-xs text-muted-foreground">
                        Complete confidentiality guaranteed for all our
                        prestigious clients throughout London's most exclusive
                        areas.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">
                    London's Most Trusted Agency
                  </h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Operating in London's most prestigious locations including
                    The Ritz, Claridge's, The Shard, and exclusive private
                    venues, we provide unparalleled companionship services for
                    business dinners, cultural events, and sophisticated social
                    occasions across the capital.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">
                        Premium Locations
                      </h4>
                      <p className="luxury-body-xs text-muted-foreground">
                        Serving Mayfair, Kensington, Chelsea, Westminster, and
                        the City of London with 24/7 availability.
                      </p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">
                        International Clientele
                      </h4>
                      <p className="luxury-body-xs text-muted-foreground">
                        Trusted by business executives, entrepreneurs, and
                        discerning gentlemen from around the world visiting
                        London.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="luxury-heading-lg mb-6 text-black">
              Ready to Experience Excellence?
            </h2>
            <p className="luxury-body-lg text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed">
              Contact us today to discover how Five London can provide you with
              an unforgettable luxury companionship experience. Our dedicated
              team is ready to assist you in creating the perfect arrangement
              tailored to your specific needs and preferences.
            </p>
            <a
              href="https://wa.me/447436190679"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};

export default About;
