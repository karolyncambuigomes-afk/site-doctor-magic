import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasChunkError: boolean;
}

export class ChunkErrorCatcher extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State | null {
    // Check if this is a chunk loading error
    if (error.message.includes('Loading chunk') || 
        error.message.includes('ChunkLoadError') ||
        error.message.includes('Loading CSS chunk')) {
      return { hasChunkError: true };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (this.state.hasChunkError) {
      console.warn('Chunk loading error detected, will auto-refresh:', error);
      // Auto-refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    if (this.state.hasChunkError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">Updating application...</h2>
            <p className="text-muted-foreground">Please wait while we load the latest version.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}