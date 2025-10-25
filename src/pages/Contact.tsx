import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, MessageCircle, Shield } from 'lucide-react';

const Contact = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Five London",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+44-20-4567-8901",
          "contactType": "customer service",
          "availableLanguage": "English",
          "serviceArea": "London, United Kingdom"
        },
        {
          "@type": "ContactPoint",
          "email": "models@exclusivefivelondon.com",
          "contactType": "customer service",
          "availableLanguage": "English"
        }
      ]
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+44 7436 190679",
      description: "Available 24/7 for immediate booking",
      action: "Call Now for Same Day"
    },
    {
      icon: Mail,
      title: "Email",
      details: "models@exclusivefivelondon.com",
      description: "Get pricing and availability within 1 hour",
      action: "Email for Prices"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "+44 7436 190679",
      description: "Instant replies - same day booking available",
      action: "WhatsApp Now"
    }
  ];

  return (
    <>
      <SEOOptimized 
        title="Contact Five London - Luxury Escort Booking & Inquiries"
        description="Contact Five London for luxury escort bookings and inquiries. Available 24/7 via phone, email, or WhatsApp. Discreet and professional service guaranteed."
        keywords="contact five london, luxury escort booking, escort inquiries london, book escort london, escort agency contact"
        canonicalUrl="/contact"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-primary-content">
                Contact for Same Day Booking
              </h1>
              <p className="luxury-body-lg text-primary-content mb-12 md:mb-12">
                Most companions available today. Call now for instant confirmation.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-width">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <div 
                    key={method.title}
                    className="text-center space-y-4 p-6 border border-border rounded-xl hover:border-primary/30 transition-all"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 text-primary-content">
                      <method.icon className="w-8 h-8" />
                    </div>
                    <h3 className="luxury-heading-sm text-primary-content">{method.title}</h3>
                    <p className="text-primary-content break-all luxury-body-sm px-2">{method.details}</p>
                    <p className="luxury-body-sm text-primary-content">{method.description}</p>
                    <Button 
                      className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        if (method.title === 'WhatsApp') {
                          window.open('https://wa.me/447436190679', '_blank');
                        } else if (method.title === 'Phone') {
                          window.location.href = 'tel:+447436190679';
                        } else if (method.title === 'Email') {
                          window.location.href = 'mailto:models@exclusivefivelondon.com';
                        }
                      }}
                    >
                      {method.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-secondary-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-6 md:p-8">
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="luxury-heading-lg text-primary-content">Contact Our London Team</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">24/7 Availability</h3>
                  <p className="luxury-body-md text-secondary-content leading-relaxed">
                    Our dedicated concierge team is available around the clock to handle your booking requests, whether you need same-day arrangements or advance planning for special occasions across London's premier venues.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Instant Booking</h4>
                      <p className="luxury-body-xs text-muted-foreground">Most companions available for same-day bookings throughout Central London, Mayfair, and Knightsbridge.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Emergency Contact</h4>
                      <p className="luxury-body-xs text-muted-foreground">Urgent assistance available via WhatsApp for last-minute requests and special arrangements.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Booking Methods</h3>
                  <p className="luxury-body-md text-secondary-content leading-relaxed">
                    Choose your preferred method to contact Five London. We offer multiple channels to ensure discreet and efficient communication for all your luxury companionship needs in London.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">WhatsApp Preferred</h4>
                      <p className="luxury-body-xs text-muted-foreground">Fastest response times with instant confirmations and real-time availability updates.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Secure Communication</h4>
                      <p className="luxury-body-xs text-muted-foreground">All communications encrypted and handled with complete discretion and confidentiality.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <h2 className="luxury-heading-lg mb-4">Need Immediate Assistance?</h2>
              <p className="luxury-body-base text-muted-foreground mb-8">
                For urgent bookings or questions, contact us directly.
              </p>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/447436190679', '_blank')}
              >
                Contact Us Now
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

export default Contact;