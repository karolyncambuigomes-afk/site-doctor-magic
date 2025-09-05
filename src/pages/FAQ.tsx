import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const FAQ = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I book an escort?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can book through our website, phone, or email. We're available 24/7 and require advance booking for the best experience."
        }
      },
      {
        "@type": "Question", 
        "name": "Is discretion guaranteed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Complete confidentiality and discretion are paramount to our service. All client information is strictly confidential."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We primarily serve Central London and surrounding areas. Extended travel arrangements can be made upon request."
        }
      }
    ]
  };

  const faqs = [
    {
      question: "How do I book an escort?",
      answer: "Booking is simple and can be done through multiple channels. You can call us directly at +44 7436 190679, send an email to info@fivelondon.com, or use our online booking form. We recommend booking in advance to ensure availability of your preferred companion. Our concierge team is available 24/7 to assist with your booking and answer any questions."
    },
    {
      question: "Is discretion guaranteed?",
      answer: "Absolutely. Discretion and confidentiality are the cornerstones of our service. All client information is strictly confidential and never shared with third parties. Our companions are trained in maintaining the highest levels of discretion, and we have established protocols to ensure your privacy is protected at all times."
    },
    {
      question: "What areas do you serve?",
      answer: "We primarily serve Central London and the greater London area, including Mayfair, Knightsbridge, Chelsea, Kensington, and the City. We can also arrange companionship for travel within the UK and internationally. Extended travel arrangements require advance notice and may incur additional fees."
    },
    {
      question: "What are your rates?",
      answer: "Our rates vary depending on the companion, duration, and type of engagement. We offer transparent pricing with no hidden fees. All rates include the companion's time and companionship. Please contact us directly for specific pricing information, as we tailor our services to meet individual requirements."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 24-48 hours in advance to ensure the availability of your preferred companion. However, we understand that plans can change, and we do our best to accommodate last-minute bookings when possible. For special events or travel arrangements, earlier booking is advisable."
    },
    {
      question: "Are your companions available for travel?",
      answer: "Yes, many of our companions are available for domestic and international travel. Travel companions can accompany you on business trips, vacations, or special events worldwide. Travel arrangements require advance planning, and additional costs for travel, accommodation, and expenses will apply."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including bank transfers, cash, and major credit cards. Payment is typically required in advance for new clients. We provide discrete invoicing and can arrange flexible payment terms for regular clients."
    },
    {
      question: "How are your companions selected?",
      answer: "Our companions undergo a rigorous selection process. We carefully evaluate intelligence, sophistication, appearance, and personality. All companions are verified, professional, and committed to providing exceptional experiences. Each companion brings unique qualities and specialties to ensure we can match you with the perfect companion for any occasion."
    },
    {
      question: "Can I request a specific companion?",
      answer: "Absolutely. You can browse our gallery and request a specific companion when booking. We'll do our best to accommodate your preference based on availability. If your preferred companion is not available, we'll suggest similar companions who match your preferences and requirements."
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer: "We understand that plans can change. Cancellations made more than 24 hours in advance receive a full refund. Cancellations with less than 24 hours notice may incur a cancellation fee. We're flexible with rescheduling and will work with you to find alternative arrangements when possible."
    },
    {
      question: "Do you offer couple services?",
      answer: "Yes, we offer services for couples looking to enhance their experience. Our companions are comfortable in various social situations and can provide companionship for couples attending events, dinners, or other social occasions. Please discuss your specific requirements when booking."
    },
    {
      question: "Is there an age verification process?",
      answer: "Yes, we require age verification for all clients. You must be 18 or older to use our services. We may request valid identification to verify age and identity. This is for legal compliance and the safety of our companions and clients."
    }
  ];

  return (
    <>
      <SEO 
        title="Frequently Asked Questions - Luxury Escort Services"
        description="Find answers to common questions about Five London's luxury escort services, booking process, rates, and policies. Get instant answers to your queries."
        keywords="escort FAQ, luxury escort questions, booking process, escort rates, London escort agency FAQ"
        canonicalUrl="/faq"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-dark text-secondary-foreground">
          <div className="container-width text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 animate-fade-in-up">
              Frequently Asked <span className="luxury-text-gradient">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Find answers to the most common questions about our luxury escort services
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-background">
          <div className="container-width max-w-4xl mx-auto">
            <Card className="luxury-card p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-padding bg-muted/50">
          <div className="container-width">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold mb-4">
                Still Have <span className="luxury-text-gradient">Questions</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our concierge team is available 24/7 to answer any additional questions and assist with your booking
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-4">Speak directly with our team</p>
                  <Button className="luxury-button w-full">
                    +44 7436 190679
                  </Button>
                </Card>

                <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-4">Get detailed information</p>
                  <Button className="luxury-button w-full">
                    Send Email
                  </Button>
                </Card>

                <Card className="luxury-card p-6 text-center group hover:scale-105 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground mb-4">Instant support available</p>
                  <Button className="luxury-button w-full">
                    Start Chat
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FAQ;