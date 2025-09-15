// Image imports
import model1 from '@/assets/model1.webp';
import model2 from '@/assets/model2.webp';
import model3 from '@/assets/model3.webp';
import model4 from '@/assets/model4.webp';
import kate1 from '@/assets/kate1.webp';
import luisa1 from '@/assets/luisa1.webp';
import heroMain from '@/assets/hero-main.webp';
import blogRestaurantDining from '@/assets/blog-restaurant-dining.webp';
import blogLondonEvents from '@/assets/blog-london-events.webp';
import blogExclusiveExperiences from '@/assets/blog-exclusive-experiences.webp';
import blogLuxuryHotels from '@/assets/blog-luxury-hotels.webp';
import blogEntertainmentCulture from '@/assets/blog-entertainment-culture.webp';

// Map database image paths to actual imports
const imageMap: Record<string, string> = {
  '/src/assets/hero-main.webp': heroMain,
  '/images/hero-main.webp': heroMain,
  '/src/assets/blog-restaurant-dining.webp': blogRestaurantDining,
  '/src/assets/blog-london-events.webp': blogLondonEvents,
  '/src/assets/blog-exclusive-experiences.webp': blogExclusiveExperiences,
  '/src/assets/blog-luxury-hotels.webp': blogLuxuryHotels,
  '/src/assets/blog-entertainment-culture.webp': blogEntertainmentCulture,
  '/images/blog/corporate-events.webp': blogLondonEvents,
  '/images/blog/london-theatre.webp': blogEntertainmentCulture,
  '/images/blog/michelin-dining.webp': blogRestaurantDining,
  '/images/kate1.webp': kate1,
  '/images/luisa1.webp': luisa1,
};

export const getImageUrl = (imagePath: string): string => {
  return imageMap[imagePath] || imagePath;
};


