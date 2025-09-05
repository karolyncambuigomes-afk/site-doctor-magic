import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-width section-padding-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand - Removed */}
          <div className="hidden"></div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="caption text-foreground/60">Explore</h4>
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
                  className="caption text-foreground/40 hover:text-foreground/60 transition-luxury block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="caption text-foreground/60">Connect</h4>
            <div className="space-y-3">
              <a 
                href="tel:+447436190679"
                className="flex items-center space-x-2 caption text-foreground/40 hover:text-foreground/60 transition-luxury"
              >
                <Phone className="w-3 h-3" />
                <span>+44 7436 190679</span>
              </a>
              <a 
                href="mailto:info@fivelondon.com"
                className="flex items-center space-x-2 caption text-foreground/40 hover:text-foreground/60 transition-luxury"
              >
                <Mail className="w-3 h-3" />
                <span>info@fivelondon.com</span>
              </a>
              <div className="flex items-center space-x-2 caption text-foreground/40">
                <MapPin className="w-3 h-3" />
                <span>Central London</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Bottom */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
            <p className="caption text-foreground/30">
              © {currentYear}
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy-policy" 
                className="caption text-foreground/30 hover:text-foreground/50 transition-luxury"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="caption text-foreground/30 hover:text-foreground/50 transition-luxury"
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