import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SafeLink } from '@/components/ui/safe-link';
import {
  BarChart3,
  Search,
  FileText,
  Users,
  Settings,
  Home,
  BookOpen,
  HelpCircle,
  Image,
  MapPin,
  Star,
  UserCheck,
  Globe,
  Target,
  Zap,
  Palette,
  Database,
  Shield,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "SEO Management",
    items: [
      { title: "Global SEO", url: "/admin/seo/global", icon: Globe },
      { title: "Meta Tags", url: "/admin/seo/meta-tags", icon: Target },
      { title: "Structured Data", url: "/admin/seo/structured-data", icon: Database },
      { title: "Technical SEO", url: "/admin/seo/technical", icon: Zap },
      { title: "Performance", url: "/admin/seo/performance", icon: BarChart3 },
    ],
  },
  {
    title: "Content Management",
    items: [
      { title: "Homepage", url: "/admin/content/homepage", icon: Home },
      { title: "Blog Posts", url: "/admin/content/blog", icon: BookOpen },
      { title: "Site Content", url: "/admin/content/site", icon: FileText },
      { title: "FAQ", url: "/admin/content/faq", icon: HelpCircle },
      { title: "Gallery", url: "/admin/content/gallery", icon: Image },
      { title: "Image Diagnostics", url: "/admin/content/image-diagnostics", icon: Search },
      { title: "Image Audit Report", url: "/admin/content/image-audit-report", icon: BarChart3 },
      { title: "Bulk Migration", url: "/admin/content/bulk-migration", icon: Image },
    ],
  },
  {
    title: "Models & Services",
    items: [
      { title: "Models", url: "/admin/models/list", icon: Users },
      { title: "Applications", url: "/admin/models/applications", icon: UserCheck },
      { title: "Characteristics", url: "/admin/models/characteristics", icon: Star },
      { title: "Services", url: "/admin/models/services", icon: Settings },
      { title: "Reviews", url: "/admin/models/reviews", icon: Star },
    ],
  },
  {
    title: "Locations & Geo",
    items: [
      { title: "Locations", url: "/admin/locations/list", icon: MapPin },
      { title: "Local SEO", url: "/admin/locations/seo", icon: Search },
    ],
  },
  {
    title: "User Management",
    items: [
      { title: "Users", url: "/admin/users/list", icon: Users },
      { title: "Permissions", url: "/admin/users/permissions", icon: Shield },
      { title: "Security Status", url: "/admin/users/security", icon: Shield },
    ],
  },
  {
    title: "System Settings",
    items: [
      { title: "Theme", url: "/admin/settings/theme", icon: Palette },
      { title: "Categories", url: "/admin/settings/categories", icon: Database },
      { title: "Legal Pages", url: "/admin/settings/legal", icon: FileText },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Admin Panel
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="pt-4">
        {menuItems.map((section, index) => (
          <SidebarGroup key={section.title}>
            {section.url ? (
              // Single item (Dashboard)
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to={section.url} className={getNavCls}>
                      <section.icon className="h-4 w-4" />
                      {!collapsed && <span>{section.title}</span>}
                      {section.badge && !collapsed && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          {section.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              // Group with sub-items
              <>
                <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items?.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <SafeLink 
                  to="/" 
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {!collapsed && <span>View Site</span>}
                </SafeLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <div className="border-t border-border/50 pt-2">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive-foreground transition-colors font-medium"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};