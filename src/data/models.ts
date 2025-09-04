// Import das imagens
import model1 from '@/assets/model1.jpg';
import model2 from '@/assets/model2.jpg';
import model3 from '@/assets/model3.jpg';
import model4 from '@/assets/model4.jpg';
import luisa1 from '@/assets/luisa1.jpg';
import kate1 from '@/assets/kate1.jpg';

export interface Model {
  id: string;
  name: string;
  age: number;
  location: string;
  price: string;
  image: string;
  gallery: string[];
  services: string[];
  characteristics: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating: number;
  reviews: number;
  description: string;
  height: string;
  measurements: string;
  hair: string;
  eyes: string;
  nationality: string;
  education: string;
  interests: string[];
}

export const models: Model[] = [
  {
    id: '1',
    name: 'Sofia',
    age: 24,
    location: 'Mayfair',
    price: '£500/hour',
    image: model1,
    gallery: [model1],
    services: ['Dinner Companion', 'Event Escort', 'Private Meetings'],
    characteristics: ['High Class', 'Bi Sexual', 'Open Minded'],
    availability: 'available',
    rating: 4.9,
    reviews: 156,
    description: 'Sofia is an elegant and sophisticated companion with a passion for fine dining and cultural events. She brings warmth and intelligence to every encounter.',
    height: '5\'7"',
    measurements: '34-24-36',
    hair: 'Brunette',
    eyes: 'Brown',
    nationality: 'Brazilian',
    education: 'University Graduate',
    interests: ['Art', 'Travel', 'Fine Dining', 'Theater']
  },
  {
    id: '2',
    name: 'Isabella',
    age: 26,
    location: 'Kensington',
    price: '£600/hour',
    image: model2,
    gallery: [model2],
    services: ['Social Events', 'Business Dinners', 'Travel Companion'],
    characteristics: ['High Class', 'Sophisticated', 'Intelligent'],
    availability: 'available',
    rating: 4.8,
    reviews: 203,
    description: 'Isabella is a charming and well-educated companion who excels in social situations. Her European elegance and wit make her the perfect choice for any occasion.',
    height: '5\'6"',
    measurements: '36-25-37',
    hair: 'Blonde',
    eyes: 'Blue',
    nationality: 'French',
    education: 'Masters Degree',
    interests: ['Fashion', 'Literature', 'Wine Tasting', 'Photography']
  },
  {
    id: '3',
    name: 'Victoria',
    age: 23,
    location: 'Chelsea',
    price: '£550/hour',
    image: model3,
    gallery: [model3],
    services: ['Evening Companion', 'Cultural Events', 'Weekend Getaways'],
    characteristics: ['High Class', 'Open Minded', 'Cultured'],
    availability: 'busy',
    rating: 4.9,
    reviews: 89,
    description: 'Victoria combines intelligence with natural beauty. She is well-versed in current affairs and brings engaging conversation to any social setting.',
    height: '5\'8"',
    measurements: '35-24-36',
    hair: 'Red',
    eyes: 'Green',
    nationality: 'British',
    education: 'University Graduate',
    interests: ['Politics', 'Sailing', 'Classical Music', 'Cooking']
  },
  {
    id: '4',
    name: 'Mei Lin',
    age: 25,
    location: 'Canary Wharf',
    price: '£650/hour',
    image: model4,
    gallery: [model4],
    services: ['Executive Dinners', 'International Events', 'Private Escort'],
    characteristics: ['High Class', 'International', 'Exclusive'],
    availability: 'available',
    rating: 5.0,
    reviews: 124,
    description: 'Mei Lin is an exceptionally cultured companion with international experience. Her grace and sophistication make her ideal for high-profile events.',
    height: '5\'5"',
    measurements: '34-23-35',
    hair: 'Black',
    eyes: 'Brown',
    nationality: 'Chinese',
    education: 'MBA',
    interests: ['Business', 'Yoga', 'Asian Cuisine', 'Meditation']
  },
  {
    id: '5',
    name: 'Luisa',
    age: 22,
    location: 'Belgravia',
    price: '£580/hour',
    image: luisa1,
    gallery: [luisa1],
    services: ['Dinner Companion', 'Social Events', 'Travel Companion'],
    characteristics: ['High Class', 'Bi Sexual', 'Vibrant'],
    availability: 'available',
    rating: 4.9,
    reviews: 78,
    description: 'Luisa is a vibrant and charming companion with Brazilian warmth and European sophistication. Her natural beauty and engaging personality make her perfect for any social occasion.',
    height: '5\'6"',
    measurements: '35-24-36',
    hair: 'Dark Brown',
    eyes: 'Hazel',
    nationality: 'Brazilian',
    education: 'University Graduate',
    interests: ['Dancing', 'Beach Sports', 'Fashion', 'Languages']
  },
  {
    id: '6',
    name: 'Kate',
    age: 27,
    location: 'Notting Hill',
    price: '£620/hour',
    image: kate1,
    gallery: [kate1],
    services: ['Business Events', 'Cultural Activities', 'Weekend Escapes'],
    characteristics: ['High Class', 'Open Minded', 'Sophisticated'],
    availability: 'available',
    rating: 4.8,
    reviews: 142,
    description: 'Kate is an intelligent and sophisticated British companion with impeccable style and grace. Her warm personality and cultural knowledge make her an ideal choice for discerning clients.',
    height: '5\'7"',
    measurements: '36-25-37',
    hair: 'Blonde',
    eyes: 'Blue',
    nationality: 'British',
    education: 'Masters Degree',
    interests: ['History', 'Museums', 'Horseback Riding', 'Classical Music']
  }
];