// Advanced image optimization utilities

export interface ImageSizes {
  thumbnail: { width: 200, height: 300 };
  small: { width: 400, height: 600 };
  medium: { width: 800, height: 1200 };
  large: { width: 1200, height: 1800 };
  original: { width?: number, height?: number };
}

export const IMAGE_SIZES: ImageSizes = {
  thumbnail: { width: 200, height: 300 },
  small: { width: 400, height: 600 },
  medium: { width: 800, height: 1200 },
  large: { width: 1200, height: 1800 },
  original: { width: undefined, height: undefined }
};

export type ImageSize = keyof ImageSizes;

/**
 * Generate optimized Supabase image URL with transformations
 */
export const getOptimizedImageUrl = (
  url: string,
  size: ImageSize = 'medium',
  format: 'webp' | 'jpeg' | 'png' = 'webp',
  quality: number = 80
): string => {
  if (!url || !url.includes('supabase')) {
    return url;
  }

  try {
    // For Supabase images, use their built-in transformation API
    const transformParams = new URLSearchParams();
    
    // Add size parameters
    const dimensions = IMAGE_SIZES[size];
    if (dimensions.width && dimensions.height) {
      transformParams.set('width', dimensions.width.toString());
      transformParams.set('height', dimensions.height.toString());
      transformParams.set('resize', 'cover');
    }
    
    // Add format and quality
    if (format !== 'png') {
      transformParams.set('format', format);
    }
    transformParams.set('quality', quality.toString());
    
    // Append transform parameters to URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${transformParams.toString()}`;
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return url;
  }
};

/**
 * Generate responsive image sources for different screen sizes
 */
export const generateResponsiveSources = (url: string): string => {
  if (!url) return '';
  
  const webpSources = [
    `${getOptimizedImageUrl(url, 'thumbnail', 'webp')} 200w`,
    `${getOptimizedImageUrl(url, 'small', 'webp')} 400w`,
    `${getOptimizedImageUrl(url, 'medium', 'webp')} 800w`,
    `${getOptimizedImageUrl(url, 'large', 'webp')} 1200w`
  ].join(', ');
  
  return webpSources;
};

/**
 * Generate fallback JPEG sources
 */
export const generateFallbackSources = (url: string): string => {
  if (!url) return '';
  
  const jpegSources = [
    `${getOptimizedImageUrl(url, 'thumbnail', 'jpeg')} 200w`,
    `${getOptimizedImageUrl(url, 'small', 'jpeg')} 400w`,
    `${getOptimizedImageUrl(url, 'medium', 'jpeg')} 800w`,
    `${getOptimizedImageUrl(url, 'large', 'jpeg')} 1200w`
  ].join(', ');
  
  return jpegSources;
};

/**
 * Detect optimal image size based on container dimensions
 */
export const getOptimalSize = (
  containerWidth: number,
  containerHeight: number = 0
): ImageSize => {
  const pixelRatio = window.devicePixelRatio || 1;
  const actualWidth = containerWidth * pixelRatio;
  
  if (actualWidth <= 200) return 'thumbnail';
  if (actualWidth <= 400) return 'small';
  if (actualWidth <= 800) return 'medium';
  if (actualWidth <= 1200) return 'large';
  return 'original';
};

/**
 * Compress and resize image file before upload
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1800,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate WebP version of an image
 */
export const convertToWebP = (file: File, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert to WebP'));
          }
        },
        'image/webp',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};