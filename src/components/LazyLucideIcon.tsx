import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Fallback while loading
const IconFallback = ({ size = 24 }: { size?: number | string }) => (
  <div 
    className="animate-pulse bg-muted rounded" 
    style={{ width: typeof size === 'number' ? size : parseInt(size), height: typeof size === 'number' ? size : parseInt(size) }} 
  />
);

interface LazyLucideIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
}

export const LazyLucideIcon: React.FC<LazyLucideIconProps> = ({ 
  name, 
  size = 24, 
  ...props 
}) => {
  const LucideIcon = lazy(dynamicIconImports[name]);
  const iconSize = typeof size === 'number' ? size : parseInt(size);

  return (
    <Suspense fallback={<IconFallback size={iconSize} />}>
      <LucideIcon size={iconSize} {...props} />
    </Suspense>
  );
};

// Critical icons that should be loaded immediately (homepage)
export { 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';