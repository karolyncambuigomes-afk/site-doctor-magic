import React from "react";
import { SafeLink } from "@/components/ui/safe-link";
import { useSafeLocation } from "@/hooks/useSafeRouter";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/tracking";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { locations } from "@/data/locations";
import { characteristics } from "@/data/characteristics";

const simpleNavItems = [
  { href: "/membership", label: "Membership" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
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
            onClick={() => trackEvent('navigation_click', 'header', 'Logo - Home')}
            data-tracking-label="Logo - Home"
            data-tracking-category="navigation"
            className="luxury-heading-sm font-medium uppercase transition-colors hover:text-gray-600 text-black"
          >
            Five London
            <span className="text-xs ml-2 font-normal text-muted-foreground">
              EST. 2020
            </span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Locations Mega Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="luxury-body-sm font-medium transition-colors text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                Locations
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-[600px] max-h-[500px] overflow-y-auto bg-white z-[60] shadow-2xl border-t-2 border-primary/10 p-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {locations.map((loc) => (
                    <DropdownMenuItem key={loc.id} asChild>
                      <SafeLink 
                        to={`/${loc.slug}`}
                        onClick={() => trackEvent('navigation_click', 'locations_menu', `Location - ${loc.name}`)}
                        data-tracking-label={`Location - ${loc.name}`}
                        data-tracking-category="navigation"
                        className="cursor-pointer !text-black hover:!text-black hover:bg-accent/50 p-3 rounded-md transition-all font-medium"
                      >
                        {loc.name}
                      </SafeLink>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Companion Types Mega Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="luxury-body-sm font-medium transition-colors text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                Companion Types
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-[600px] max-h-[500px] overflow-y-auto bg-white z-[60] shadow-2xl border-t-2 border-primary/10 p-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {characteristics.map((char) => (
                    <DropdownMenuItem key={char.id} asChild>
                      <SafeLink 
                        to={`/characteristics/${char.slug}`}
                        onClick={() => trackEvent('navigation_click', 'companion_types_menu', `Companion Type - ${char.name}`)}
                        data-tracking-label={`Companion Type - ${char.name}`}
                        data-tracking-category="navigation"
                        className="cursor-pointer !text-black hover:!text-black hover:bg-accent/50 p-3 rounded-md transition-all font-medium"
                      >
                        {char.name}
                      </SafeLink>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Simple Nav Items */}
            {simpleNavItems.map((item) => (
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
                    <SafeLink to="/" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      View Companions
                    </SafeLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      trackEvent('auth_action', 'header', 'Sign Out');
                      signOut?.();
                    }}
                    data-tracking-label="Sign Out - Header"
                    data-tracking-category="auth"
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
            <div className="flex flex-col space-y-6">
              {/* Locations Collapsible */}
              <Collapsible>
                <CollapsibleTrigger className="luxury-body-base font-medium transition-colors text-muted-foreground hover:text-foreground flex items-center justify-between w-full">
                  <span>Locations</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 ml-4 space-y-3">
                  {locations.map((loc) => (
                    <SafeLink
                      key={loc.id}
                      to={`/${loc.slug}`}
                      className="block luxury-body-sm !text-black hover:!text-black transition-colors font-medium"
                    >
                      {loc.name}
                    </SafeLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Companion Types Collapsible */}
              <Collapsible>
                <CollapsibleTrigger className="luxury-body-base font-medium transition-colors text-muted-foreground hover:text-foreground flex items-center justify-between w-full">
                  <span>Companion Types</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 ml-4 space-y-3">
                  {characteristics.map((char) => (
                    <SafeLink
                      key={char.id}
                      to={`/characteristics/${char.slug}`}
                      className="block luxury-body-sm !text-black hover:!text-black transition-colors font-medium"
                    >
                      {char.name}
                    </SafeLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Simple Nav Items */}
              {simpleNavItems.map((item) => (
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
                    <SafeLink to="/">
                      <Button variant="outline" className="w-full mb-2">
                        <User className="w-4 h-4 mr-2" />
                        View Companions
                      </Button>
                    </SafeLink>
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
