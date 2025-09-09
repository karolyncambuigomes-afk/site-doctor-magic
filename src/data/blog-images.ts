export interface BlogImageMap {
  [category: string]: {
    [contentType: string]: string[];
  };
}

export const blogImages: BlogImageMap = {
  dining: {
    restaurants: [
      '/src/assets/blog-restaurant-dining.jpg',
      '/images/model1.jpg',
      '/images/model2.jpg'
    ],
    venues: [
      '/src/assets/blog-luxury-hotels.jpg',
      '/images/model3.jpg'
    ],
    tips: [
      '/images/kate1.jpg'
    ]
  },
  events: {
    royal: [
      '/src/assets/blog-london-events.jpg',
      '/images/model4.jpg'
    ],
    fashion: [
      '/images/luisa1.jpg',
      '/images/model1.jpg'
    ],
    sports: [
      '/images/model2.jpg',
      '/images/model3.jpg'
    ],
    culture: [
      '/src/assets/blog-entertainment-culture.jpg',
      '/images/kate1.jpg'
    ]
  },
  experiences: {
    private: [
      '/src/assets/blog-exclusive-experiences.jpg',
      '/images/model1.jpg'
    ],
    gastronomic: [
      '/src/assets/blog-restaurant-dining.jpg',
      '/images/model2.jpg'
    ],
    cultural: [
      '/src/assets/blog-entertainment-culture.jpg',
      '/images/model3.jpg'
    ],
    wellness: [
      '/images/model4.jpg',
      '/images/luisa1.jpg'
    ],
    nightlife: [
      '/images/kate1.jpg',
      '/images/model1.jpg'
    ]
  },
  hotels: {
    classic: [
      '/src/assets/blog-luxury-hotels.jpg',
      '/images/model2.jpg'
    ],
    contemporary: [
      '/images/model3.jpg',
      '/images/model4.jpg'
    ],
    boutique: [
      '/images/luisa1.jpg',
      '/images/kate1.jpg'
    ]
  },
  entertainment: {
    culture: [
      '/src/assets/blog-entertainment-culture.jpg',
      '/images/model1.jpg'
    ],
    nightlife: [
      '/images/model2.jpg',
      '/images/model3.jpg'
    ],
    events: [
      '/src/assets/blog-london-events.jpg',
      '/images/model4.jpg'
    ]
  }
};

export const getImageForContent = (blogSlug: string, sectionTitle: string, sectionIndex: number): string | null => {
  // Map blog slugs to categories
  const categoryMap: { [key: string]: string } = {
    'best-restaurants-london-dinner-dates': 'dining',
    'london-annual-events-luxury-experiences': 'events',
    'exclusive-experiences-london-luxury': 'experiences',
    'luxury-hotels-london-sophisticated-stays': 'hotels',
    'entertainment-culture-london-nights': 'entertainment',
    'belgravia-exclusive-venues-diplomatic-district': 'experiences'
  };

  const category = categoryMap[blogSlug];
  if (!category || !blogImages[category]) return null;

  // Map section titles to content types
  const contentTypeMap: { [key: string]: string } = {
    // Dining
    'sketch': 'restaurants',
    'core by clare smyth': 'restaurants',
    'ritz restaurant': 'restaurants',
    'aqua shard': 'restaurants',
    'restaurant gordon ramsay': 'restaurants',
    'tips for a perfect date': 'tips',
    
    // Events
    'chelsea flower show': 'royal',
    'london fashion week': 'fashion',
    'royal ascot': 'royal',
    'wimbledon': 'sports',
    'henley royal regatta': 'sports',
    'frieze art fair': 'culture',
    'lord mayor\'s show': 'culture',
    'royal opera house': 'culture',
    
    // Experiences
    'private historical experiences': 'private',
    'tower of london': 'private',
    'buckingham palace': 'private',
    'westminster abbey': 'private',
    'exclusive gastronomic experiences': 'gastronomic',
    'sky garden': 'gastronomic',
    'harrods food hall': 'gastronomic',
    'borough market': 'gastronomic',
    'unique cultural experiences': 'cultural',
    'royal opera house - backstage': 'cultural',
    'tate modern - private curator': 'cultural',
    'shakespeare\'s globe - private': 'cultural',
    'luxury and wellness experiences': 'wellness',
    'the ned - spa': 'wellness',
    'claridge\'s - afternoon tea': 'wellness',
    'exclusive night experiences': 'nightlife',
    'london eye - private': 'nightlife',
    'thames - private cruise': 'nightlife',
    
    // Hotels
    'claridge\'s - mayfair': 'classic',
    'the ritz london - piccadilly': 'classic',
    'the savoy - covent garden': 'classic',
    'the ned - city': 'contemporary',
    'edition london - fitzrovia': 'contemporary',
    'shangri-la - shard': 'contemporary',
    'zetter townhouse - marylebone': 'boutique',
    'charlotte street hotel - fitzrovia': 'boutique',
    'artist residence london - pimlico': 'boutique'
  };

  // Find matching content type
  let contentType = 'private'; // default
  const lowerTitle = sectionTitle.toLowerCase();
  
  for (const [key, type] of Object.entries(contentTypeMap)) {
    if (lowerTitle.includes(key.toLowerCase())) {
      contentType = type;
      break;
    }
  }

  const categoryImages = blogImages[category][contentType];
  if (!categoryImages || categoryImages.length === 0) {
    // Fallback to any image from the category
    const allCategoryImages = Object.values(blogImages[category]).flat();
    if (allCategoryImages.length === 0) return null;
    return allCategoryImages[sectionIndex % allCategoryImages.length];
  }

  return categoryImages[sectionIndex % categoryImages.length];
};