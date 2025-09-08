import { useState } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle, ChevronUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScrollFooter } from '@/hooks/useScrollFooter';

export const SlidingFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { isVisible, isExpanded, hideFooter } = useScrollFooter();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      {/* Overlay backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={hideFooter}
        />
      )}

      {/* Footer container */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}>
        {/* Footer tab - visible when not expanded */}
        <div 
          className={`bg-slate-800 text-white transition-all duration-500 ${
            isExpanded ? 'rounded-t-xl opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Five London</span>
              <span className="text-xs text-white/70">Premium Companion Services</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-white/70 hidden sm:block">
                {isExpanded ? 'Scroll to explore' : 'Luxury awaits'}
              </span>
              <ChevronUp 
                className={`w-5 h-5 transition-transform duration-500 ${
                  isExpanded ? 'rotate-180' : 'animate-pulse'
                }`} 
              />
            </div>
          </div>
        </div>

        {/* Expanded footer content */}
        <div 
          className={`bg-slate-800 text-white transition-all duration-500 ease-out overflow-hidden ${
            isExpanded 
              ? 'max-h-[80vh] opacity-100 translate-y-0' 
              : 'max-h-0 opacity-0 translate-y-full'
          }`}
        >
          <div className="relative">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                hideFooter();
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close footer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="container mx-auto px-6 py-8 overflow-y-auto max-h-[70vh]">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Newsletter Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 tracking-wider uppercase">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-xs text-white/70 mb-4 leading-relaxed">
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
                      <Button type="submit" className="px-4 bg-white text-slate-800 hover:bg-white/90">
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
                    <h4 className="text-sm font-medium text-white mb-4 tracking-wider uppercase">
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
                  <h4 className="text-sm font-medium text-white tracking-wider uppercase">
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
                  <h4 className="text-sm font-medium text-white tracking-wider uppercase">
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
              <div className="mt-8 pt-6 border-t border-white/20">
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
          </div>
        </div>
      </div>
    </>
  );
};