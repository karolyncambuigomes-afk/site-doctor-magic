import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { ReactNode, HTMLAttributes } from 'react';

interface SafeLinkProps extends Omit<LinkProps, 'to'> {
  to: string | undefined | null;
  children: ReactNode;
  fallback?: ReactNode;
}

export const SafeLink = ({ to, children, fallback, className, ...props }: SafeLinkProps) => {
  // If 'to' is invalid, render fallback or just the children without link functionality
  if (!to || to === 'undefined' || to === 'null') {
    console.warn('SafeLink: Invalid "to" prop received:', to);
    if (fallback) return <>{fallback}</>;
    return (
      <div className={className} style={props.style}>
        {children}
      </div>
    );
  }

  // Ensure the 'to' prop is a valid string
  const safeTo = String(to);
  
  // Basic validation for the path
  if (!safeTo.startsWith('/') && !safeTo.startsWith('http')) {
    console.warn('SafeLink: Invalid path format:', safeTo);
    if (fallback) return <>{fallback}</>;
    return (
      <div className={className} style={props.style}>
        {children}
      </div>
    );
  }

  try {
    return <RouterLink to={safeTo} className={className} {...props}>{children}</RouterLink>;
  } catch (error) {
    console.error('SafeLink: Error rendering link:', error);
    if (fallback) return <>{fallback}</>;
    return (
      <div className={className} style={props.style}>
        {children}
      </div>
    );
  }
};