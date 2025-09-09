interface EntityLink {
  name: string;
  url: string;
  category: string;
  variations?: string[];
}

const entityDatabase: EntityLink[] = [
  // Luxury Hotels
  { 
    name: "Claridge's", 
    url: "https://www.claridges.co.uk/", 
    category: "hotel",
    variations: ["Claridges", "Claridge's Hotel", "Claridge's London"]
  },
  { 
    name: "The Ritz London", 
    url: "https://www.theritzlondon.com/", 
    category: "hotel",
    variations: ["The Ritz", "Ritz London", "Ritz Hotel"]
  },
  { 
    name: "The Savoy", 
    url: "https://www.thesavoylondon.com/", 
    category: "hotel",
    variations: ["Savoy Hotel", "The Savoy London", "Savoy London"]
  },
  { 
    name: "The Ned", 
    url: "https://www.thened.com/london/", 
    category: "hotel",
    variations: ["Ned Hotel", "The Ned London"]
  },
  { 
    name: "Shangri-La Hotel", 
    url: "https://www.shangri-la.com/london/shangrila/", 
    category: "hotel",
    variations: ["Shangri-La", "Shangri-La London", "Shangri-La at The Shard"]
  },
  { 
    name: "The Langham", 
    url: "https://www.langhamhotels.com/en/the-langham/london/", 
    category: "hotel",
    variations: ["Langham Hotel", "Langham London"]
  },
  { 
    name: "The Connaught", 
    url: "https://www.the-connaught.co.uk/", 
    category: "hotel",
    variations: ["Connaught Hotel"]
  },
  { 
    name: "The Zetter Townhouse", 
    url: "https://www.thezettertownhouse.com/", 
    category: "hotel",
    variations: ["Zetter Townhouse", "The Zetter"]
  },
  { 
    name: "Charlotte Street Hotel", 
    url: "https://www.charlottestreethotel.co.uk/", 
    category: "hotel",
    variations: ["Charlotte Street"]
  },

  // Restaurants
  { 
    name: "Sketch", 
    url: "https://sketch.london/", 
    category: "restaurant",
    variations: ["Sketch Restaurant", "Sketch London"]
  },
  { 
    name: "Core by Clare Smyth", 
    url: "https://corebyclaresmyth.com/", 
    category: "restaurant",
    variations: ["Core", "Clare Smyth"]
  },
  { 
    name: "Gordon Ramsay", 
    url: "https://www.gordonramsayrestaurants.com/", 
    category: "restaurant",
    variations: ["Gordon Ramsay Restaurant"]
  },
  { 
    name: "Aqua Shard", 
    url: "https://www.aquashard.co.uk/", 
    category: "restaurant",
    variations: ["Aqua Shard Restaurant"]
  },
  { 
    name: "Dinner by Heston Blumenthal", 
    url: "https://www.dinnerbyheston.com/", 
    category: "restaurant",
    variations: ["Dinner by Heston", "Heston Blumenthal"]
  },

  // Cultural Venues
  { 
    name: "Royal Opera House", 
    url: "https://www.roh.org.uk/", 
    category: "culture",
    variations: ["ROH", "Covent Garden Opera"]
  },
  { 
    name: "Shakespeare's Globe", 
    url: "https://www.shakespearesglobe.com/", 
    category: "culture",
    variations: ["Globe Theatre", "The Globe"]
  },
  { 
    name: "Tate Modern", 
    url: "https://www.tate.org.uk/visit/tate-modern", 
    category: "culture",
    variations: ["Tate Modern Gallery"]
  },
  { 
    name: "National Gallery", 
    url: "https://www.nationalgallery.org.uk/", 
    category: "culture",
    variations: ["National Gallery London"]
  },

  // Historic Sites
  { 
    name: "Tower of London", 
    url: "https://www.hrp.org.uk/tower-of-london/", 
    category: "historic",
    variations: ["The Tower of London", "Tower Bridge"]
  },
  { 
    name: "Buckingham Palace", 
    url: "https://www.rct.uk/visit/buckingham-palace", 
    category: "historic",
    variations: ["The Palace", "Royal Palace"]
  },
  { 
    name: "Westminster Abbey", 
    url: "https://www.westminster-abbey.org/", 
    category: "historic",
    variations: ["Westminster Cathedral"]
  },

  // Events
  { 
    name: "Wimbledon", 
    url: "https://www.wimbledon.com/", 
    category: "event",
    variations: ["Wimbledon Championships", "The Championships"]
  },
  { 
    name: "Royal Ascot", 
    url: "https://www.ascot.co.uk/", 
    category: "event",
    variations: ["Ascot", "Royal Ascot Racing"]
  },
  { 
    name: "Chelsea Flower Show", 
    url: "https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show", 
    category: "event",
    variations: ["RHS Chelsea", "Chelsea Flower Show"]
  },
  { 
    name: "London Fashion Week", 
    url: "https://www.londonfashionweek.co.uk/", 
    category: "event",
    variations: ["LFW", "Fashion Week London"]
  },

  // Areas
  { 
    name: "Mayfair", 
    url: "https://en.wikipedia.org/wiki/Mayfair", 
    category: "area",
    variations: ["Mayfair London", "Mayfair District"]
  },
  { 
    name: "Covent Garden", 
    url: "https://www.coventgarden.london/", 
    category: "area",
    variations: ["Covent Garden London"]
  },
  { 
    name: "Shoreditch", 
    url: "https://en.wikipedia.org/wiki/Shoreditch", 
    category: "area",
    variations: ["Shoreditch London"]
  },
  { 
    name: "Notting Hill", 
    url: "https://en.wikipedia.org/wiki/Notting_Hill", 
    category: "area",
    variations: ["Notting Hill London"]
  },
  { 
    name: "Marylebone", 
    url: "https://en.wikipedia.org/wiki/Marylebone", 
    category: "area",
    variations: ["Marylebone London"]
  }
];

