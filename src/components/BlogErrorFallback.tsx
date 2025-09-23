import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface BlogErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export const BlogErrorFallback = ({ error, onRetry }: BlogErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 text-foreground">
          Unable to Load Articles
        </h2>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          We're having trouble loading the blog articles right now. 
          Please check your connection and try again.
        </p>
        
        {error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              Error Details
            </summary>
            <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground break-all">
              {error}
            </div>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onRetry || (() => window.location.reload())}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};