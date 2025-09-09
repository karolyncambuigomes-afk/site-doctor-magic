import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary caught error:', error);
    return { 
      hasError: true, 
      errorMessage: error.message 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-smooth"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}