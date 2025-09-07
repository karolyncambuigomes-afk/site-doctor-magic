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
  '/src/assets/blog-restaurant-dining.jpg': blogRestaurantDining,
  '/src/assets/blog-london-events.jpg': blogLondonEvents,
  '/src/assets/blog-exclusive-experiences.jpg': blogExclusiveExperiences,
  '/src/assets/blog-luxury-hotels.jpg': blogLuxuryHotels,
  '/src/assets/blog-entertainment-culture.jpg': blogEntertainmentCulture,
};

export const getImageUrl = (imagePath: string): string => {
  // Return the mapped URL if it exists, otherwise return the original path
  return imageMap[imagePath] || imagePath;
};