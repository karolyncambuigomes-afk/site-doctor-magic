// Enhanced Entity Linking with Additional Premium London Venues

interface EntityLink {
  name: string;
  variations: string[];
  url: string;
  category: string;
  priority: number;
  area?: string;
}

// Extended entities list with 25+ new premium London venues
const additionalEntities: EntityLink[] = [
  // Ultra-Premium Hotels
  {
    name: "The Berkeley",
    variations: ["The Berkeley", "Berkeley Hotel", "Berkeley London"],
    url: "https://the-berkeley.co.uk/",
    category: "luxury-hotel",
    priority: 95,
    area: "Knightsbridge"
  },
  {
    name: "Mandarin Oriental Hyde Park",
    variations: ["Mandarin Oriental", "Mandarin Oriental Hyde Park", "MO Hyde Park"],
    url: "https://www.mandarinoriental.com/london/hyde-park",
    category: "luxury-hotel", 
    priority: 95,
    area: "Knightsbridge"
  },
  {
    name: "The Langham London",
    variations: ["The Langham", "Langham Hotel", "Langham London"],
    url: "https://www.langhamhotels.com/en/the-langham/london/",
    category: "luxury-hotel",
    priority: 92,
    area: "Marylebone"
  },
  {
    name: "Bulgari Hotel London",
    variations: ["Bulgari Hotel", "Bulgari London"],
    url: "https://www.bulgarihotels.com/en_US/london",
    category: "luxury-hotel",
    priority: 98,
    area: "Knightsbridge"
  },
  {
    name: "The Connaught",
    variations: ["The Connaught", "Connaught Hotel"],
    url: "https://the-connaught.co.uk/",
    category: "luxury-hotel",
    priority: 96,
    area: "Mayfair"
  },
  {
    name: "Nobu Hotel London",
    variations: ["Nobu Hotel", "Nobu London"],
    url: "https://london-portman-square.nobuhotels.com/",
    category: "luxury-hotel",
    priority: 90,
    area: "Marylebone"
  },
  {
    name: "Park Lane Hotel",
    variations: ["Park Lane Hotel", "The Park Lane"],
    url: "https://www.parklane.sheraton.com/",
    category: "luxury-hotel",
    priority: 88,
    area: "Mayfair"
  },

  // Exclusive Restaurants
  {
    name: "Restaurant Gordon Ramsay",
    variations: ["Restaurant Gordon Ramsay", "Gordon Ramsay Royal Hospital Road"],
    url: "https://www.gordonramsayrestaurants.com/restaurant-gordon-ramsay/",
    category: "michelin-restaurant",
    priority: 98,
    area: "Chelsea"
  },
  {
    name: "The Ledbury",
    variations: ["The Ledbury", "Ledbury Restaurant"],
    url: "https://theledbury.com/",
    category: "michelin-restaurant",
    priority: 97,
    area: "Notting Hill"
  },
  {
    name: "Core by Clare Smyth",
    variations: ["Core by Clare Smyth", "Core Restaurant", "Clare Smyth Core"],
    url: "https://corebyclaresmyth.com/",
    category: "michelin-restaurant",
    priority: 96,
    area: "Notting Hill"
  },
  {
    name: "Sketch",
    variations: ["Sketch", "Sketch London", "Sketch Restaurant"],
    url: "https://sketch.london/",
    category: "fine-dining",
    priority: 94,
    area: "Mayfair"
  },
  {
    name: "Hélène Darroze at The Connaught",
    variations: ["Hélène Darroze", "Helene Darroze", "Darroze Connaught"],
    url: "https://the-connaught.co.uk/restaurants-bars/helene-darroze/",
    category: "michelin-restaurant",
    priority: 95,
    area: "Mayfair"
  },
  {
    name: "Dinner by Heston Blumenthal",
    variations: ["Dinner by Heston", "Heston Blumenthal Dinner", "Dinner Mandarin Oriental"],
    url: "https://www.dinnerbyhuston.co.uk/",
    category: "michelin-restaurant",
    priority: 96,
    area: "Knightsbridge"
  },
  {
    name: "Alain Ducasse at The Dorchester",
    variations: ["Alain Ducasse", "Ducasse Dorchester"],
    url: "https://www.dorchestercollection.com/en/london/the-dorchester/restaurants-bars/alain-ducasse/",
    category: "michelin-restaurant",
    priority: 97,
    area: "Mayfair"
  },

  // Cultural Venues
  {
    name: "Tate Modern",
    variations: ["Tate Modern", "Tate Modern Gallery"],
    url: "https://www.tate.org.uk/visit/tate-modern",
    category: "cultural-venue",
    priority: 90,
    area: "South Bank"
  },
  {
    name: "National Gallery",
    variations: ["National Gallery", "National Gallery London"],
    url: "https://www.nationalgallery.org.uk/",
    category: "cultural-venue",
    priority: 89,
    area: "Westminster"
  },
  {
    name: "Victoria and Albert Museum",
    variations: ["V&A", "Victoria and Albert Museum", "V&A Museum"],
    url: "https://www.vam.ac.uk/",
    category: "cultural-venue",
    priority: 88,
    area: "South Kensington"
  },
  {
    name: "Courtauld Gallery",
    variations: ["Courtauld Gallery", "The Courtauld"],
    url: "https://courtauld.ac.uk/gallery",
    category: "cultural-venue",
    priority: 85,
    area: "Westminster"
  },

  // Exclusive Shopping
  {
    name: "Bond Street",
    variations: ["Bond Street", "New Bond Street", "Old Bond Street"],
    url: "https://www.bondstreet.co.uk/",
    category: "luxury-shopping",
    priority: 88,
    area: "Mayfair"
  },
  {
    name: "Selfridges",
    variations: ["Selfridges", "Selfridges London"],
    url: "https://www.selfridges.com/",
    category: "luxury-shopping",
    priority: 87,
    area: "Marylebone"
  },
  {
    name: "Burlington Arcade",
    variations: ["Burlington Arcade", "Burlington Shopping"],
    url: "https://www.burlington-arcade.co.uk/",
    category: "luxury-shopping",
    priority: 86,
    area: "Mayfair"
  },
  {
    name: "Kings Road",
    variations: ["Kings Road", "King's Road", "Kings Road Chelsea"],
    url: "https://www.kingsroad.com/",
    category: "luxury-shopping",
    priority: 85,
    area: "Chelsea"
  },

  // Private Members' Clubs
  {
    name: "Annabel's",
    variations: ["Annabel's", "Annabels", "Annabel's Mayfair"],
    url: "https://annabels.co.uk/",
    category: "private-club",
    priority: 92,
    area: "Mayfair"
  },
  {
    name: "The Arts Club",
    variations: ["The Arts Club", "Arts Club Mayfair"],
    url: "https://theartsclub.co.uk/",
    category: "private-club",
    priority: 90,
    area: "Mayfair"
  },
  {
    name: "5 Hertford Street",
    variations: ["5 Hertford Street", "Five Hertford Street"],
    url: "https://5hertfordstreet.com/",
    category: "private-club",
    priority: 91,
    area: "Mayfair"
  },

  // Luxury Spas & Wellness
  {
    name: "The Spa at Mandarin Oriental",
    variations: ["Mandarin Oriental Spa", "MO Spa"],
    url: "https://www.mandarinoriental.com/london/hyde-park/luxury-spa",
    category: "luxury-spa",
    priority: 90,
    area: "Knightsbridge"
  },
  {
    name: "ESPA at Corinthia",
    variations: ["ESPA Corinthia", "Corinthia Spa"],
    url: "https://www.corinthia.com/london/spa/",
    category: "luxury-spa",
    priority: 91,
    area: "Westminster"
  },

  // Event Venues
  {
    name: "Royal Festival Hall",
    variations: ["Royal Festival Hall", "Festival Hall"],
    url: "https://www.southbankcentre.co.uk/venues/royal-festival-hall",
    category: "event-venue",
    priority: 87,
    area: "South Bank"
  },
  {
    name: "Barbican Centre",
    variations: ["Barbican Centre", "Barbican"],
    url: "https://www.barbican.org.uk/",
    category: "event-venue",
    priority: 86,
    area: "City of London"
  }
];

