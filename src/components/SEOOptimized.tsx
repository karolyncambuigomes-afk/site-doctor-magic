import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizedProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
  noIndex?: boolean;
  additionalMeta?: Record<string, string>;
  children?: React.ReactNode;
}

export const SEOOptimized: React.FC<SEOOptimizedProps> = ({
  title = "Five London - Elite Escort Agency | Premium Companionship Services",
  description = "Five London offers exclusive escort services with sophisticated companions for discerning clients. Professional, discreet, and elegant experiences in London's finest locations.",
  keywords = "elite escort london, premium companionship, luxury escort services, london escort agency, high-class escorts",
  canonicalUrl,
  ogImage = "/og-image.jpg",
  structuredData,
  noIndex = false,
  additionalMeta,
  children
}) => {
  const fullTitle = title.includes('Five London') ? title : `${title} | Five London`;
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullCanonicalUrl = canonicalUrl ? `https://fivelondon.com${canonicalUrl}` : undefined;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="title" content={fullTitle} />
        <meta name="description" content={optimizedDescription} />
        <meta name="keywords" content={keywords} />
        {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
        <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={optimizedDescription} />
        <meta property="og:image" content={ogImage} />
        {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
        <meta property="og:site_name" content="Five London" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={optimizedDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Additional SEO */}
        <meta name="author" content="Five London" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="content-language" content="en-GB" />
        <meta name="geo.region" content="GB-LND" />
        <meta name="geo.placename" content="London" />
        
        {/* Performance & Caching */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Additional custom meta tags */}
        {additionalMeta && Object.entries(additionalMeta).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}

        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>
      {children && children}
    </>
  );
};