import { generateOrganizationSchema, generateLocationSchema, generateServiceSchema } from '@/utils/structuredData';

export const generateLocalBusinessSchema = (location: any) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `Five London - ${location.name}`,
  "description": `Premium escort services in ${location.name}, London. ${location.description}`,
  "url": `https://fivelondon.com/locations/${location.slug}`,
  "telephone": "+447436190679",
  "priceRange": "£500-£1000",
  "image": "https://fivelondon.com/og-image.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": location.name,
    "addressLocality": "London",
    "addressRegion": "England",
    "postalCode": location.postcodes?.[0] || "",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": location.coordinates?.lat,
    "longitude": location.coordinates?.lng
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "London",
      "addressCountry": "GB"
    },
    ...location.postcodes?.map((postcode: string) => ({
      "@type": "PostalAddress",
      "postalCode": postcode,
      "addressCountry": "GB"
    })) || []
  ],
  "serviceType": "Luxury Companion Services",
  "hasMap": `https://www.google.com/maps?q=${location.coordinates?.lat},${location.coordinates?.lng}`,
  "knowsAbout": location.nearbyLandmarks || [],
  "openingHours": "Mo-Su 00:00-23:59",
  "paymentAccepted": "Cash, Bank Transfer",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "James M."
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": `Exceptional service in ${location.name}. Professional, discreet, and exactly as described.`
    }
  ]
});

export const generateGeoTargetingSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Five London",
  "alternateName": ["Five London Escorts", "Elite Companions London"],
  "url": "https://fivelondon.com",
  "areaServed": [
    {
      "@type": "AdministrativeArea",
      "name": "Greater London",
      "addressCountry": "GB",
      "containedInPlace": {
        "@type": "Country",
        "name": "United Kingdom"
      }
    },
    {
      "@type": "City",
      "name": "London",
      "addressCountry": "GB"
    }
  ],
  "serviceArea": [
    { "@type": "PostalAddress", "postalCode": "W1", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "SW1", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "SW3", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "SW7", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "SW10", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "WC2", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "E1", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "E2", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "NW1", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "NW8", "addressCountry": "GB" },
    { "@type": "PostalAddress", "postalCode": "E14", "addressCountry": "GB" }
  ]
});