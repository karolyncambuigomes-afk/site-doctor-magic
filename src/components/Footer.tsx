import { useState } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScriptInjector } from '@/components/ScriptInjector';
import { useContactSettings } from '@/hooks/useContactSettings';
import { useSiteContent } from '@/hooks/useSiteContent';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const { phone_display, getWhatsAppLink, getPhoneLink } = useContactSettings();
  const { getSectionValue } = useSiteContent('footer_');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-white text-foreground relative z-50 w-full">
      <div className="container mx-auto px-4 py-16 bg-white">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="luxury-body-sm font-medium text-black mb-4 tracking-wider uppercase">
                {getSectionValue('footer_newsletter_title', 'title', 'Subscribe to Our Newsletter')}
              </h3>
              <p className="luxury-body-xs text-muted-foreground mb-2 leading-relaxed">
                {getSectionValue('footer_newsletter_subtitle', 'subtitle', 'Stay informed about our exclusive events, new companions, and luxury experiences in London.')}
              </p>
              <p className="luxury-body-xs text-muted-foreground mb-4 leading-relaxed">
                {getSectionValue('footer_newsletter_content', 'content', 'Receive priority access to new model arrivals, special events in Mayfair, Knightsbridge, and Chelsea, plus insider guides to London\'s finest restaurants, hotels, and cultural experiences. Our newsletter delivers curated content for discerning clients who appreciate luxury, sophistication, and exclusivity.')}
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
                Contact Us
              </h4>
              <div className="flex space-x-4">
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-muted hover:border-foreground transition-colors text-muted-foreground hover:text-foreground" 
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="luxury-body-sm font-medium text-black tracking-wider uppercase">OUR SERVICES</h4>
            <div className="space-y-3">
              <SafeLink to="/" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Elite Companions
              </SafeLink>
              <SafeLink to="/services" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Premium Services
              </SafeLink>
              <SafeLink to="/membership" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Membership
              </SafeLink>
              <SafeLink to="/join-us" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Become a Companion
              </SafeLink>
              <SafeLink to="/reviews" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Client Reviews
              </SafeLink>
            </div>
          </div>

          {/* Support & Info */}
          <div className="space-y-4">
            <h4 className="luxury-body-sm font-medium text-black tracking-wider uppercase">
              Support & Information
            </h4>
            <div className="space-y-3">
              <a href={getPhoneLink()} className="flex items-center space-x-2 luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>{phone_display}</span>
              </a>
              <SafeLink to="/contact" className="flex items-center space-x-2 luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </SafeLink>
              <div className="flex items-center space-x-2 luxury-body-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Central London</span>
              </div>
              <SafeLink to="/faq" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </SafeLink>
              <SafeLink to="/privacy-policy" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </SafeLink>
            </div>
          </div>

          {/* Local Information - New GEO Section */}
          <div className="space-y-4">
            <h4 className="luxury-body-sm font-medium text-black tracking-wider uppercase">
              London Areas
            </h4>
            <div className="space-y-3">
              <SafeLink to="/locations" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                All Locations
              </SafeLink>
              <SafeLink to="/characteristics" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Companion Types
              </SafeLink>
              <SafeLink to="/blog" className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors">
                Lifestyle & Events
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
                {getSectionValue('footer_description_1', 'content', 'Premium companion services in London since 2020. Elite escort agency specializing in sophisticated companions for business events, social occasions, and cultural experiences throughout Central London\'s most prestigious areas.')}
              </p>
              <p className="text-xs text-muted-foreground">
                {getSectionValue('footer_description_2', 'content', 'Licensed professional services with complete discretion guaranteed. Available 24/7 for outcall services to luxury hotels and private venues in Mayfair, Knightsbridge, Chelsea, and Belgravia.')}
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

        {/* Partner Banners */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-4 lg:flex lg:flex-row lg:justify-center lg:items-center lg:gap-8">
            <ScriptInjector position="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
