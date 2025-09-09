// Enhanced Organization Schema with Multiple Locations
export const generateOrganizationSchema = (includeLocations: boolean = true) => {
  const baseSchema = {
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
  };

  if (includeLocations) {
    return {
      ...baseSchema,
      "location": [
        {
          "@type": "Place",
          "name": "Mayfair",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "London",
            "postalCode": "W1",
            "addressCountry": "GB"
          }
        },
        {
          "@type": "Place", 
          "name": "Knightsbridge",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "London",
            "postalCode": "SW1",
            "addressCountry": "GB"
          }
        }
      ]
    };
  }

  return baseSchema;
};

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
  "datePublished": article.published_at || article.publishedAt,
  "dateModified": article.updated_at || article.publishedAt,
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
  },
  // Enhanced GEO data for location-based articles
  ...(article.coordinates && {
    "spatialCoverage": {
      "@type": "Place",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": article.coordinates.lat,
        "longitude": article.coordinates.lng
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": article.locationArea?.split(' ')[0] || "London",
        "postalCode": article.locationArea?.split(' ')[1] || "",
        "addressCountry": "GB"
      }
    }
  }),
  ...(article.serviceAreas && {
    "areaServed": article.serviceAreas.map((area: string) => ({
      "@type": "PostalCodeSpecification",
      "postalCode": area,
      "addressCountry": "GB"
    }))
  })
});

// Enhanced LocalBusiness schema for specific areas
export const generateLocalBusinessSchemaForArea = (area: any) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `Five London - ${area.name}`,
  "description": `Premium luxury escort services in ${area.name}, offering sophisticated companionship for discerning clients in the ${area.postcode} area.`,
  "url": "https://fivelondon.com",
  "telephone": "+447436190679",
  "priceRange": "£500-£1000",
  "currenciesAccepted": "GBP",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": area.name,
    "addressLocality": "London",
    "postalCode": area.postcode,
    "addressRegion": "England",
    "addressCountry": "GB"
  },
  "geo": area.coordinates && {
    "@type": "GeoCoordinates",
    "latitude": area.coordinates.lat,
    "longitude": area.coordinates.lng
  },
  "areaServed": {
    "@type": "City",
    "name": "London",
    "addressCountry": "GB"
  },
  "serviceType": "Luxury Companion Services",
  "hasMap": `https://www.google.com/maps/place/${area.coordinates?.lat},${area.coordinates?.lng}`,
  "openingHours": [
    "Mo 00:00-23:59",
    "Tu 00:00-23:59", 
    "We 00:00-23:59",
    "Th 00:00-23:59",
    "Fr 00:00-23:59",
    "Sa 00:00-23:59",
    "Su 00:00-23:59"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
});

// Event schema for availability and services
export const generateEventSchema = (eventData: any) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": eventData.name || "Luxury Companion Services Available",
  "description": eventData.description || "Premium escort services available 24/7 in London",
  "startDate": eventData.startDate || new Date().toISOString(),
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "London",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "London",
      "addressCountry": "GB"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Five London",
    "url": "https://fivelondon.com"
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