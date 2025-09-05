// Image imports
import model1 from '@/assets/model1.jpg';
import model2 from '@/assets/model2.jpg';
import model3 from '@/assets/model3.jpg';
import model4 from '@/assets/model4.jpg';
import kate1 from '@/assets/kate1.jpg';
import luisa1 from '@/assets/luisa1.jpg';

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
};

export const getImageUrl = (imagePath: string): string => {
  // Return the mapped URL if it exists, otherwise return the original path
  return imageMap[imagePath] || imagePath;
};