/**
 * Centralized Business Information
 * Single source of truth for all company details used across the application
 */

export const BUSINESS_INFO = {
  // Company Details
  name: "Five London",
  legalName: "Five London Ltd",
  
  // Contact Information
  phone: "+44 7436 190679",
  phoneFormatted: "+44 7436 190679",
  phoneLink: "tel:+447436190679",
  email: "models@exclusivefivelondon.com",
  whatsapp: "https://wa.me/447436190679",
  whatsappFormatted: "+44 7436 190679",
  telegram: "https://t.me/FiveLondon",
  
  // URLs
  domain: "https://fivelondon.com",
  logo: "https://fivelondon.com/logo.png", // TODO: Upload logo.png to /public/
  ogImage: "https://fivelondon.com/og-image.jpg",
  
  // Address
  address: {
    locality: "London",
    region: "England",
    country: "GB",
    countryName: "United Kingdom",
    postalCode: "W1K 6DJ"
  },
  
  // Coordinates (Central London)
  coordinates: {
    lat: 51.5074,
    lng: -0.1278
  },
  
  // Business Information
  priceRange: "£500-£1000",
  priceRangeSymbol: "£££",
  currency: "GBP",
  openingHours: "Mo-Su 00:00-23:59",
  openingHoursDetailed: [
    "Mo 00:00-23:59",
    "Tu 00:00-23:59",
    "We 00:00-23:59",
    "Th 00:00-23:59",
    "Fr 00:00-23:59",
    "Sa 00:00-23:59",
    "Su 00:00-23:59"
  ],
  
  // Service Details
  serviceType: "Luxury Companion Services",
  description: "Premium luxury escort services in London offering sophisticated companionship for discerning clients.",
  paymentMethods: ["Cash", "Bank Transfer", "Credit Card"],
  languages: ["en", "fr", "es", "it", "de"],
  
  // Social Media (add when available)
  socialMedia: {
    twitter: undefined,
    instagram: undefined,
    facebook: undefined
  }
} as const;
