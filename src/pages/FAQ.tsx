import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Phone, Mail, Shield, Clock, Users, Star } from 'lucide-react';
import { generateFAQSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';
import { generateLocalBusinessSchema } from '@/utils/geoTargeting';
import { generateLocationAwareFAQSchema, generateBreadcrumbSchema as generateAdvancedBreadcrumbs } from '@/utils/advancedStructuredData';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useFAQs } from '@/hooks/useFAQs';
import { useBookingContent } from '@/hooks/useBookingContent';

const FAQ = () => {
  const { faqs, loading, error } = useFAQs();
  const { info: bookingInfo } = useBookingContent();
  const breadcrumbs = useBreadcrumbs();

  // Generate enhanced structured data with location awareness
  const structuredData = [
    generateOrganizationSchema(),
    generateAdvancedBreadcrumbs(breadcrumbs),
    ...(faqs && faqs.length > 0 ? [generateLocationAwareFAQSchema(faqs.map(faq => ({ question: faq.question, answer: faq.answer })), "London")] : []),
    // Enhanced LocalBusiness schema for GEO targeting
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Five London - Premium Companion Services",
      "url": "https://fivelondon.com/faq",
      "telephone": "+447436190679",
      "areaServed": [
        { "@type": "City", "name": "London", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "W1", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "SW1", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "SW3", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "SW7", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "WC2", "addressCountry": "GB" },
        { "@type": "PostalAddress", "postalCode": "E14", "addressCountry": "GB" }
      ],
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "£500-£1000"
    }
  ];

  return (
    <>
      <SEO 
        title="FAQ - Luxury Escort Services Questions Answered | Five London"
        description="Get answers to frequently asked questions about Five London's premium escort services. Learn about booking, rates, discretion, safety, and our professional companion services in London including Mayfair, Westminster, Kensington, and Central London areas."
        keywords="luxury escort FAQ, escort booking questions, London escort agency FAQ, companion service questions, escort rates, booking process, discretion policy, escort safety, professional escort services FAQ, Mayfair escort services, Westminster escorts, Central London companions, Kensington escort agency, Chelsea escorts, City of London escort services"
        canonicalUrl="/faq"
        structuredData={structuredData}
        additionalMeta={{
          "geo.region": "GB-LND",
          "geo.placename": "London",
          "geo.position": "51.5074;-0.1278",
          "ICBM": "51.5074, -0.1278"
        }}
      />
      
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                Frequently Asked Questions
              </h1>
              <p className="luxury-body-lg text-black mb-12 md:mb-12">
                Find answers to the most common questions about our luxury companion services.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading FAQs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading FAQs: {error}</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No FAQs available at the moment.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={`item-${index}`}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-black transition-colors px-6 py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed px-6 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>

        {/* Important Information Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="luxury-heading-lg text-black mb-8 text-center">
                Important Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {bookingInfo.map((info, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="luxury-heading-sm text-black mb-3">{info.title}</h3>
                    <p className="luxury-body-sm text-gray-600 leading-relaxed">
                      {info.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="luxury-heading-sm text-black mb-2">100% Discrete</h3>
                <p className="luxury-body-xs text-gray-600">Complete confidentiality guaranteed</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <h3 className="luxury-heading-sm text-black mb-2">24/7 Available</h3>
                <p className="luxury-body-xs text-gray-600">Round-the-clock service</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="luxury-heading-sm text-black mb-2">Elite Companions</h3>
                <p className="luxury-body-xs text-gray-600">Carefully selected professionals</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="luxury-heading-sm text-black mb-2">Premium Service</h3>
                <p className="luxury-body-xs text-gray-600">Exceptional experiences delivered</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <details className="mb-8">
              <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-gray-800 hover:text-muted-foreground transition-colors">
                <h2>Common Questions About Our Services</h2>
              </summary>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Booking Process</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Our streamlined booking process ensures complete discretion and efficiency. From initial contact to final arrangements, we handle every detail with the utmost professionalism and care for our distinguished clientele.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Simple Booking Steps</h4>
                      <p className="luxury-body-xs text-muted-foreground">Contact us via WhatsApp or phone, discuss your preferences, confirm availability, and finalize arrangements.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Advance Notice</h4>
                      <p className="luxury-body-xs text-muted-foreground">While same-day bookings are often possible, advance notice ensures the best companion selection for your specific requirements.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Service Areas</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Five London operates throughout London's most prestigious areas, providing luxury companionship services to hotels, restaurants, private residences, and exclusive venues across the capital.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Premium Locations</h4>
                      <p className="luxury-body-xs text-muted-foreground">Mayfair, Knightsbridge, Belgravia, Kensington, Chelsea, Westminster, and Central London covered.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Outcall Services</h4>
                      <p className="luxury-body-xs text-muted-foreground">Professional companions available for hotel visits, dinner dates, business events, and cultural occasions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="luxury-heading-xl mb-6">
              Still Have Questions?
            </h2>
            <p className="luxury-body-lg text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Our experienced concierge team is available 24/7 to answer any additional questions 
              and assist with your booking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="tel:+447436190679"
                className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
              >
                <Phone className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Call Us</h3>
                <p className="text-white/70 mb-3">Speak directly with our team</p>
                <span className="text-white font-medium">+44 7436 190679</span>
              </a>

              <a 
                href="https://wa.me/447436190679"
                className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
              >
                <MessageCircle className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                <p className="text-white/70 mb-3">Quick and discreet messaging</p>
                <span className="text-white font-medium">Send Message</span>
              </a>

              <a 
                href="mailto:models@exclusivefivelondon.com"
                className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
              >
                <Mail className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <p className="text-white/70 mb-3">Get detailed information</p>
                <span className="text-white font-medium">models@exclusivefivelondon.com</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FAQ;