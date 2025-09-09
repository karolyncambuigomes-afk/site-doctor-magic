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
  { href: '/models', label: 'Models' },
  { href: '/membership', label: 'Membership' },
  { href: '/services', label: 'Services' },
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
  
  const isHomepage = location.pathname === '/';
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 md:py-3 text-foreground">
          <SafeLink 
            to="/" 
            className="luxury-heading-sm font-medium uppercase transition-colors hover:text-gray-600 text-black"
          >
            Five London
            <span className="text-xs ml-2 font-normal text-muted-foreground">EST. 2020</span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <SafeLink
                key={item.href}
                to={item.href}
                className={`luxury-body-sm font-medium transition-colors ${
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
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
              className="luxury-body-sm transition-colors text-muted-foreground hover:text-foreground"
            >
              +44 7436 190679
            </a>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-foreground hover:text-muted-foreground">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   {auth?.isAdmin && (
                     <DropdownMenuItem asChild>
                       <SafeLink to="/admin" className="flex items-center">
                         <Settings className="w-4 h-4 mr-2" />
                         Admin Panel
                       </SafeLink>
                     </DropdownMenuItem>
                   )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="https://wa.me/447436190679">
                <Button variant="outline">
                  Call Now
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors text-black hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-8">
                {navItems.map((item) => (
                  <SafeLink
                    key={item.href}
                    to={item.href}
                    className={`luxury-body-base font-medium transition-colors ${
                      location.pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </SafeLink>
                ))}
                <div className="pt-8 border-t border-border space-y-6">
                  <a 
                    href="tel:+447436190679" 
                    className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors"
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
                         {auth?.isAdmin && (
                           <SafeLink to="/admin">
                             <Button variant="outline" className="w-full">
                               <Settings className="w-4 h-4 mr-2" />
                               Admin Panel
                             </Button>
                           </SafeLink>
                         )}
                        <button 
                          onClick={signOut}
                          className="w-full text-left text-red-600 hover:text-red-700 transition-colors luxury-body-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2 inline" />
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <a href="https://wa.me/447436190679">
                          <Button className="w-full">
                            Book Now
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