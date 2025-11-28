import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Shield } from 'lucide-react';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useContactSettings } from '@/hooks/useContactSettings';

const LondonEscortGuide = () => {
  const { getSectionValue } = useSiteContent('guide_');
  const { getWhatsAppLink } = useContactSettings();
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "London Escort Guide", url: "https://fivelondon.com/london-escort-guide" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Complete Guide to London Escort Services - Elite Companionship in London",
      "description": "Comprehensive guide to luxury escort services in London, covering best areas, booking process, etiquette, and safety guidelines for elite companionship.",
      "author": {
        "@type": "Organization",
        "name": "Five London"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Five London"
      }
    }
  ];

  return (
    <>
      <SEOOptimized 
        title="London Escort Guide | Complete Guide to Elite Companionship Services | Five London"
        description="Complete guide to London escort services. Learn about premium areas, booking process, etiquette, and safety for elite companionship in London. Expert advice from Five London."
        keywords="london escort guide, escort services london, elite companionship guide, premium escort advice, london escort areas, escort booking guide, companion services london"
        canonicalUrl="/london-escort-guide"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-0">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                {getSectionValue('guide_hero', 'title', 'London Escort Guide')}
              </h1>
              <p className="luxury-body-lg text-black mb-12 md:mb-12">
                {getSectionValue('guide_hero', 'subtitle', 'Your comprehensive guide to elite escort services in London\'s most prestigious districts')}
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>

        {/* Hidden SEO Content - Best Areas for Elite Companionship */}
        <div className="sr-only">
          <h2>Best Areas for Elite Companionship in London</h2>
          <h3>Mayfair - The Pinnacle of London Luxury Escort Services</h3>
          <p>Mayfair represents the absolute pinnacle of London's luxury escort scene, home to the city's most exclusive private members' clubs, Michelin-starred restaurants, and luxury hotels. The area's sophisticated atmosphere, with venues like Claridge's, The Connaught, and exclusive private clubs such as Annabel's and 5 Hertford Street, creates the perfect backdrop for elite companionship. Mayfair escorts are accustomed to the highest standards of discretion and sophistication, seamlessly blending into this rarefied environment of international business leaders, celebrities, and aristocracy.</p>
          
          <h3>Knightsbridge - Luxury Shopping and Premium Companionship</h3>
          <p>Knightsbridge, centered around Harrods and Harvey Nichols, attracts clients who appreciate luxury and refinement. The area's proximity to Hyde Park, exclusive restaurants like Dinner by Heston Blumenthal, and luxury hotels such as The Berkeley and Mandarin Oriental makes it ideal for sophisticated companionship experiences. Knightsbridge escorts excel at luxury shopping experiences, fine dining, and cultural events, understanding the refined tastes of international clientele who frequent this prestigious district.</p>
          
          <h3>Chelsea - Artistic Sophistication and Cultural Companionship</h3>
          <p>Chelsea's unique blend of artistic heritage and affluent lifestyle creates opportunities for cultured companionship experiences. From the Saatchi Gallery to the fashionable King's Road, Chelsea attracts clients who appreciate creativity, culture, and intellectual conversation. The area's riverside location, trendy restaurants, and artistic venues provide diverse settings for sophisticated encounters with companions who possess both beauty and cultural sophistication.</p>
          
          <h3>Belgravia - Diplomatic Discretion and Elite Privacy</h3>
          <p>Belgravia's status as London's embassy district and its beautiful Georgian architecture create an atmosphere of refined discretion perfect for high-level companionship. The area's exclusive residences, private gardens, and diplomatic connections attract international clients who require the utmost in privacy and sophistication. Belgravia escorts understand the importance of discretion and cultural sensitivity when working with international diplomats and business leaders.</p>
          
          <h3>Canary Wharf - Business Companionship and Corporate Events</h3>
          <p>London's modern financial district requires companions who understand the business world and can seamlessly integrate into corporate environments. Canary Wharf's concentration of international banks, law firms, and multinational corporations creates demand for professional companionship services for business dinners, client entertainment, and corporate events. The area's high-end restaurants, luxury hotels, and business atmosphere require escorts with business acumen and professional presentation skills.</p>
        </div>

        {/* Hidden SEO Content - Understanding Premium Escort Services */}
        <div className="sr-only">
          <h2>Understanding Premium Escort Services in London</h2>
          <h3>Types of Elite Companionship Services Available</h3>
          <p>London's premium escort services encompass a wide range of sophisticated companionship options designed to meet the diverse needs of discerning clientele. Dinner date companionship represents one of the most popular services, with escorts accompanying clients to London's finest restaurants including Rules, Sketch, and The Ledbury. These experiences require companions with extensive knowledge of fine dining etiquette, wine appreciation, and the ability to engage in sophisticated conversation across diverse topics.</p>
          
          <h3>Business and Corporate Companionship Services</h3>
          <p>Corporate companionship services cater to business professionals who require elegant representation at industry events, conferences, and business dinners. These services are particularly popular in London's financial districts, where international business leaders seek sophisticated companions who can navigate complex social and professional situations with grace and intelligence. Corporate escorts possess business knowledge, professional wardrobe, and the social skills necessary to enhance their client's professional image.</p>
          
          <h3>Cultural and Entertainment Companionship</h3>
          <p>London's rich cultural landscape creates opportunities for specialized cultural companionship, with escorts accompanying clients to West End shows, opera performances at the Royal Opera House, art exhibitions, and exclusive cultural events. These companions possess deep knowledge of arts, literature, music, and cultural history, enhancing the cultural experience through informed conversation and genuine appreciation for the arts.</p>
          
          <h3>Travel and International Companionship</h3>
          <p>London's status as an international hub creates demand for travel companionship services, with escorts accompanying clients on business trips and luxury holidays to destinations worldwide. Travel companions possess passports, international experience, cultural knowledge, and the flexibility to adapt to different time zones and cultural contexts while maintaining the high standards of companionship expected by elite clientele.</p>
          
          <h3>Private and Intimate Companionship Services</h3>
          <p>Private companionship services provide more personal and intimate experiences for clients seeking genuine connection and emotional intimacy. These services require escorts with exceptional emotional intelligence, empathy, and the ability to create authentic connections while maintaining professional boundaries and complete discretion.</p>
        </div>

        {/* Hidden SEO Content - Booking Etiquette and Expectations */}
        <div className="sr-only">
          <h2>Booking Etiquette and Expectations for London Escort Services</h2>
          <h3>Professional Booking Process and Communication</h3>
          <p>Professional escort booking begins with respectful, clear communication that demonstrates understanding of the service being requested. Initial contact should specify preferred date, time, duration, and type of companionship desired, whether dinner date, business event, cultural experience, or private encounter. Professional agencies like Five London maintain 24/7 booking services with experienced coordinators who can guide clients through the process while ensuring complete discretion and satisfaction.</p>
          
          <h3>Advance Booking vs Same-Day Availability</h3>
          <p>While same-day bookings are often available, particularly for established clients, advance booking ensures access to the most sought-after companions and allows for proper preparation of special requests. Popular times such as weekends, holidays, and major London events (Royal Ascot, London Fashion Week, Wimbledon) require advance planning. Premium agencies maintain companion availability calendars and can provide immediate confirmation for advance bookings.</p>
          
          <h3>Financial Arrangements and Payment Methods</h3>
          <p>Professional escort services operate with transparent pricing structures and multiple payment options to ensure client convenience and discretion. Premium agencies accept cash, bank transfers, and cryptocurrency payments, with all financial arrangements confirmed prior to the appointment. Rates vary based on companion selection, duration, and specific services requested, with overnight and travel companionship commanding premium rates reflecting the extended time commitment.</p>
          
          <h3>Client Verification and Safety Protocols</h3>
          <p>Reputable escort agencies implement client verification procedures to ensure the safety of their companions while respecting client privacy. This may include identity verification, reference checks for new clients, and clear communication of expectations and boundaries. These protocols protect both parties and ensure a professional, safe experience for all involved.</p>
          
          <h3>Cancellation Policies and Schedule Flexibility</h3>
          <p>Professional agencies maintain clear cancellation policies that balance client needs with fair compensation for companions. Typical policies allow modifications up to 2-4 hours before appointment time, with different terms for overnight bookings and international travel. Understanding these policies helps ensure smooth booking experiences and maintains positive relationships with premium agencies.</p>
        </div>

        {/* Hidden SEO Content - Safety and Discretion Guidelines */}
        <div className="sr-only">
          <h2>Safety and Discretion Guidelines for London Escort Services</h2>
          <h3>Absolute Discretion and Privacy Protection</h3>
          <p>Professional escort agencies maintain the highest standards of client discretion through secure communication methods, confidential booking systems, and strict data protection protocols. No permanent records of client information are maintained, all communications use encrypted channels, and companion briefings emphasize complete confidentiality. This level of discretion protection is essential for high-profile clients including business executives, celebrities, politicians, and international dignitaries who require absolute privacy.</p>
          
          <h3>Companion Safety and Client Verification</h3>
          <p>Companion safety remains the top priority for professional agencies, with comprehensive safety protocols including client verification, check-in procedures, and emergency contact systems. Companions are trained in personal safety, boundary setting, and professional communication to ensure their well-being while providing exceptional service. These safety measures create a secure environment that benefits both companions and clients.</p>
          
          <h3>Professional Boundaries and Service Expectations</h3>
          <p>Clear professional boundaries ensure positive experiences for all parties involved in escort services. These boundaries are communicated during booking and maintained throughout the companionship experience. Professional companions are trained to provide exceptional service while maintaining appropriate professional distance, ensuring that all interactions remain respectful, consensual, and within agreed-upon parameters.</p>
          
          <h3>Health and Wellness Standards</h3>
          <p>Premium escort agencies maintain comprehensive health and wellness standards for their companions, including regular health screenings, wellness programs, and personal safety training. These standards ensure that companions can provide their best service while maintaining their physical and emotional well-being throughout their careers in the companionship industry.</p>
          
          <h3>Legal Compliance and Regulatory Adherence</h3>
          <p>Professional escort agencies operate in full compliance with UK regulations governing companionship services, ensuring that all activities remain within legal boundaries. This includes proper business registration, tax compliance, advertising standards adherence, and workplace safety compliance. Legal compliance protects both agencies and clients while maintaining the legitimacy and professionalism of the industry.</p>
        </div>

        {/* Visible Summary Cards */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              <Card className="text-center">
                <CardHeader>
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="luxury-heading-sm">Best Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="luxury-body-base text-muted-foreground">
                    Mayfair, Knightsbridge, Chelsea, Belgravia - London's premium districts
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="luxury-heading-sm">Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="luxury-body-base text-muted-foreground">
                    24/7 service, same-day available, advance booking recommended
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="luxury-heading-sm">Safety</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="luxury-body-base text-muted-foreground">
                    Complete discretion, verified companions, secure processes
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="luxury-heading-sm">Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="luxury-body-base text-muted-foreground">
                    Elite companions, luxury experiences, exceptional service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="luxury-heading-xl mb-4">
                {getSectionValue('guide_cta', 'title', 'Ready to Book Your Perfect Companion?')}
              </h2>
              <p className="text-gray-600 mb-8">
                {getSectionValue('guide_cta', 'subtitle', 'Our experienced booking coordinators are available 24/7 to help you find the ideal companion.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => window.open(getWhatsAppLink(), '_blank')}
                >
                  Call Now - Same Day Available
                </Button>
                <Link to="/models">
                  <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
                    Browse All Companions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};

export default LondonEscortGuide;