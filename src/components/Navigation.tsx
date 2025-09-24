<<<<<<< HEAD
import React from "react";
import { SafeLink } from "@/components/ui/safe-link";
import { useSafeLocation } from "@/hooks/useSafeRouter";
import { Menu, X, User, LogOut, Settings } from "@/components/LazyLucideIcon";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/about", label: "About Us" },
  { href: "/models", label: "Models" },
  { href: "/membership", label: "Membership" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/join-us", label: "Join Us" },
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

  if (!location) return null;

  const isHomepage = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 md:py-3 text-foreground">
          {/* Logo */}
          <SafeLink
            to="/"
            className="luxury-heading-sm font-medium uppercase transition-colors hover:text-gray-600 text-black"
          >
            Five London
            <span className="text-xs ml-2 font-normal text-muted-foreground">
              EST. 2020
            </span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <SafeLink
                key={item.href}
                to={item.href}
                className={`luxury-body-sm font-medium transition-colors ${
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/")
                    ? "text-[#020817]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </SafeLink>
            ))}
          </div>

          {/* Contact & Auth (Desktop) */}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-foreground hover:text-muted-foreground"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SafeLink to="/models" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Browse Models
                    </SafeLink>
                  </DropdownMenuItem>
                  {auth?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <SafeLink to="/admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </SafeLink>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <a href="https://wa.me/447436190679">
                <Button variant="outline">Contact Us</Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors text-black hover:text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>
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
                    location.pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </SafeLink>
              ))}

              <div className="pt-8 border-t border-border space-y-6">
                <div className="flex items-center justify-between">
                  <a
                    href="tel:+447436190679"
                    className="block luxury-body-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +44 7436 190679
                  </a>
                </div>
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <SafeLink to="/models">
                      <Button variant="outline" className="w-full mb-2">
                        <User className="w-4 h-4 mr-2" />
                        Browse Models
                      </Button>
                    </SafeLink>
                    {auth?.isAdmin && (
                      <SafeLink to="/admin">
                        <Button variant="outline" className="w-full mb-2">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      </SafeLink>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to sign out?")) {
                          signOut();
                        }
                      }}
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors luxury-body-sm"
                    >
                      <LogOut className="w-4 h-4 mr-2 inline" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <a href="https://wa.me/447436190679">
                    <Button className="w-full">Contact Us</Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
=======
import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { useSafeLocation } from '@/hooks/useSafeRouter';
import { Menu, X, User, LogOut, Settings, Moon, Sun } from '@/components/LazyLucideIcon';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  LazyDropdownMenu as DropdownMenu, 
  LazyDropdownMenuContent as DropdownMenuContent, 
  LazyDropdownMenuItem as DropdownMenuItem, 
  LazyDropdownMenuSeparator as DropdownMenuSeparator, 
  LazyDropdownMenuTrigger as DropdownMenuTrigger 
} from '@/components/LazyRadixComponents';

const navItems = [
  { href: '/about', label: 'About Us' },
  { href: '/models', label: 'Models' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/join-us', label: 'Join Us' }
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const location = useSafeLocation();
  const auth = useAuth();
  const { user, signOut } = auth || {};

  React.useEffect(() => {
    if (location) {
      setIsOpen(false);
    }
  }, [location]);

  // Initialize dark mode from localStorage and system preference
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  if (!location) {
    return null;
  }
  
  const isHomepage = location.pathname === '/';
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 border-b border-border dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 md:py-3 text-foreground">
          <SafeLink 
            to="/" 
            className="luxury-heading-sm font-medium uppercase transition-colors hover:text-gray-600 dark:hover:text-gray-300 text-black dark:text-white"
          >
            Five London
            <span className="text-xs ml-2 font-normal text-muted-foreground dark:text-gray-400">EST. 2020</span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <SafeLink
                key={item.href}
                to={item.href}
                className={`luxury-body-sm font-medium transition-colors ${
                  location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    ? 'text-foreground dark:text-white' 
                    : 'text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white'
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
              className="luxury-body-sm transition-colors text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white"
            >
              +44 7436 190679
            </a>
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 rounded-full text-foreground hover:text-muted-foreground dark:text-white dark:hover:text-gray-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-foreground hover:text-muted-foreground dark:text-white dark:hover:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="font-medium">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SafeLink to="/models" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Browse Models
                    </SafeLink>
                  </DropdownMenuItem>
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
              <div className="flex items-center space-x-2">
                <SafeLink to="/membership">
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    Become a Member
                  </Button>
                </SafeLink>
                <a href="https://wa.me/447436190679">
                  <Button variant="outline">
                    Contact Us
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 transition-colors text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-8">
                {navItems.map((item) => (
                  <SafeLink
                    key={item.href}
                    to={item.href}
                    className={`luxury-body-base font-medium transition-colors ${
                      location.pathname === item.href ? 'text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </SafeLink>
                ))}
                <div className="pt-8 border-t border-border dark:border-gray-700 space-y-6">
                  <a 
                    href="tel:+447436190679" 
                    className="block luxury-body-sm text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    +44 7436 190679
                  </a>
                  
                  {/* Dark Mode Toggle for Mobile */}
                  <Button
                    variant="outline"
                    onClick={toggleDarkMode}
                    className="w-full mb-2"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                  
                  {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground dark:text-gray-300">
                            {user.email}
                          </span>
                         </div>
                         <SafeLink to="/models">
                           <Button variant="outline" className="w-full mb-2">
                             <User className="w-4 h-4 mr-2" />
                             Browse Models
                           </Button>
                         </SafeLink>
                         {auth?.isAdmin && (
                           <SafeLink to="/admin">
                             <Button variant="outline" className="w-full mb-2">
                               <Settings className="w-4 h-4 mr-2" />
                               Admin Panel
                             </Button>
                           </SafeLink>
                         )}
                         <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to sign out?')) {
                              signOut();
                            }
                          }}
                          className="w-full text-left text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors luxury-body-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2 inline" />
                          Sign Out
                        </button>
                      </div>
                     ) : (
                       <div className="space-y-2">
                         <SafeLink to="/membership">
                           <Button className="w-full mb-2">
                             Become a Member
                           </Button>
                         </SafeLink>
                         <a href="https://wa.me/447436190679">
                           <Button variant="outline" className="w-full">
                             Contact Us
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
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