export const processContentWithLinks = (content: string): string => {
  let processedContent = content;
  
  // Sort entities by length (longest first) to avoid partial matches
  const sortedEntities = [...entityDatabase].sort((a, b) => {
    const aLength = Math.max(a.name.length, ...(a.variations?.map(v => v.length) || []));
    const bLength = Math.max(b.name.length, ...(b.variations?.map(v => v.length) || []));
    return bLength - aLength;
  });
  
  sortedEntities.forEach(entity => {
    const allNames = [entity.name, ...(entity.variations || [])];
    
    allNames.forEach(name => {
      // Create a regex that matches the name but not if it's already inside a link
      const regex = new RegExp(
        `(?<!<a[^>]*>)(?<!<[^>]*>)\\b(${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b(?![^<]*</a>)`,
        'gi'
      );
      
      // Check if this text is already linked
      if (!processedContent.includes(`>${name}<`)) {
        processedContent = processedContent.replace(regex, (match) => {
          const categoryClass = getCategoryClass(entity.category);
          return `<a href="${entity.url}" target="_blank" rel="noopener noreferrer" class="${categoryClass}">${match}</a>`;
        });
      }
    });
  });
  
  return processedContent;
};

const getCategoryClass = (category: string): string => {
  const baseClasses = "inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors duration-200 font-medium underline decoration-primary/50 hover:decoration-primary decoration-2 underline-offset-2";
  
  switch (category) {
    case 'hotel':
      return `${baseClasses} entity-link-hotel`;
    case 'restaurant':
      return `${baseClasses} entity-link-restaurant`;
    case 'culture':
      return `${baseClasses} entity-link-culture`;
    case 'historic':
      return `${baseClasses} entity-link-historic`;
    case 'event':
      return `${baseClasses} entity-link-event`;
    case 'area':
      return `${baseClasses} entity-link-area`;
    default:
      return baseClasses;
  }
};

export { entityDatabase };