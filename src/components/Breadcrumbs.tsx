import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      <Link 
        to="/" 
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href && index < items.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="text-foreground font-medium"
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};