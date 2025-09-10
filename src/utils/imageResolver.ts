interface ImageResolutionOptions {
  local?: string;
  external?: string;
  placeholder?: string;
}

interface FeatureFlags {
  preferLocalImages: boolean;
}

/**
 * Resolve image URL based on feature flags and fallback strategy
 */
export const resolveImage = (
  options: ImageResolutionOptions, 
  featureFlags?: FeatureFlags
): string => {
  const { local, external, placeholder } = options;
  const preferLocal = featureFlags?.preferLocalImages !== false; // Default to true
  
  // Strategy 1: Prefer local images (default)
  if (preferLocal) {
    if (local && isValidUrl(local)) {
      console.log('🏠 [resolveImage] Using local image:', local);
      return local;
    }
    if (external && isValidUrl(external)) {
      console.log('🌐 [resolveImage] Fallback to external:', external);
      return external;
    }
    if (placeholder && isValidUrl(placeholder)) {
      console.log('📁 [resolveImage] Fallback to placeholder:', placeholder);
      return placeholder;
    }
  }
  
  // Strategy 2: Prefer external images
  else {
    if (external && isValidUrl(external)) {
      console.log('🌐 [resolveImage] Using external image:', external);
      return external;
    }
    if (local && isValidUrl(local)) {
      console.log('🏠 [resolveImage] Fallback to local:', local);
      return local;
    }
    if (placeholder && isValidUrl(placeholder)) {
      console.log('📁 [resolveImage] Fallback to placeholder:', placeholder);
      return placeholder;
    }
  }
  
  // Final fallback
  console.warn('⚠️ [resolveImage] No valid image found, using empty string');
  return '';
};

/**
 * Check if URL is valid and not empty
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    // Allow relative URLs (start with /)
    if (url.startsWith('/')) return true;
    
    // Validate absolute URLs
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get feature flags from localStorage
 */
export const getFeatureFlags = (): FeatureFlags => {
  try {
    const saved = localStorage.getItem('featureFlags');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load feature flags:', error);
  }
  
  return { preferLocalImages: true }; // Default
};

/**
 * Enhanced image component props with fallback handling
 */
export interface EnhancedImageProps {
  local?: string;
  external?: string;
  placeholder?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  'data-model-image'?: string;
  'data-model-name'?: string;
  'data-carousel-image'?: string;
  'data-blog-image'?: string;
  'data-post-title'?: string;
}

/**
 * Create fallback chain for robust image loading
 */
export const createImageFallbackChain = (
  primary: string,
  fallbacks: string[]
): string[] => {
  const chain = [primary, ...fallbacks].filter(url => isValidUrl(url));
  return Array.from(new Set(chain)); // Remove duplicates
};