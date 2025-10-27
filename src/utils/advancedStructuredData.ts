import { ReviewAggregateData } from '@/hooks/useReviews';

// Advanced Review Schema Generator
export const generateReviewAggregateSchema = (
  reviewData: ReviewAggregateData,
  businessName: string = "Five London",
  locationArea?: string
) => {
  if (!reviewData.reviews.length) return null;

  const reviews = reviewData.reviews.slice(0, 10).map(review => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Person",
      "name": review.author_initial
    },
    "datePublished": review.created_at.split('T')[0],
    "reviewBody": review.review_text,
    "publisher": {
      "@type": "Organization",
      "name": "Five London"
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${businessName}${locationArea ? ` - ${locationArea}` : ''} Premium Companion Services`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviewData.averageRating,
      "reviewCount": reviewData.totalReviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": reviews,
    "provider": {
      "@type": "Organization",
      "name": "Five London",
      "url": "https://fivelondon.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressCountry": "GB"
      }
    }
  };
};

// Enhanced LocalBusiness Schema by Postcode
export const generateLocalBusinessByPostcode = (
  postcode: string,
  areaName: string,
  reviewData?: ReviewAggregateData,
  coordinates?: { lat: number; lng: number }
) => {
  const getCoordinatesForPostcode = (code: string) => {
    const coords = {
      'W1': { lat: 51.5174, lng: -0.1478 }, // Mayfair
      'SW1': { lat: 51.4994, lng: -0.1376 }, // Knightsbridge
      'SW3': { lat: 51.4827, lng: -0.1707 }, // Chelsea
      'SW1X': { lat: 51.4956, lng: -0.1537 }, // Belgravia
      'SW7': { lat: 51.4946, lng: -0.1774 }, // Kensington
      'SW1A': { lat: 51.5014, lng: -0.1419 }, // Westminster
      'W1U': { lat: 51.5204, lng: -0.1496 }, // Marylebone
      'W1T': { lat: 51.5218, lng: -0.1368 }, // Fitzrovia
    };
    return coords[code as keyof typeof coords] || { lat: 51.5074, lng: -0.1278 };
  };

  const coords = coordinates || getCoordinatesForPostcode(postcode);

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Five London - ${areaName}`,
    "description": `Premium luxury companion services in ${areaName}, London ${postcode}. Sophisticated, elite companions for high-end social events, business functions, and cultural experiences.`,
    "url": `https://fivelondon.com/locations/${areaName.toLowerCase().replace(/\s+/g, '-')}`,
    "telephone": "+44 20 7946 0000",
    "email": "info@fivelondon.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${areaName}`,
      "addressLocality": "London",
      "postalCode": postcode,
      "addressRegion": "Greater London",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": coords.lat,
      "longitude": coords.lng
    },
    "areaServed": [
      {
        "@type": "PostalCodeSpecification",
        "postalCode": postcode,
        "addressCountry": "GB"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": coords.lat,
        "longitude": coords.lng
      },
      "geoRadius": "5000"
    },
    "priceRange": "£££",
    "currenciesAccepted": "GBP",
    "paymentAccepted": "Credit Card, Bank Transfer",
    "openingHours": [
      "Mo-Su 00:00-23:59"
    ],
    "availableLanguage": ["en", "fr", "es", "it", "de"],
    "category": "Companion Services",
    "knowsAbout": [
      "Luxury hospitality",
      "Fine dining",
      "Cultural events",
      "Business entertainment",
      "Social companionship"
    ]
  };

  // Add review data if available
  if (reviewData && reviewData.totalReviews > 0) {
    return {
      ...baseSchema,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviewData.averageRating,
        "reviewCount": reviewData.totalReviews,
        "bestRating": 5,
        "worstRating": 1
      }
    };
  }

  return baseSchema;
};

// Enhanced Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{label: string, href: string}>) => {
  const siteUrl = "https://fivelondon.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.label,
      "item": breadcrumb.href ? `${siteUrl}${breadcrumb.href}` : undefined
    }))
  };
};

// Service Schema with Pricing
export const generateServiceWithPricingSchema = (
  serviceName: string,
  description: string,
  areaName?: string,
  priceRange?: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${serviceName}${areaName ? ` in ${areaName}` : ''}`,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Five London",
      "url": "https://fivelondon.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "addressCountry": "GB"
      }
    },
    "serviceType": "Companion Services",
    "category": "Luxury Hospitality",
    "areaServed": areaName ? {
      "@type": "City",
      "name": `${areaName}, London`
    } : {
      "@type": "City", 
      "name": "London"
    },
    "offers": {
      "@type": "Offer",
      "priceRange": priceRange || "£££",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "availabilityStarts": new Date().toISOString().split('T')[0],
      "validFrom": new Date().toISOString().split('T')[0]
    },
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };
};

// Event Schema for Service Availability
export const generateServiceAvailabilityEventSchema = (areaName: string, postcode: string) => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `Premium Companion Services Available - ${areaName}`,
    "description": `Elite companion services now available in ${areaName}, London ${postcode}. Professional, sophisticated companions for business events, cultural functions, and social occasions.`,
    "startDate": today.toISOString().split('T')[0],
    "endDate": nextMonth.toISOString().split('T')[0],
    "location": {
      "@type": "Place",
      "name": areaName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "London",
        "postalCode": postcode,
        "addressCountry": "GB"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "Five London",
      "url": "https://fivelondon.com"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": "https://fivelondon.com/contact"
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };
};

// Enhanced FAQ Schema with Location Context
export const generateLocationAwareFAQSchema = (
  faqs: Array<{question: string, answer: string}>,
  locationContext?: string
) => {
  // Add location-specific FAQs if location context is provided
  const locationFAQs = locationContext ? [
    {
      question: `Do you provide companion services in ${locationContext}?`,
      answer: `Yes, we provide premium companion services throughout ${locationContext} and surrounding areas. Our sophisticated companions are well-versed in the local culture and venues.`
    },
    {
      question: `What areas of ${locationContext} do you cover?`,
      answer: `We provide comprehensive coverage throughout ${locationContext}, including all major hotels, restaurants, cultural venues, and business districts in the area.`
    },
    {
      question: `How do I book a companion in ${locationContext}?`,
      answer: `Booking a companion in ${locationContext} is simple. Contact us via phone, WhatsApp, or email with your requirements, and we'll arrange the perfect companion for your needs.`
    }
  ] : [];

  const allFAQs = [...faqs, ...locationFAQs];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Contact Point Schema
export const generateContactPointSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "telephone": "+44 20 7946 0000",
    "contactType": "customer service",
    "email": "info@fivelondon.com",
    "availableLanguage": ["en", "fr", "es", "it", "de"],
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  };
};