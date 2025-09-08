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

  return (
    <footer 
      className="bg-luxury-navy text-white relative z-50 w-full"
      style={{ backgroundColor: '#0f1419', color: '#ffffff' }}
    >
      <div className="container mx-auto px-4 py-16">{" "}
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="body-sm font-medium text-white mb-4 tracking-wider uppercase">
                Subscribe to Our Newsletter
              </h3>
              <p className="body-xs text-white/70 mb-4 leading-relaxed">
                Stay informed about our exclusive events, new companions, and luxury experiences in London.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-white"
                  required
                />
                <Button type="submit" className="px-6 bg-white text-luxury-navy hover:bg-white/90">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-white/60 mt-2">
                By subscribing, you agree to our{' '}
                <SafeLink to="/privacy-policy" className="underline hover:text-white">
                  Privacy Policy
                </SafeLink>
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="body-sm font-medium text-white mb-4 tracking-wider uppercase">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white/60 hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white/60 hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white/60 hover:text-white"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/447436190679"
                  className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white/60 hover:text-white"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="body-sm font-medium text-white tracking-wider uppercase">
              Our Services
            </h4>
            <div className="space-y-3">
              <SafeLink to="/models" className="block text-sm text-white/70 hover:text-white transition-colors">
                Elite Companions
              </SafeLink>
              <SafeLink to="/services" className="block text-sm text-white/70 hover:text-white transition-colors">
                Premium Services
              </SafeLink>
              <SafeLink to="/locations" className="block text-sm text-white/70 hover:text-white transition-colors">
                London Locations
              </SafeLink>
              <SafeLink to="/characteristics" className="block text-sm text-white/70 hover:text-white transition-colors">
                Companion Types
              </SafeLink>
              <SafeLink to="/blog" className="block text-sm text-white/70 hover:text-white transition-colors">
                Lifestyle Blog
              </SafeLink>
            </div>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h4 className="body-sm font-medium text-white tracking-wider uppercase">
              Support & Information
            </h4>
            <div className="space-y-3">
              <a 
                href="tel:+447436190679"
                className="flex items-center space-x-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+44 7436 190679</span>
              </a>
              <a 
                href="mailto:info@fivelondon.com"
                className="flex items-center space-x-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <MapPin className="w-4 h-4" />
                <span>Central London</span>
              </div>
              <SafeLink to="/faq" className="block text-sm text-white/70 hover:text-white transition-colors">
                FAQ
              </SafeLink>
              <SafeLink to="/about" className="block text-sm text-white/70 hover:text-white transition-colors">
                About Us
              </SafeLink>
              <SafeLink to="/reviews" className="block text-sm text-white/70 hover:text-white transition-colors">
                Reviews
              </SafeLink>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <p className="text-sm text-white/70">
                © {currentYear} Five London. All rights reserved.
              </p>
              <p className="text-xs text-white/60">
                Premium companion services in London since 2020
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <SafeLink 
                to="/privacy-policy" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacy Policy
              </SafeLink>
              <SafeLink 
                to="/terms" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Terms of Service
              </SafeLink>
              <span className="text-white/70">
                Discretion Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};