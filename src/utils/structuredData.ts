// SEO Structured Data Utils
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Five London",
  "description": "Premium luxury escort services in London offering sophisticated companionship for discerning clients.",
  "url": "https://fivelondon.com",
  "logo": "https://fivelondon.com/logo.png",
  "image": "https://fivelondon.com/og-image.jpg",
  "telephone": "+447436190679",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB",
    "addressLocality": "London",
    "addressRegion": "England",
    "postalCode": "W1K 6DJ"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "51.5074",
    "longitude": "-0.1278"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "London",
      "addressCountry": "GB"
    },
    {
      "@type": "AdministrativeArea", 
      "name": "Greater London",
      "addressCountry": "GB"
    }
  ],
  "serviceType": "Luxury Companion Services",
  "priceRange": "£500-£1000",
  "sameAs": [],
  "hasMap": "https://www.google.com/maps/place/London,+UK",
  "openingHours": "Mo-Su 00:00-23:59"
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Five London",
  "description": "Premium luxury escort services in London",
  "url": "https://fivelondon.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://fivelondon.com/models?search={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Five London"
  }
});

export const generateServiceSchema = (serviceName: string, description: string, price?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "Five London",
    "telephone": "+447436190679",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressLocality": "London"
    }
  },
  "areaServed": {
    "@type": "City",
    "name": "London",
    "addressCountry": "GB"
  },
  "serviceType": "Luxury Companion Services",
  ...(price && { "offers": {
    "@type": "Offer",
    "priceCurrency": "GBP",
    "price": price
  }})
});

export const generatePersonSchema = (model: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": model.name,
  "image": model.image,
  "description": model.description,
  "jobTitle": "Professional Companion",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": model.location,
    "addressCountry": "GB"
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Five London"
  }
});

export const generateLocationSchema = (location: any) => ({
  "@context": "https://schema.org",
  "@type": "Place",
  "name": location.name,
  "description": location.description,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": location.name,
    "addressCountry": "GB"
  },
  "geo": location.coordinates && {
    "@type": "GeoCoordinates",
    "latitude": location.coordinates.lat,
    "longitude": location.coordinates.lng
  }
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generateBlogSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.image,
  "datePublished": article.published_at,
  "dateModified": article.updated_at,
  "author": {
    "@type": "Person",
    "name": article.author || "Five London Editorial Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Five London",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fivelondon.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://fivelondon.com/blog/${article.slug}`
  }
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});