import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-width section-padding-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading font-light text-lg tracking-[0.2em] text-foreground/60 uppercase">
              Five London
            </h3>
            <p className="text-xs text-foreground/40 max-w-sm leading-relaxed">
              London's premier luxury companion agency, providing sophisticated 
              and discreet services for discerning clientele.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Explore</h4>
            <div className="grid grid-cols-2 gap-2">
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
                  className="text-xs text-foreground/40 hover:text-foreground/60 transition-luxury block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Connect</h4>
            <div className="space-y-3">
              <a 
                href="tel:+442045678901"
                className="flex items-center space-x-2 text-xs text-foreground/40 hover:text-foreground/60 transition-luxury"
              >
                <Phone className="w-3 h-3" />
                <span>+44 20 4567 8901</span>
              </a>
              <a 
                href="mailto:info@fivelondon.com"
                className="flex items-center space-x-2 text-xs text-foreground/40 hover:text-foreground/60 transition-luxury"
              >
                <Mail className="w-3 h-3" />
                <span>info@fivelondon.com</span>
              </a>
              <div className="flex items-center space-x-2 text-xs text-foreground/40">
                <MapPin className="w-3 h-3" />
                <span>Central London</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
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