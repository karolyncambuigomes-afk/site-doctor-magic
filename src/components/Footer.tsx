import { useState } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  return <footer className="bg-white text-foreground relative z-50 w-full">
      <div className="container mx-auto px-4 py-16 bg-gray-100">{" "}
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="luxury-body-sm font-medium text-black mb-4 tracking-wider uppercase">
                Subscribe to Our Newsletter
              </h3>
              <p className="luxury-body-xs text-muted-foreground mb-4 leading-relaxed">
                Stay informed about our exclusive events, new companions, and luxury experiences in London.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input type="email" placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" required />
                <Button type="submit" className="px-6">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                By subscribing, you agree to our{' '}
                <SafeLink to="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </SafeLink>
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="luxury-body-sm font-medium text-black mb-4 tracking-wider uppercase">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted hover:border-foreground transition-colors text-muted-foreground hover:text-foreground" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted hover:border-foreground transition-colors text-muted-foreground hover:text-foreground" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted hover:border-foreground transition-colors text-muted-foreground hover:text-foreground" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://wa.me/447436190679" className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted hover:border-foreground transition-colors text-muted-foreground hover:text-foreground" aria-label="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="luxury-body-sm font-medium text-black tracking-wider uppercase">OUR SCERVICES</h4>
            <div className="space-y-3">
              <SafeLink to="/models" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Elite Companions
              </SafeLink>
              <SafeLink to="/services" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Premium Services
              </SafeLink>
              <SafeLink to="/locations" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                London Locations
              </SafeLink>
              <SafeLink to="/characteristics" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Companion Types
              </SafeLink>
              <SafeLink to="/blog" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Lifestyle Blog
              </SafeLink>
            </div>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h4 className="luxury-body-sm font-medium text-black tracking-wider uppercase">
              Support & Information
            </h4>
            <div className="space-y-3">
              <a href="tel:+447436190679" className="flex items-center space-x-2 luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>+44 7436 190679</span>
              </a>
              <a href="mailto:info@fivelondon.com" className="flex items-center space-x-2 luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </a>
              <div className="flex items-center space-x-2 luxury-body-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Central London</span>
              </div>
              <SafeLink to="/faq" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </SafeLink>
              <SafeLink to="/about" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </SafeLink>
              <SafeLink to="/reviews" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </SafeLink>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <p className="luxury-body-sm text-muted-foreground">
                © {currentYear} Five London. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Premium companion services in London since 2020
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 luxury-body-sm">
              <SafeLink to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </SafeLink>
              <SafeLink to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </SafeLink>
              <span className="text-muted-foreground">
                Discretion Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};