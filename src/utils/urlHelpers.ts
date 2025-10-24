/**
 * URL Helper Functions
 * Ensures consistent URL generation across the application
 */

import { BUSINESS_INFO } from '@/constants/businessInfo';

/**
 * Generate canonical URL for a page
 */
export const getCanonicalUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BUSINESS_INFO.domain}${cleanPath}`;
};

/**
 * Generate location page URL
 */
export const getLocationUrl = (locationSlug: string): string => {
  // Ensure the slug has the escorts-in- prefix
  const slug = locationSlug.startsWith('escorts-in-') 
    ? locationSlug 
    : `escorts-in-${locationSlug}`;
  return getCanonicalUrl(`/locations/${slug}`);
};

/**
 * Generate location slug from area name
 */
export const getLocationSlug = (areaName: string): string => {
  const baseSlug = areaName.toLowerCase().replace(/\s+/g, '-');
  return `escorts-in-${baseSlug}`;
};

/**
 * Generate blog post URL
 */
export const getBlogPostUrl = (slug: string): string => {
  return getCanonicalUrl(`/blog/${slug}`);
};

/**
 * Generate model profile URL
 */
export const getModelProfileUrl = (slug: string): string => {
  return getCanonicalUrl(`/models/${slug}`);
};

/**
 * Get absolute URL for an asset
 */
export const getAssetUrl = (assetPath: string): string => {
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${BUSINESS_INFO.domain}${cleanPath}`;
};

/**
 * Get Google Maps URL for coordinates
 */
export const getGoogleMapsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
