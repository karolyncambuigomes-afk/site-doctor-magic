import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
  const { user, signOut, hasAccess } = useAuth();

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
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-6">
          <Link 
            to="/" 
            className={`font-medium tracking-wide text-foreground transition-colors hover:text-primary ${
              isScrolled || location.pathname === '/' ? 'text-lg lg:text-xl' : 'text-xl lg:text-2xl'
            }`}
          >
            Five London
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium text-sm transition-colors ${
                  location.pathname === item.href 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact & Auth */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="tel:+442045678901" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              +44 20 4567 8901
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {hasAccess && (
                  <div className="flex items-center space-x-1 text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
                
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
                    {!hasAccess && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/upgrade" className="flex items-center">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/contact">
                  <Button variant="outline">
                    Enquire
                  </Button>
                </Link>
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
                    href="tel:+442045678901" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +44 20 4567 8901
                  </a>
                  
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                        {hasAccess && (
                          <div className="flex items-center space-x-1 text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                            <Crown className="w-3 h-3" />
                            <span>Premium</span>
                          </div>
                        )}
                      </div>
                      {!hasAccess && (
                        <Link to="/upgrade">
                          <Button className="w-full">
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                          </Button>
                        </Link>
                      )}
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
                      <Link to="/contact">
                        <Button className="w-full">
                          Enquire
                        </Button>
                      </Link>
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