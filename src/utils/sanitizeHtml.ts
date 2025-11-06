import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Only allows safe tags for model descriptions with internal links
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Configure DOMPurify to only allow safe tags
  const config = {
    ALLOWED_TAGS: ['p', 'a', 'strong', 'em', 'br', 'b', 'i'],
    ALLOWED_ATTR: ['href', 'class'],
    ALLOW_DATA_ATTR: false,
    // Only allow internal links (starting with /)
    ALLOWED_URI_REGEXP: /^(?:\/|#)/,
  };
  
  return DOMPurify.sanitize(html, config);
};
