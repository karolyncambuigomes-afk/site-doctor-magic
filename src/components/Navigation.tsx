import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/about', label: 'About Us' },
  { href: '/models', label: 'Our Models' },
  { href: '/services', label: 'Services' },
  { href: '/locations', label: 'Location' },
  { href: '/blog', label: 'Blog' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Check if we're on a model profile page
  const isModelPage = location.pathname.startsWith('/models/');
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-luxury ${
      isScrolled && isModelPage 
        ? 'opacity-0 pointer-events-none transform -translate-y-full' 
        : isScrolled || location.pathname === '/'
        ? 'bg-white/95 backdrop-blur-luxury border-b border-border/10' 
        : 'bg-transparent'
    }`}>
      <div className="container-width">
        <div className="flex items-center justify-between py-3 md:py-4">{/* Loro Piana style - clean spacing */}
          {/* Five London Logo - Always Dark for Loro Piana Style */}
          <div className="flex-1">
            <Link 
              to="/" 
              className={`font-heading font-light tracking-[0.2em] text-foreground transition-luxury hover:text-foreground/80 uppercase ${
                isScrolled || location.pathname === '/' ? 'text-sm lg:text-base' : 'text-lg lg:text-xl'
              }`}
            >
              Five London
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-16">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link ${
                  location.pathname === item.href ? 'nav-link-active' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="hidden lg:flex items-center space-x-12 flex-1 justify-end">
            <a 
              href="tel:+442045678901" 
              className="caption hover:text-foreground transition-luxury"
            >
              +44 20 4567 8901
            </a>
            <Link to="/contact">
              <button className="five-london-button-outline">
                Enquire
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-muted-foreground transition-luxury"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border/30 bg-background/95 backdrop-blur-luxury">
            <div className="container-width py-6">
              <div className="flex flex-col space-y-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`nav-link text-lg ${
                      location.pathname === item.href ? 'nav-link-active' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-8 border-t border-border/30 space-y-6">
                  <a 
                    href="tel:+442045678901" 
                    className="block caption hover:text-foreground transition-luxury"
                  >
                    +44 20 4567 8901
                  </a>
                  <Link to="/contact">
                    <button className="five-london-button w-full">
                      Enquire
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};