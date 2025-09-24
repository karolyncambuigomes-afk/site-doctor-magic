<<<<<<< HEAD

import heroMain from '@/assets/hero-main.webp';
import blogRestaurantDining from '@/assets/blog-restaurant-dining.webp';
import blogLondonEvents from '@/assets/blog-london-events.webp';
import blogExclusiveExperiences from '@/assets/blog-exclusive-experiences.webp';
import blogLuxuryHotels from '@/assets/blog-luxury-hotels.webp';
import blogEntertainmentCulture from '@/assets/blog-entertainment-culture.webp';
import kate1 from '@/assets/kate1.webp';
import luisa1 from '@/assets/luisa1.webp';

const imageMap: Record<string, string> = {
  // Hero images
  '/src/assets/hero-main.webp': heroMain,
  '/images/hero-main.webp': heroMain,
  
  // Blog images - WebP
  '/src/assets/blog-restaurant-dining.webp': blogRestaurantDining,
  '/src/assets/blog-london-events.webp': blogLondonEvents,
  '/src/assets/blog-exclusive-experiences.webp': blogExclusiveExperiences,
  '/src/assets/blog-luxury-hotels.webp': blogLuxuryHotels,
  '/src/assets/blog-entertainment-culture.webp': blogEntertainmentCulture,
  
  // Blog images - Legacy .jpg mappings for compatibility
  '/src/assets/blog-restaurant-dining.jpg': blogRestaurantDining,
  '/src/assets/blog-london-events.jpg': blogLondonEvents,
  '/src/assets/blog-exclusive-experiences.jpg': blogExclusiveExperiences,
  '/src/assets/blog-luxury-hotels.jpg': blogLuxuryHotels,
  '/src/assets/blog-entertainment-culture.jpg': blogEntertainmentCulture,
  
  // Public blog paths - alternative routes
  '/images/blog/restaurant-dining.webp': blogRestaurantDining,
  '/images/blog/london-events.webp': blogLondonEvents,
  '/images/blog/exclusive-experiences.webp': blogExclusiveExperiences,
  '/images/blog/luxury-hotels.webp': blogLuxuryHotels,
  '/images/blog/entertainment-culture.webp': blogEntertainmentCulture,
  '/images/blog/corporate-events.webp': blogLondonEvents,
  '/images/blog/london-theatre.webp': blogEntertainmentCulture,
  '/images/blog/michelin-dining.webp': blogRestaurantDining,
  
  // Default fallbacks for common blog categories
  '/images/blog/dining.webp': blogRestaurantDining,
  '/images/blog/events.webp': blogLondonEvents,
  '/images/blog/experiences.webp': blogExclusiveExperiences,
  '/images/blog/hotels.webp': blogLuxuryHotels,
  '/images/blog/culture.webp': blogEntertainmentCulture,
  
  // Model images
  '/images/kate1.webp': kate1,
  '/images/luisa1.webp': luisa1,
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/images/blog/michelin-dining.webp';
  
  // Try exact match first
  if (imageMap[imagePath]) {
    return imageMap[imagePath];
  }
  
  // Try to find a partial match for blog images
  if (imagePath.includes('restaurant') || imagePath.includes('dining')) {
    return blogRestaurantDining;
  }
  if (imagePath.includes('event') || imagePath.includes('london')) {
    return blogLondonEvents;
  }
  if (imagePath.includes('experience') || imagePath.includes('exclusive')) {
    return blogExclusiveExperiences;
  }
  if (imagePath.includes('hotel') || imagePath.includes('luxury')) {
    return blogLuxuryHotels;
  }
  if (imagePath.includes('culture') || imagePath.includes('entertainment')) {
    return blogEntertainmentCulture;
  }
  
  // Return original path or fallback
  return imagePath || '/images/blog/michelin-dining.webp';
};


=======
// Image imports
import model1 from '@/assets/model1.jpg';
import model2 from '@/assets/model2.jpg';
import model3 from '@/assets/model3.jpg';
import model4 from '@/assets/model4.jpg';
import kate1 from '@/assets/kate1.jpg';
import luisa1 from '@/assets/luisa1.jpg';
import heroMain from '@/assets/hero-main.jpg';
import blogRestaurantDining from '@/assets/blog-restaurant-dining.jpg';
import blogLondonEvents from '@/assets/blog-london-events.jpg';
import blogExclusiveExperiences from '@/assets/blog-exclusive-experiences.jpg';
import blogLuxuryHotels from '@/assets/blog-luxury-hotels.jpg';
import blogEntertainmentCulture from '@/assets/blog-entertainment-culture.jpg';

// Map database image paths to actual imports
const imageMap: Record<string, string> = {
  '/src/assets/model1.jpg': model1,
  '/src/assets/model2.jpg': model2,
  '/src/assets/model3.jpg': model3,
  '/src/assets/model4.jpg': model4,
  '/src/assets/kate1.jpg': kate1,
  '/src/assets/luisa1.jpg': luisa1,
  '/images/model1.jpg': model1,
  '/images/model2.jpg': model2,
  '/images/model3.jpg': model3,
  '/images/model4.jpg': model4,
  '/images/kate1.jpg': kate1,
  '/images/luisa1.jpg': luisa1,
  '/src/assets/hero-main.jpg': heroMain,
  '/images/hero-main.jpg': heroMain,
  // Blog images - assets paths
  '/src/assets/blog-restaurant-dining.jpg': blogRestaurantDining,
  '/src/assets/blog-london-events.jpg': blogLondonEvents,
  '/src/assets/blog-exclusive-experiences.jpg': blogExclusiveExperiences,
  '/src/assets/blog-luxury-hotels.jpg': blogLuxuryHotels,
  '/src/assets/blog-entertainment-culture.jpg': blogEntertainmentCulture,
  // Blog images - public paths (map to same images)
  '/images/blog/corporate-events.jpg': blogLondonEvents,
  '/images/blog/london-theatre.jpg': blogEntertainmentCulture,
  '/images/blog/michelin-dining.jpg': blogRestaurantDining,
};

export const getImageUrl = (imagePath: string): string => {
  // Return the mapped URL if it exists, otherwise return the original path
  return imageMap[imagePath] || imagePath;
};
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
