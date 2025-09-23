// Optimized SEO utilities
export const generateCriticalMeta = (title: string, description: string) => ({
  title: title.length > 60 ? title.substring(0, 57) + '...' : title,
  description: description.length > 160 ? description.substring(0, 157) + '...' : description,
});

export const preloadCriticalAssets = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
  }
};