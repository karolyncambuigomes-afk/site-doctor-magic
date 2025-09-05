import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail, Shield, Clock, Users, Star } from 'lucide-react';
import { generateFAQSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I book a companion with Five London?",
      answer: "Booking is simple and discreet. You can call us directly at +44 7436 190679 (available 24/7), send a WhatsApp message, or contact us through our secure online form. We recommend booking at least 24-48 hours in advance to ensure availability of your preferred companion. Our experienced concierge team will guide you through the process and help match you with the perfect companion for your needs."
    },
    {
      question: "Is complete discretion guaranteed?",
      answer: "Absolutely. Discretion and confidentiality are the absolute foundation of our service. All client information is strictly confidential and never shared with third parties. Our companions are professionally trained in maintaining the highest levels of discretion. We have established comprehensive protocols to ensure your privacy is protected at all times, from initial contact to the completion of your booking."
    },
    {
      question: "What areas of London do you serve?",
      answer: "We primarily serve Central London and the greater London area, including premium locations such as Mayfair, Knightsbridge, Chelsea, Kensington, Belgravia, Canary Wharf, and the City of London. We can also arrange companionship for travel within the UK and internationally. Extended travel arrangements require advance notice and may incur additional travel expenses."
    },
    {
      question: "What are your rates and pricing structure?",
      answer: "Our rates vary depending on the companion, duration, and type of engagement, typically ranging from £500-£1000+ per hour. We offer transparent pricing with no hidden fees. All rates include the companion's time, companionship, and professional service. Longer bookings and overnight arrangements may have preferred rates. Please contact us directly for specific pricing information as we tailor our services to meet individual requirements."
    },
    {
      question: "How far in advance should I make a booking?",
      answer: "We recommend booking at least 24-48 hours in advance to ensure the availability of your preferred companion and to allow proper preparation for your engagement. However, we understand that plans can change, and we do our best to accommodate same-day bookings when possible. For special events, travel arrangements, or popular times (weekends, holidays), earlier booking is strongly advisable."
    },
    {
      question: "Are your companions available for travel and overnight bookings?",
      answer: "Yes, many of our companions are available for domestic and international travel, as well as overnight engagements. Travel companions can accompany you on business trips, luxury vacations, or special events worldwide. Overnight and travel arrangements require advance planning, and additional costs for travel, accommodation, meals, and incidental expenses will apply. Extended bookings often have preferred hourly rates."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various secure payment methods including bank transfers (preferred), cash, and major credit cards. Payment is typically required in advance for new clients to confirm the booking. We provide discrete invoicing and can arrange flexible payment terms for established, regular clients. All financial transactions are handled with complete confidentiality."
    },
    {
      question: "How are your companions selected and vetted?",
      answer: "Our companions undergo a rigorous and comprehensive selection process. We carefully evaluate intelligence, sophistication, appearance, personality, education, and social skills. All companions are thoroughly verified, professionally trained, and committed to providing exceptional experiences. Each companion brings unique qualities, backgrounds, and specialties to ensure we can match you with the perfect companion for any occasion or requirement."
    },
    {
      question: "Can I request a specific companion from your gallery?",
      answer: "Absolutely. You can browse our online gallery and request a specific companion when making your booking. We'll do our best to accommodate your preference based on her availability and your timing requirements. If your preferred companion is not available for your requested time, we'll suggest similar companions who match your preferences, requirements, and the nature of your engagement."
    },
    {
      question: "What is your cancellation and rescheduling policy?",
      answer: "We understand that plans can change unexpectedly. Cancellations made more than 24 hours in advance receive a full refund. Cancellations with less than 24 hours notice may incur a cancellation fee (typically 50% of the booking fee). We're very flexible with rescheduling and will work with you to find alternative arrangements when possible. Emergency situations are handled on a case-by-case basis."
    },
    {
      question: "Do you provide services for couples or groups?",
      answer: "Yes, we offer specialized services for couples looking to enhance their experience, as well as group bookings for special occasions. Our companions are comfortable and experienced in various social situations and can provide companionship for couples attending events, dinners, or other social occasions. Group bookings for corporate events, celebrations, or parties can also be arranged. Please discuss your specific requirements when booking."
    },
    {
      question: "What age verification and legal requirements apply?",
      answer: "We require strict age verification for all clients - you must be 18 or older to use our services. We may request valid government-issued identification to verify age and identity. This is for legal compliance, safety of our companions and clients, and maintaining our professional standards. All services are conducted in full compliance with UK law."
    },
    {
      question: "What should I expect during my first booking?",
      answer: "Your first experience will begin with a discrete consultation where we discuss your preferences, occasion, and requirements. We'll recommend suitable companions and handle all arrangements professionally. Your chosen companion will arrive promptly and elegantly dressed for the occasion. She will be charming, engaging, and focused on ensuring you have an exceptional experience. Our goal is to exceed your expectations from the very first meeting."
    },
    {
      question: "How do you ensure the safety and security of clients and companions?",
      answer: "Safety and security are paramount. All companions undergo thorough background checks and verification. We maintain 24/7 support for both clients and companions during bookings. Companions check in regularly during engagements. We have established safety protocols and emergency procedures. Client information is securely stored and access is strictly limited. We work only with verified, professional companions who prioritize safety and discretion."
    },
    {
      question: "Can companions accompany me to business or professional events?",
      answer: "Absolutely. Many of our companions are highly educated and experienced in accompanying clients to business dinners, corporate events, conferences, and professional networking functions. They understand business etiquette, can engage in sophisticated conversation, and will represent you with elegance and professionalism. We can match you with companions who have relevant educational backgrounds or professional experience for your specific industry or event type."
    }
  ];

  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "FAQ", url: "https://fivelondon.com/faq" }
    ]),
    generateFAQSchema(faqs)
  ];

  return (
    <>
      <SEO 
        title="FAQ - Luxury Escort Services Questions Answered | Five London"
        description="Get answers to frequently asked questions about Five London's premium escort services. Learn about booking, rates, discretion, safety, and our professional companion services in London."
        keywords="luxury escort FAQ, escort booking questions, London escort agency FAQ, companion service questions, escort rates, booking process, discretion policy, escort safety, professional escort services FAQ"
        canonicalUrl="/faq"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-sans text-3xl md:text-5xl font-extralight tracking-wide text-black mb-6">
              Frequently Asked Questions
            </h1>
            <div className="w-16 h-px bg-black/20 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Find answers to the most common questions about our luxury companion services. 
              Our team is here to help ensure your complete satisfaction and peace of mind.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
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
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-medium text-black mb-2">100% Discrete</h3>
                <p className="text-sm text-gray-600">Complete confidentiality guaranteed</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-medium text-black mb-2">24/7 Available</h3>
                <p className="text-sm text-gray-600">Round-the-clock service</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-medium text-black mb-2">Elite Companions</h3>
                <p className="text-sm text-gray-600">Carefully selected professionals</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-medium text-black mb-2">Premium Service</h3>
                <p className="text-sm text-gray-600">Exceptional experiences delivered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-sans text-2xl md:text-4xl font-extralight tracking-wide mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
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
                href="mailto:info@fivelondon.com"
                className="bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-lg transition-all duration-300 group"
              >
                <Mail className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <p className="text-white/70 mb-3">Get detailed information</p>
                <span className="text-white font-medium">info@fivelondon.com</span>
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