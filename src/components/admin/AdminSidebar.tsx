import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
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
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
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
    </Sidebar>
  );
};