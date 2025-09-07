import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-4 tracking-wider uppercase">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Stay informed about our exclusive events, new companions, and luxury experiences in London.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" variant="default" className="px-6">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                By subscribing, you agree to our{' '}
                <Link to="/privacy-policy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-4 tracking-wider uppercase">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/447436190679"
                  className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground tracking-wider uppercase">
              Our Services
            </h4>
            <div className="space-y-3">
              <Link to="/models" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Elite Companions
              </Link>
              <Link to="/services" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Premium Services
              </Link>
              <Link to="/locations" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                London Locations
              </Link>
              <Link to="/characteristics" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Companion Types
              </Link>
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Lifestyle Blog
              </Link>
            </div>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground tracking-wider uppercase">
              Support & Information
            </h4>
            <div className="space-y-3">
              <a 
                href="tel:+447436190679"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+44 7436 190679</span>
              </a>
              <a 
                href="mailto:info@fivelondon.com"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Central London</span>
              </div>
              <Link to="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/reviews" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Five London. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Premium companion services in London since 2020
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link 
                to="/privacy-policy" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-muted-foreground">
                Discretion Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};