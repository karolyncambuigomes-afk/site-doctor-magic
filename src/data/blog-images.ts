export interface BlogImageMap {
  [category: string]: {
    [contentType: string]: string[];
  };
}

export const blogImages: BlogImageMap = {
  'dining': {
    'restaurants': [
  '/images/sketch-restaurant.webp',
  '/images/model1.webp',
  '/images/kate1.webp'
    ],
    'fine-dining': [
      '/images/sketch-restaurant.webp',
  '/images/model2.webp',
  '/images/luisa1.webp'
    ],
    'michelin': [
      '/images/sketch-restaurant.webp',
  '/images/model3.webp',
      '/images/model1.webp'
    ],
    'wine': [
      '/images/sketch-restaurant.webp',
  '/images/model4.webp'
    ],
    'cocktails': [
      '/images/sketch-restaurant.webp',
      '/images/kate1.webp'
    ]
  },
  'events': {
    'exclusive': [
  '/images/london-gala-event.webp',
      '/images/model1.webp',
      '/images/model2.webp'
    ],
    'fashion': [
      '/images/london-gala-event.webp',
      '/images/luisa1.webp',
      '/images/kate1.webp'
    ],
    'parties': [
      '/images/london-gala-event.webp',
      '/images/model3.webp',
      '/images/model4.webp'
    ],
    'galas': [
      '/images/london-gala-event.webp',
      '/images/model1.webp'
    ],
    'premieres': [
      '/images/london-gala-event.webp',
      '/images/kate1.webp'
    ],
    'royal': [
      '/images/london-gala-event.webp',
      '/images/model2.webp'
    ],
    'sports': [
      '/images/london-gala-event.webp',
      '/images/model4.webp'
    ],
    'culture': [
      '/images/london-gala-event.webp',
      '/images/luisa1.webp'
    ]
  },
  'culture': {
    'entertainment': [
  '/images/blog-entertainment-culture.webp',
      '/images/model2.webp',
      '/images/luisa1.webp'
    ],
    'art': [
  '/images/blog-entertainment-culture.webp',
      '/images/model3.webp',
      '/images/kate1.webp'
    ],
    'theater': [
      '/images/blog-entertainment-culture.webp',
      '/images/model1.webp',
      '/images/model4.webp'
    ],
    'museums': [
      '/images/blog-entertainment-culture.webp',
      '/images/luisa1.webp'
    ],
    'concerts': [
      '/images/blog-entertainment-culture.webp',
      '/images/model2.webp'
    ]
  },
  'luxury': {
    'experiences': [
      '/images/luxury-spa-treatment.webp',
      '/images/model1.webp',
      '/images/kate1.webp',
      '/images/model3.webp'
    ],
    'hotels': [
      '/images/clariges-lobby.webp',
      '/images/model2.webp',
      '/images/luisa1.webp',
      '/images/model4.webp'
    ],
    'shopping': [
      '/images/luxury-spa-treatment.webp',
      '/images/kate1.webp',
      '/images/model1.webp'
    ],
    'spas': [
      '/images/luxury-spa-treatment.webp',
      '/images/luisa1.webp'
    ],
    'travel': [
      '/images/luxury-spa-treatment.webp',
      '/images/model2.webp'
    ]
  },
  'lifestyle': {
    'wellness': [
      '/images/model1.webp',
      '/images/kate1.webp'
    ],
    'fitness': [
      '/images/model2.webp',
      '/images/luisa1.webp'
    ],
    'fashion': [
      '/images/model3.webp',
      '/images/model4.webp'
    ]
  },
  'experiences': {
    'private': [
      '/images/blog-exclusive-experiences.webp',
      '/images/model1.webp'
    ],
    'gastronomic': [
      '/images/blog-restaurant-dining.webp',
      '/images/model2.webp'
    ],
    'cultural': [
      '/images/blog-entertainment-culture.webp',
      '/images/model3.webp'
    ],
    wellness: [
      '/images/model4.webp',
      '/images/luisa1.webp'
    ],
    nightlife: [
      '/images/kate1.webp',
      '/images/model1.webp'
    ]
  },
  hotels: {
    classic: [
      '/images/clariges-lobby.webp',
      '/images/ritz-london-exterior.webp',
      '/images/savoy-thames-foyer.webp'
    ],
    contemporary: [
      '/images/ned-banking-hall.webp',
      '/images/shangri-la-shard-view.webp',
      '/images/model3.webp'
    ],
    boutique: [
      '/images/clariges-lobby.webp',
      '/images/luisa1.webp',
      '/images/kate1.webp'
    ]
  },
  entertainment: {
    culture: [
      '/images/blog-entertainment-culture.webp',
      '/images/model1.webp'
    ],
    nightlife: [
      '/images/model2.webp',
      '/images/model3.webp'
    ],
    events: [
      '/images/blog-london-events.webp',
      '/images/model4.webp'
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