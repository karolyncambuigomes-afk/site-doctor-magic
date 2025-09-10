import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
  context?: string;
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="min-h-[400px] flex items-center justify-center bg-background">
    <div className="text-center p-8 max-w-md">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-red-500 text-2xl">⚠️</span>
      </div>
      <h3 className="luxury-heading-lg mb-3 text-foreground">Something went wrong</h3>
      <p className="luxury-body-md text-muted-foreground mb-6">
        Please refresh the page or try again later.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Refresh Page
      </button>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-muted-foreground">Error Details</summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  fallback: FallbackComponent = DefaultErrorFallback,
  context 
}) => {
  return (
    <ErrorBoundary fallback={(error) => <FallbackComponent error={error} />}>
      {children}
    </ErrorBoundary>
  );
};