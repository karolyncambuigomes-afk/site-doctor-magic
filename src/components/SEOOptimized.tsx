import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BUSINESS_INFO } from '@/constants/businessInfo';
import { getCanonicalUrl, getAssetUrl } from '@/utils/urlHelpers';

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
  title = `${BUSINESS_INFO.name} - Elite Escort Agency | Premium Companionship Services`,
  description = BUSINESS_INFO.description,
  keywords = "elite escort london, premium companionship, luxury escort services, london escort agency, high-class escorts",
  canonicalUrl,
  ogImage = BUSINESS_INFO.ogImage,
  structuredData,
  noIndex = false,
  additionalMeta,
  children
}) => {
  const fullTitle = title.includes(BUSINESS_INFO.name) ? title : `${title} | ${BUSINESS_INFO.name}`;
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullCanonicalUrl = canonicalUrl ? getCanonicalUrl(canonicalUrl) : undefined;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : getAssetUrl(ogImage);

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
        <meta property="og:image" content={absoluteOgImage} />
        {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
        <meta property="og:site_name" content={BUSINESS_INFO.name} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={optimizedDescription} />
        <meta name="twitter:image" content={absoluteOgImage} />

        {/* Additional SEO */}
        <meta name="author" content={BUSINESS_INFO.name} />
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