import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/models', label: 'Our Models' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background border-b border-border' : 'bg-transparent'
    }`}>
      <div className="container-width">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-light tracking-wide text-foreground transition-colors hover:text-muted-foreground"
          >
            Five London
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-muted-foreground ${
                  location.pathname === item.href ? 'text-foreground border-b border-foreground pb-1' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact & CTA */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="tel:+442045678901" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              +44 20 4567 8901
            </a>
            <Button className="minimal-button-outline">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-muted-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container-width py-8">
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-6 border-t border-border space-y-4">
                  <a 
                    href="tel:+442045678901" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +44 20 4567 8901
                  </a>
                  <Button className="minimal-button w-full">Book Now</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};