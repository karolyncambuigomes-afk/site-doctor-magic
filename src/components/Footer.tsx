import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-width section-padding-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Brand */}
          <div className="space-y-8">
            <h3 className="font-heading font-light text-2xl tracking-[0.3em] text-foreground uppercase">
              Five London
            </h3>
            <p className="body-minimal max-w-sm">
              London's premier luxury companion agency, providing sophisticated 
              and discreet services for discerning clientele.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <h4 className="heading-sm">Explore</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/services', label: 'Services' },
                { href: '/blog', label: 'Blog' },
                { href: '/models', label: 'Companions' },
                { href: '/locations', label: 'Locations' },
                { href: '/reviews', label: 'Reviews' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link 
                  key={link.href}
                  to={link.href}
                  className="caption hover:text-foreground transition-luxury block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h4 className="heading-sm">Connect</h4>
            <div className="space-y-6">
              <a 
                href="tel:+442045678901"
                className="flex items-center space-x-4 caption hover:text-foreground transition-luxury"
              >
                <Phone className="w-4 h-4" />
                <span>+44 20 4567 8901</span>
              </a>
              <a 
                href="mailto:info@fivelondon.com"
                className="flex items-center space-x-4 caption hover:text-foreground transition-luxury"
              >
                <Mail className="w-4 h-4" />
                <span>info@fivelondon.com</span>
              </a>
              <div className="flex items-center space-x-4 caption">
                <MapPin className="w-4 h-4" />
                <span>Central London</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom */}
        <div className="mt-24 pt-12 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <p className="caption">
              © {currentYear} Five London. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link 
                to="/privacy-policy" 
                className="caption hover:text-foreground transition-luxury"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="caption hover:text-foreground transition-luxury"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};