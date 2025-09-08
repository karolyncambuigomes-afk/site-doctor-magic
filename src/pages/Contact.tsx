import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
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
          "email": "info@fivelondon.com",
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
      details: "info@fivelondon.com",
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
      <SEO 
        title="Contact Five London - Luxury Escort Booking & Inquiries"
        description="Contact Five London for luxury escort bookings and inquiries. Available 24/7 via phone, email, or WhatsApp. Discreet and professional service guaranteed."
        keywords="contact five london, luxury escort booking, escort inquiries london, book escort london, escort agency contact"
        canonicalUrl="/contact"
        structuredData={structuredData}
      />
      
      <Navigation />
      
      <main className="pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container-width text-center">
            <h1 className="heading-display mb-3 sm:mb-4 px-4 text-black">
              Call Now for <span className="text-slate-800">Same Day Booking</span>
            </h1>
            <p className="body-lg text-black max-w-2xl mx-auto px-4 sm:px-6">
              Most companions available today. Call now for instant confirmation and same-day appointments.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-white">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card 
                  key={method.title}
                  className="border border-gray-200 p-8 text-center group hover:shadow-sm transition-all duration-300 bg-white"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                    <method.icon className="w-8 h-8 text-black" />
                  </div>
                   <h3 className="heading-sm mb-2 text-black">{method.title}</h3>
                   <p className="body-base font-medium text-black mb-2">{method.details}</p>
                   <p className="body-sm text-black mb-4">{method.description}</p>
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => {
                      if (method.title === 'WhatsApp') {
                        window.open('https://wa.me/447436190679', '_blank');
                      } else if (method.title === 'Phone') {
                        window.location.href = 'tel:+447436190679';
                      } else if (method.title === 'Email') {
                        window.location.href = 'mailto:info@fivelondon.com';
                      }
                    }}
                  >
                    {method.action}
                  </Button>
                </Card>
              ))}
            </div>

            {/* Contact Form & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border border-gray-200 p-8 bg-white">
                <h2 className="heading-lg mb-6 text-black">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" type="text" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" type="text" required className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="service">Service Interest</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinner">Dinner Date</SelectItem>
                        <SelectItem value="business">Business Event</SelectItem>
                        <SelectItem value="travel">Travel Companion</SelectItem>
                        <SelectItem value="theatre">Theatre & Opera</SelectItem>
                        <SelectItem value="social">Social Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      required 
                      className="mt-1 min-h-[120px]"
                      placeholder="Please provide details about your requirements..."
                    />
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input type="checkbox" id="privacy" required className="mt-1" />
                    <Label htmlFor="privacy" className="text-sm text-muted-foreground">
                      I agree to the privacy policy and confirm I am over 18 years of age *
                    </Label>
                  </div>
                  
                  <Button type="submit" className="luxury-button w-full text-lg py-3">
                    Send Message
                  </Button>
                </form>
              </Card>

              {/* Additional Information */}
              <div className="space-y-8">
                {/* Business Hours */}
                <Card className="luxury-card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-md mb-2">Business Hours</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Monday - Sunday: 24/7</p>
                        <p>Phone Support: Always Available</p>
                        <p>Email Response: Within 2 hours</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="luxury-card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-md mb-2">Service Areas</h3>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Central London (Primary)</p>
                        <p>Greater London Area</p>
                        <p>UK Travel Available</p>
                        <p>International by Request</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Privacy */}
                <Card className="luxury-card p-6">
                  <div className="flex items-start space-x-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="heading-md mb-2">Privacy & Discretion</h3>
                      <p className="text-muted-foreground">
                        All communications are handled with complete confidentiality. Your privacy 
                        and discretion are our top priorities.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Quick Booking */}
                <Card className="luxury-card p-6 bg-gradient-luxury text-white">
                  <h3 className="heading-md mb-2">Need Immediate Assistance?</h3>
                  <p className="mb-4 opacity-90">
                    For urgent bookings or immediate assistance, call our 24/7 hotline
                  </p>
                  <Button variant="outline" className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30">
                    Call +44 7436 190679
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="section-padding bg-white">
          <div className="container-width text-center">
            <h2 className="heading-xl mb-4">
              Have <span className="luxury-text-gradient">Questions</span>?
            </h2>
            <p className="body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check our frequently asked questions for quick answers
            </p>
            <Button className="luxury-button text-lg px-8 py-4">
              View FAQ
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Contact;