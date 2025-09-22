import React from 'react';

interface SimpleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface SimpleErrorBoundaryProps {
  children: React.ReactNode;
  context?: string;
}

export class SimpleErrorBoundary extends React.Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SimpleErrorBoundaryState {
    console.error('SimpleErrorBoundary caught error:', error);
    return { 
      hasError: true, 
      error: error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`SimpleErrorBoundary in ${this.props.context || 'unknown'} caught:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">Erro na aplicação</h2>
            <p className="text-muted-foreground mb-6">
              {this.props.context && `Erro em: ${this.props.context}`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Recarregar Página
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left max-w-md mx-auto">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Detalhes do Erro
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}