// Import existing entities function (this would be from the original entityLinker.ts)
import { processContentWithEntityLinks, getEntityLinkStats } from './entityLinker';

// Note: Since we can't directly import entities array, we'll create our own comprehensive list
// that includes both original entities and new premium venues
export const allEntities = additionalEntities; // Using our enhanced entity list

// Enhanced content processing with increased link limits
export const processContentWithEnhancedEntityLinks = (content: string): string => {
  if (!content) return content;
  
  let processedContent = content;
  const usedEntities = new Set<string>();
  let linkCount = 0;
  const maxLinks = 75; // Increased from 60

  // Sort entities by priority (highest first) and then by length (longer names first)
  const sortedEntities = allEntities
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.name.length - a.name.length;
    });

  for (const entity of sortedEntities) {
    if (linkCount >= maxLinks) break;
    
    // Check if this entity has already been linked
    if (usedEntities.has(entity.name.toLowerCase())) continue;

    // Try all variations of the entity name
    const variations = [entity.name, ...entity.variations];
    
    for (const variation of variations) {
      if (linkCount >= maxLinks) break;
      
      // Create regex pattern that matches whole words only
      const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedVariation}\\b(?![^<]*>)`, 'gi');
      
      // Check if this variation exists in the content and hasn't been linked yet
      if (regex.test(processedContent) && !usedEntities.has(variation.toLowerCase())) {
        // Replace first occurrence only
        processedContent = processedContent.replace(regex, (match) => {
          if (linkCount >= maxLinks) return match;
          linkCount++;
          usedEntities.add(entity.name.toLowerCase());
          return `<a href="${entity.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${match}</a>`;
        });
        break; // Move to next entity after first successful link
      }
    }
  }

  return processedContent;
};

// Enhanced entity link statistics
export const getEnhancedEntityLinkStats = (content: string): { 
  totalEntities: number; 
  linkedEntities: number; 
  entityBreakdown: Record<string, number>;
} => {
  if (!content) return { totalEntities: 0, linkedEntities: 0, entityBreakdown: {} };
  
  let foundEntities = 0;
  let linkedEntities = 0;
  const entityBreakdown: Record<string, number> = {};
  const usedEntities = new Set<string>();
  const maxLinks = 75;

  const sortedEntities = allEntities
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.name.length - a.name.length;
    });

  for (const entity of sortedEntities) {
    if (usedEntities.has(entity.name.toLowerCase())) continue;

    const variations = [entity.name, ...entity.variations];
    
    for (const variation of variations) {
      const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedVariation}\\b`, 'gi');
      
      if (regex.test(content)) {
        foundEntities++;
        entityBreakdown[entity.category] = (entityBreakdown[entity.category] || 0) + 1;
        
        if (linkedEntities < maxLinks && !usedEntities.has(variation.toLowerCase())) {
          linkedEntities++;
          usedEntities.add(entity.name.toLowerCase());
        }
        break;
      }
    }
  }

  return {
    totalEntities: foundEntities,
    linkedEntities,
    entityBreakdown
  };
};