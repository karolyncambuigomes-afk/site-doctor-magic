import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const navItems = [
  { href: '/about', label: 'About Us' },
  { href: '/models', label: 'Our Models' },
  { href: '/services', label: 'Services' },
  { href: '/locations', label: 'Locations' },
  { href: '/blog', label: 'Blog' }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut, hasAccess } = useAuth();
  console.log('Navigation - User:', user?.email, 'HasAccess:', hasAccess);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled && isModelPage 
        ? 'opacity-0 pointer-events-none transform -translate-y-full' 
        : isScrolled || location.pathname === '/'
        ? 'bg-background/95 backdrop-blur-sm border-b border-border/50' 
        : 'bg-transparent'
    }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 md:py-3">
          <Link 
            to="/" 
            className={`font-manrope font-medium uppercase text-foreground transition-colors hover:text-primary ${
              isScrolled || location.pathname === '/' ? 'text-lg lg:text-xl' : 'text-xl lg:text-2xl'
            }`}
          >
            Five London
            <span className="text-xs text-muted-foreground ml-2 font-normal">EST. 2020</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium text-sm transition-colors ${
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="tel:+447436190679"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              +44 7436 190679
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-medium">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a href="https://wa.me/447436190679">
                  <Button variant="outline">
                    Call Now
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-muted-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-lg font-medium transition-colors ${
                      location.pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-8 border-t border-border/30 space-y-6">
                  <a 
                    href="tel:+447436190679" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +44 7436 190679
                  </a>
                  
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                      <Link to="/admin">
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      </Link>
                      <button 
                        onClick={signOut}
                        className="w-full text-left text-red-600 hover:text-red-700 transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4 mr-2 inline" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <a href="https://wa.me/447436190679">
                        <Button className="w-full">
                          Call Now
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};