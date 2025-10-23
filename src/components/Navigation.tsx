import React from "react";
import { SafeLink } from "@/components/ui/safe-link";
import { useSafeLocation } from "@/hooks/useSafeRouter";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
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
  { href: "/locations", label: "Locations" },
  { href: "/characteristics", label: "Companion Types" },
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
            className="heading-4 font-medium uppercase transition-smooth hover:text-secondary-content text-primary-content"
          >
            Five London
            <span className="body-xs ml-2 font-normal text-secondary-content">
              EST. 2020
            </span>
          </SafeLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <SafeLink
                key={item.href}
                to={item.href}
                className={`body-sm font-medium transition-smooth ${
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/")
                    ? "text-primary-content"
                    : "text-secondary-content hover:text-primary-content"
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
              className="body-sm transition-smooth text-secondary-content hover:text-primary-content"
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
            className="lg:hidden p-2 transition-smooth text-primary-content hover:text-secondary-content"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-primary-line bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-content">
              {navItems.map((item) => (
                <SafeLink
                  key={item.href}
                  to={item.href}
                  className={`body-base font-medium transition-smooth ${
                    location.pathname === item.href
                      ? "text-primary-content"
                      : "text-secondary-content hover:text-primary-content"
                  }`}
                >
                  {item.label}
                </SafeLink>
              ))}

              <div className="pt-8 border-t border-primary-line flex flex-col gap-element">
                <div className="flex items-center justify-between">
                  <a
                    href="tel:+447436190679"
                    className="block body-sm text-secondary-content hover:text-primary-content transition-smooth"
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
