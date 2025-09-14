import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load the fabric-heavy ImageEditor
const ImageEditor = lazy(() => import('@/components/ImageEditor').then(module => ({
  default: module.ImageEditor
})));

interface LazyImageEditorProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedImageBlob: Blob) => void;
  aspectRatio?: number;
}

export const LazyImageEditor: React.FC<LazyImageEditorProps> = (props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm text-muted-foreground">Carregando editor de imagem...</p>
        </div>
      </div>
    }>
      <ImageEditor {...props} />
    </Suspense>
  );
};