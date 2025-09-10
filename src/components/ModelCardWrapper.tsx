import React from 'react';
import { ModelCard } from '@/components/ModelCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Model } from '@/hooks/useModels';

interface ModelCardWrapperProps {
  model: Model;
  index?: number;
}

const ModelCardFallback = ({ error }: { error: Error }) => (
  <div className="bg-card shadow-luxury rounded-lg p-6 text-center">
    <div className="w-12 h-12 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center">
      <span className="text-red-500">⚠️</span>
    </div>
    <p className="text-sm text-muted-foreground">
      Unable to load model card
    </p>
    {process.env.NODE_ENV === 'development' && (
      <details className="mt-2 text-xs text-left">
        <summary className="cursor-pointer">Error details</summary>
        <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
    )}
  </div>
);

export const ModelCardWrapper: React.FC<ModelCardWrapperProps> = ({ model, index }) => {
  // Additional validation before rendering
  if (!model || !model.id || !model.name) {
    console.warn('ModelCardWrapper: Invalid model data:', model);
    return (
      <div className="bg-card shadow-luxury rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-yellow-50 rounded-full flex items-center justify-center">
          <span className="text-yellow-500">⚠️</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Invalid model data
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={(error) => <ModelCardFallback error={error} />}>
      <ModelCard model={model} index={index} />
    </ErrorBoundary>
  );
};