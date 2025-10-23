import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ 
  html, 
  className = '',
  allowedTags = ['p', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br', 'span', 'div'],
  allowedAttributes = ['href', 'title', 'target', 'rel', 'class']
}) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    // Prevent XSS through javascript: protocol
    FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input']
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
