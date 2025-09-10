import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { useImagePreference } from '@/hooks/useImagePreference';

interface ImageWithPreferenceProps {
  local?: string;
  external?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Smart image component that automatically handles local vs external preference
 * and provides visual feedback about which source is being used
 */
export const ImageWithPreference: React.FC<ImageWithPreferenceProps> = ({
  local,
  external,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
  placeholder,
  onLoad,
  onError
}) => {
  const { preferLocalImages } = useImagePreference();

  return (
    <div className="relative">
      <OptimizedImage
        src={external}
        localSrc={local}
        alt={alt}
        className={className}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        onLoad={onLoad}
        onError={onError}
      />
      
      {/* Debug indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-1 left-1 z-50">
          <div className={`text-xs px-1 py-0.5 rounded text-white font-mono ${
            preferLocalImages ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
            {preferLocalImages ? 'L' : 'E'}
          </div>
        </div>
      )}
    </div>
  );
};