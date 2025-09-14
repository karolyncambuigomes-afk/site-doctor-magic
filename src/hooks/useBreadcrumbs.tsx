import { useMemo } from 'react';
import { useSafeLocation } from './useSafeRouter';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export const useBreadcrumbs = () => {
  const location = useSafeLocation();

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbItems.push({ label: 'Home', href: '/' });

    // Build breadcrumbs based on path segments
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special cases for known routes
      switch (segment) {
        case 'models':
          label = 'Our Models';
          break;
        case 'locations':
          label = 'Locations';
          break;
        case 'blog':
          label = 'Blog';
          break;
        case 'about':
          label = 'About Us';
          break;
        case 'contact':
          label = 'Contact';
          break;
        case 'services':
          label = 'Services';
          break;
        case 'characteristics':
          label = 'Characteristics';
          break;
        case 'members':
          label = 'Members';
          break;
        case 'membership':
          label = 'Membership';
          break;
        case 'join-us':
          label = 'Join Us';
          break;
        case 'privacy-policy':
          label = 'Privacy Policy';
          break;
        case 'terms':
          label = 'Terms of Service';
          break;
        case 'faq':
          label = 'FAQ';
          break;
        case 'london-escort-guide':
          label = 'London Escort Guide';
          break;
      }

      // For the last segment (current page), don't include href
      if (index === pathSegments.length - 1) {
        breadcrumbItems.push({ label, href: '' });
      } else {
        breadcrumbItems.push({ label, href: currentPath });
      }
    });

    return breadcrumbItems;
  }, [location.pathname]);

  return breadcrumbs;
};