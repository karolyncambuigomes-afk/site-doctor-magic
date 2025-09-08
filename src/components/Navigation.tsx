import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
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
  { href: '/membership', label: 'Membership' },
  { href: '/services', label: 'Services' },
  { href: '/locations', label: 'Locations' },
  { href: '/blog', label: 'Blog' },
  { href: '/join-us', label: 'Join Us' }
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useSafeLocation();
  const auth = useAuth();
  const { user, signOut } = auth || {};

  React.useEffect(() => {
    if (location) {
      setIsOpen(false);
    }
  }, [location]);
  
  if (!location) {
    return null;
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 md:py-3 text-white">
          <SafeLink 
            to="/" 
            className="font-manrope font-medium uppercase transition-colors hover:text-gray-300 text-white text-lg lg:text-xl"
          >
            Five London
            <span className="text-xs ml-2 font-normal text-white/70">EST. 2020</span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <SafeLink
                key={item.href}
                to={item.href}
                className={`font-medium text-sm transition-colors ${
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    ? 'text-gray-300' 
                    : 'text-white/90 hover:text-gray-300'
                }`}
              >
                {item.label}
              </SafeLink>
            ))}
          </div>

          {/* Contact & Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="tel:+447436190679"
              className="text-sm transition-colors text-white/90 hover:text-gray-300"
            >
              +44 7436 190679
            </a>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-white hover:text-gray-300">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SafeLink to="/admin" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </SafeLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="https://wa.me/447436190679">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Call Now
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors text-white hover:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-8">
                {navItems.map((item) => (
                  <SafeLink
                    key={item.href}
                    to={item.href}
                    className={`text-lg font-medium transition-colors ${
                      location.pathname === item.href ? 'text-black' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </SafeLink>
                ))}
                <div className="pt-8 border-t border-gray-300 space-y-6">
                  <a 
                    href="tel:+447436190679" 
                    className="block text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    +44 7436 190679
                  </a>
                  
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                      <SafeLink to="/admin">
                        <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-50">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      </SafeLink>
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
                        <Button className="w-full bg-black text-white hover:bg-gray-800">
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