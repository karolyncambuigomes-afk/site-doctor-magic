import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id'
    ],
    ALLOW_DATA_ATTR: false,
    ADD_TAGS: [],
    ADD_ATTR: [],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'style']
  });
};

/**
 * Sanitizes text content by removing all HTML tags
 * @param text - The text to sanitize
 * @returns Plain text without HTML
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Validates and sanitizes URL input
 * @param url - The URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove any potential javascript: or data: protocols
    const cleanUrl = url.replace(/^(?:javascript|data|vbscript):/i, '');
    
    // If it starts with protocol, validate it
    if (cleanUrl.includes('://')) {
      const urlObj = new URL(cleanUrl);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol) ? cleanUrl : '';
    }
    
    // If it's a relative URL, allow it
    return cleanUrl.startsWith('/') || cleanUrl.startsWith('#') ? cleanUrl : `https://${cleanUrl}`;
  } catch {
    return '';
  }
};