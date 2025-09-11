import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('🚨 ErrorBoundary caught error:', error);
    console.error('🚨 Error stack:', error.stack);
    console.error('🚨 Error name:', error.name);
    console.error('🚨 Error message:', error.message);
    return { 
      hasError: true, 
      error: error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ErrorBoundary componentDidCatch details:', error, errorInfo);
    console.error('🚨 Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error);
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Please reload the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-left">
                <details>
                  <summary className="cursor-pointer font-medium text-red-800">Error Details (Development)</summary>
                  <div className="mt-2 text-sm text-red-700">
                    <p><strong>Message:</strong> {this.state.error.message}</p>
                    <p><strong>Name:</strong> {this.state.error.name}</p>
                    {this.state.error.stack && (
                      <pre className="mt-2 text-xs overflow-auto max-h-40 bg-red-100 p-2 rounded">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              </div>
            )}
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