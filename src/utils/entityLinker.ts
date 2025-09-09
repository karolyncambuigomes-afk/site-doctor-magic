interface EntityLink {
  name: string;
  url: string;
  category: string;
  variations?: string[];
}

const entityDatabase: EntityLink[] = [
  // Luxury Hotels - London
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
  { 
    name: "Mandarin Oriental Hyde Park", 
    url: "https://www.mandarinoriental.com/london/hyde-park/", 
    category: "hotel",
    variations: ["Mandarin Oriental", "MO Hyde Park"]
  },
  { 
    name: "The Berkeley", 
    url: "https://www.the-berkeley.co.uk/", 
    category: "hotel",
    variations: ["Berkeley Hotel"]
  },
  { 
    name: "Rosewood London", 
    url: "https://www.rosewoodhotels.com/en/london", 
    category: "hotel",
    variations: ["Rosewood Hotel"]
  },
  { 
    name: "Park Lane Hotel", 
    url: "https://www.parklane.co.uk/", 
    category: "hotel",
    variations: ["Park Lane"]
  },

  // Countryside Luxury Hotels
  { 
    name: "Cliveden House", 
    url: "https://www.clivedenhouse.co.uk/", 
    category: "hotel",
    variations: ["Cliveden", "Cliveden Hotel"]
  },
  { 
    name: "Four Seasons Hampshire", 
    url: "https://www.fourseasons.com/hampshire/", 
    category: "hotel",
    variations: ["Four Seasons Hotel Hampshire", "Four Seasons Dogmersfield"]
  },
  { 
    name: "Chewton Glen", 
    url: "https://www.chewtonglen.com/", 
    category: "hotel",
    variations: ["Chewton Glen Hotel"]
  },
  { 
    name: "Coworth Park", 
    url: "https://www.dorchestercollection.com/en/ascot/coworth-park/", 
    category: "hotel",
    variations: ["Coworth Park Hotel"]
  },
  { 
    name: "The Grove", 
    url: "https://www.thegrove.co.uk/", 
    category: "hotel",
    variations: ["Grove Hotel"]
  },
  { 
    name: "Stoke Park", 
    url: "https://www.stokepark.com/", 
    category: "hotel",
    variations: ["Stoke Park Hotel"]
  },

  // Luxury Spas
  { 
    name: "ESPA at The Corinthia", 
    url: "https://www.corinthia.com/london/spa/", 
    category: "spa",
    variations: ["ESPA Corinthia", "Corinthia Spa", "ESPA London"]
  },
  { 
    name: "Akasha at Hotel Café Royal", 
    url: "https://www.hotelcaferoyal.com/wellness/akasha/", 
    category: "spa",
    variations: ["Akasha Spa", "Hotel Café Royal Spa"]
  },
  { 
    name: "The Spa at Mandarin Oriental", 
    url: "https://www.mandarinoriental.com/london/hyde-park/luxury-spa", 
    category: "spa",
    variations: ["Mandarin Oriental Spa"]
  },
  { 
    name: "Bamford Wellness Spa", 
    url: "https://www.bamfordwellnessspa.com/", 
    category: "spa",
    variations: ["Bamford Spa", "Bamford Wellness"]
  },
  { 
    name: "The Berkeley Spa", 
    url: "https://www.the-berkeley.co.uk/health-beauty/spa/", 
    category: "spa",
    variations: ["Berkeley Health Club & Spa"]
  },
  { 
    name: "Agua Bathhouse & Spa", 
    url: "https://www.aguaspa.co.uk/", 
    category: "spa",
    variations: ["Agua Spa", "Agua Bathhouse"]
  },
  { 
    name: "Ushvani Spa", 
    url: "https://www.ushvani.com/", 
    category: "spa",
    variations: ["Ushvani"]
  },

  // Adult Boutiques
  { 
    name: "Coco de Mer", 
    url: "https://www.coco-de-mer.com/", 
    category: "boutique",
    variations: ["Coco de Mer London"]
  },
  { 
    name: "Agent Provocateur", 
    url: "https://www.agentprovocateur.com/", 
    category: "boutique",
    variations: ["Agent Provocateur London"]
  },
  { 
    name: "Sh! Women's Store", 
    url: "https://www.sh-womenstore.com/", 
    category: "boutique",
    variations: ["Sh! Store", "Sh! Hoxton"]
  },
  { 
    name: "Lovehoney", 
    url: "https://www.lovehoney.co.uk/", 
    category: "boutique",
    variations: ["Lovehoney Store"]
  },

  // Private Members' Clubs
  { 
    name: "Soho House", 
    url: "https://www.sohohouse.com/", 
    category: "club",
    variations: ["Soho House London", "Soho House Group"]
  },
  { 
    name: "The Arts Club", 
    url: "https://www.theartsclub.co.uk/", 
    category: "club",
    variations: ["Arts Club"]
  },
  { 
    name: "White's", 
    url: "https://en.wikipedia.org/wiki/White%27s", 
    category: "club",
    variations: ["White's Club"]
  },
  { 
    name: "Boodle's", 
    url: "https://www.boodles.org/", 
    category: "club",
    variations: ["Boodle's Club"]
  },
  { 
    name: "The Reform Club", 
    url: "https://www.reformclub.com/", 
    category: "club",
    variations: ["Reform Club"]
  },
  { 
    name: "The Garrick Club", 
    url: "https://en.wikipedia.org/wiki/Garrick_Club", 
    category: "club",
    variations: ["Garrick Club"]
  },
  { 
    name: "Annabel's", 
    url: "https://annabels.co.uk/", 
    category: "club",
    variations: ["Annabel's Mayfair"]
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
  { 
    name: "Alain Ducasse at The Dorchester", 
    url: "https://www.dorchestercollection.com/en/london/the-dorchester/restaurant-bars/alain-ducasse/", 
    category: "restaurant",
    variations: ["Alain Ducasse", "Ducasse Dorchester"]
  },
  { 
    name: "Kai Mayfair", 
    url: "https://www.kaimayfair.co.uk/", 
    category: "restaurant",
    variations: ["Kai Restaurant"]
  },
  { 
    name: "Galvin La Chapelle", 
    url: "https://galvinrestaurants.com/restaurant/galvin-la-chapelle/", 
    category: "restaurant",
    variations: ["Galvin La Chapelle"]
  },

  // Cultural Venues & Museums
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
    category: "museum",
    variations: ["Tate Modern Gallery"]
  },
  { 
    name: "National Gallery", 
    url: "https://www.nationalgallery.org.uk/", 
    category: "museum",
    variations: ["National Gallery London"]
  },
  { 
    name: "British Museum", 
    url: "https://www.britishmuseum.org/", 
    category: "museum",
    variations: ["The British Museum"]
  },
  { 
    name: "Victoria and Albert Museum", 
    url: "https://www.vam.ac.uk/", 
    category: "museum",
    variations: ["V&A", "V&A Museum", "Victoria & Albert"]
  },
  { 
    name: "Natural History Museum", 
    url: "https://www.nhm.ac.uk/", 
    category: "museum",
    variations: ["NHM", "Natural History Museum London"]
  },
  { 
    name: "Science Museum", 
    url: "https://www.sciencemuseum.org.uk/", 
    category: "museum",
    variations: ["Science Museum London"]
  },

  // West End Theatres
  { 
    name: "London Palladium", 
    url: "https://www.lwtheatres.co.uk/theatres/london-palladium/", 
    category: "theatre",
    variations: ["The Palladium"]
  },
  { 
    name: "Apollo Victoria Theatre", 
    url: "https://www.apollovictoriatheatre.com/", 
    category: "theatre",
    variations: ["Apollo Victoria"]
  },
  { 
    name: "Theatre Royal Drury Lane", 
    url: "https://www.theatreroyaldruylane.com/", 
    category: "theatre",
    variations: ["Drury Lane", "Theatre Royal"]
  },
  { 
    name: "Royal Albert Hall", 
    url: "https://www.royalalberthall.com/", 
    category: "theatre",
    variations: ["Albert Hall"]
  },

  // Historic Sites
  { 
    name: "Tower of London", 
    url: "https://www.hrp.org.uk/tower-of-london/", 
    category: "historic",
    variations: ["The Tower of London"]
  },
  { 
    name: "Tower Bridge", 
    url: "https://www.towerbridge.org.uk/", 
    category: "historic",
    variations: ["London Bridge"]
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
  { 
    name: "Big Ben", 
    url: "https://www.parliament.uk/bigben", 
    category: "historic",
    variations: ["Elizabeth Tower"]
  },
  { 
    name: "Houses of Parliament", 
    url: "https://www.parliament.uk/", 
    category: "historic",
    variations: ["Westminster Palace", "Palace of Westminster"]
  },

  // Royal Parks
  { 
    name: "Hyde Park", 
    url: "https://www.royalparks.org.uk/parks/hyde-park", 
    category: "park",
    variations: ["Hyde Park London"]
  },
  { 
    name: "Regent's Park", 
    url: "https://www.royalparks.org.uk/parks/the-regents-park", 
    category: "park",
    variations: ["Regents Park"]
  },
  { 
    name: "Greenwich Park", 
    url: "https://www.royalparks.org.uk/parks/greenwich-park", 
    category: "park",
    variations: ["Greenwich Royal Park"]
  },
  { 
    name: "St James's Park", 
    url: "https://www.royalparks.org.uk/parks/st-jamess-park", 
    category: "park",
    variations: ["St James Park"]
  },
  { 
    name: "Kensington Gardens", 
    url: "https://www.royalparks.org.uk/parks/kensington-gardens", 
    category: "park",
    variations: ["Kensington Gardens London"]
  },

  // Transport Hubs
  { 
    name: "Paddington Station", 
    url: "https://www.networkrail.co.uk/running-the-railway/our-routes/western/paddington-station/", 
    category: "transport",
    variations: ["Paddington", "London Paddington"]
  },
  { 
    name: "King's Cross Station", 
    url: "https://www.kingscross.co.uk/", 
    category: "transport",
    variations: ["Kings Cross", "King's Cross"]
  },
  { 
    name: "Victoria Station", 
    url: "https://www.networkrail.co.uk/running-the-railway/our-routes/southern/victoria-station/", 
    category: "transport",
    variations: ["London Victoria"]
  },
  { 
    name: "Heathrow Airport", 
    url: "https://www.heathrow.com/", 
    category: "transport",
    variations: ["LHR", "Heathrow"]
  },
  { 
    name: "Gatwick Airport", 
    url: "https://www.gatwickairport.com/", 
    category: "transport",
    variations: ["LGW", "Gatwick"]
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

  // Thames Experiences
  { 
    name: "Thames Clippers", 
    url: "https://www.thamesclippers.com/", 
    category: "transport",
    variations: ["Thames Clipper", "River Bus"]
  },
  { 
    name: "London Eye", 
    url: "https://www.londoneye.com/", 
    category: "attraction",
    variations: ["Millennium Wheel"]
  },
  { 
    name: "HMS Belfast", 
    url: "https://www.iwm.org.uk/visits/hms-belfast", 
    category: "attraction",
    variations: ["HMS Belfast Museum"]
  },

  // London Areas & Districts
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
  },
  { 
    name: "Knightsbridge", 
    url: "https://en.wikipedia.org/wiki/Knightsbridge", 
    category: "area",
    variations: ["Knightsbridge London"]
  },
  { 
    name: "Belgravia", 
    url: "https://en.wikipedia.org/wiki/Belgravia", 
    category: "area",
    variations: ["Belgravia London"]
  },
  { 
    name: "Chelsea", 
    url: "https://en.wikipedia.org/wiki/Chelsea,_London", 
    category: "area",
    variations: ["Chelsea London"]
  },
  { 
    name: "Kensington", 
    url: "https://en.wikipedia.org/wiki/Kensington", 
    category: "area",
    variations: ["Kensington London"]
  },
  { 
    name: "South Kensington", 
    url: "https://en.wikipedia.org/wiki/South_Kensington", 
    category: "area",
    variations: ["South Ken"]
  },
  { 
    name: "Fitzrovia", 
    url: "https://en.wikipedia.org/wiki/Fitzrovia", 
    category: "area",
    variations: ["Fitzrovia London"]
  },
  { 
    name: "St James's", 
    url: "https://en.wikipedia.org/wiki/St_James%27s", 
    category: "area",
    variations: ["St James", "Saint James"]
  },
  { 
    name: "Soho", 
    url: "https://en.wikipedia.org/wiki/Soho", 
    category: "area",
    variations: ["Soho London"]
  },
  { 
    name: "The City", 
    url: "https://en.wikipedia.org/wiki/City_of_London", 
    category: "area",
    variations: ["City of London", "Square Mile"]
  },
  { 
    name: "Canary Wharf", 
    url: "https://canarywharf.com/", 
    category: "area",
    variations: ["Canary Wharf London"]
  },
  { 
    name: "South Bank", 
    url: "https://www.southbanklondon.com/", 
    category: "area",
    variations: ["Southbank", "South Bank London"]
  },

  // Countryside Areas
  { 
    name: "Surrey", 
    url: "https://en.wikipedia.org/wiki/Surrey", 
    category: "area",
    variations: ["Surrey County"]
  },
  { 
    name: "Hampshire", 
    url: "https://en.wikipedia.org/wiki/Hampshire", 
    category: "area",
    variations: ["Hampshire County"]
  },
  { 
    name: "Oxfordshire", 
    url: "https://en.wikipedia.org/wiki/Oxfordshire", 
    category: "area",
    variations: ["Oxfordshire County"]
  },
  { 
    name: "Berkshire", 
    url: "https://en.wikipedia.org/wiki/Berkshire", 
    category: "area",
    variations: ["Berkshire County"]
  },
  { 
    name: "Windsor", 
    url: "https://www.windsor.gov.uk/", 
    category: "area",
    variations: ["Windsor Castle", "Royal Windsor"]
  },
  { 
    name: "Oxford", 
    url: "https://www.oxford.gov.uk/", 
    category: "area",
    variations: ["Oxford City"]
  },
  { 
    name: "Cambridge", 
    url: "https://www.cambridge.gov.uk/", 
    category: "area",
    variations: ["Cambridge City"]
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
    case 'spa':
      return `${baseClasses} entity-link-spa`;
    case 'boutique':
      return `${baseClasses} entity-link-boutique`;
    case 'club':
      return `${baseClasses} entity-link-club`;
    case 'culture':
      return `${baseClasses} entity-link-culture`;
    case 'museum':
      return `${baseClasses} entity-link-museum`;
    case 'theatre':
      return `${baseClasses} entity-link-theatre`;
    case 'historic':
      return `${baseClasses} entity-link-historic`;
    case 'event':
      return `${baseClasses} entity-link-event`;
    case 'area':
      return `${baseClasses} entity-link-area`;
    case 'transport':
      return `${baseClasses} entity-link-transport`;
    case 'park':
      return `${baseClasses} entity-link-park`;
    case 'attraction':
      return `${baseClasses} entity-link-attraction`;
    default:
      return baseClasses;
  }
};

export { entityDatabase };