interface EntityLink {
  name: string;
  variations: string[];
  url: string;
  category: 'restaurant' | 'hotel' | 'area' | 'gallery' | 'club' | 'event' | 'shopping' | 'transport' | 'experience' | 'venue';
  priority: number; // 1-10, higher = more important
}

const entities: EntityLink[] = [
  // Luxury Hotels
  {
    name: 'The Ritz London',
    variations: ['The Ritz', 'Ritz London', 'Ritz Hotel'],
    url: 'https://www.theritzlondon.com',
    category: 'hotel',
    priority: 10
  },
  {
    name: 'Claridge\'s',
    variations: ['Claridges', 'Claridge\'s Hotel'],
    url: 'https://www.claridges.co.uk',
    category: 'hotel',
    priority: 10
  },
  {
    name: 'The Savoy',
    variations: ['Savoy Hotel', 'The Savoy Hotel'],
    url: 'https://www.thesavoylondon.com',
    category: 'hotel',
    priority: 10
  },
  {
    name: 'The Lanesborough',
    variations: ['Lanesborough Hotel', 'Lanesborough'],
    url: 'https://www.oetkercollection.com/hotels/the-lanesborough',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'The Berkeley',
    variations: ['Berkeley Hotel'],
    url: 'https://www.the-berkeley.co.uk',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'Shangri-La The Shard',
    variations: ['Shangri-La', 'Shangri La The Shard', 'Shangri-La London'],
    url: 'https://www.shangri-la.com/london/shangrila',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'The Ned',
    variations: ['Ned Hotel'],
    url: 'https://www.thened.com',
    category: 'hotel',
    priority: 8
  },
  {
    name: 'Four Seasons Hampshire',
    variations: ['Four Seasons', 'Four Seasons Hotel Hampshire'],
    url: 'https://www.fourseasons.com/hampshire',
    category: 'hotel',
    priority: 8
  },

  // Fine Dining Restaurants
  {
    name: 'Sketch',
    variations: ['Sketch Restaurant', 'Sketch London'],
    url: 'https://sketch.london',
    category: 'restaurant',
    priority: 10
  },
  {
    name: 'Core by Clare Smyth',
    variations: ['Core', 'Core Restaurant'],
    url: 'https://corebyclaresmyth.com',
    category: 'restaurant',
    priority: 10
  },
  {
    name: 'Restaurant Gordon Ramsay',
    variations: ['Gordon Ramsay Restaurant', 'Gordon Ramsay Royal Hospital Road'],
    url: 'https://www.gordonramsayrestaurants.com/restaurant-gordon-ramsay',
    category: 'restaurant',
    priority: 10
  },
  {
    name: 'Aqua Shard',
    variations: ['Aqua Restaurant'],
    url: 'https://www.aquashard.co.uk',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Pétrus by Gordon Ramsay',
    variations: ['Petrus', 'Pétrus'],
    url: 'https://www.gordonramsayrestaurants.com/petrus',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Amaya',
    variations: ['Amaya Restaurant'],
    url: 'https://www.amaya.biz',
    category: 'restaurant',
    priority: 8
  },
  {
    name: 'Bluebird Chelsea',
    variations: ['Bluebird', 'Bluebird Restaurant'],
    url: 'https://www.bluebird-restaurant.co.uk',
    category: 'restaurant',
    priority: 8
  },
  {
    name: 'Zuma',
    variations: ['Zuma Restaurant', 'Zuma London'],
    url: 'https://zumarestaurant.com/zuma-landing/london',
    category: 'restaurant',
    priority: 8
  },

  // Luxury Shopping
  {
    name: 'Harrods',
    variations: ['Harrods Department Store', 'Harrods Food Hall'],
    url: 'https://www.harrods.com',
    category: 'shopping',
    priority: 10
  },
  {
    name: 'Selfridges',
    variations: ['Selfridges & Co', 'Selfridges Department Store'],
    url: 'https://www.selfridges.com',
    category: 'shopping',
    priority: 10
  },
  {
    name: 'Harvey Nichols',
    variations: ['Harvey Nichols London', 'Harvey Nics'],
    url: 'https://www.harveynichols.com',
    category: 'shopping',
    priority: 9
  },
  {
    name: 'Bond Street',
    variations: ['New Bond Street', 'Old Bond Street'],
    url: 'https://www.newbondstreet.com',
    category: 'shopping',
    priority: 9
  },
  {
    name: 'Sloane Street',
    variations: ['Sloane St'],
    url: 'https://en.wikipedia.org/wiki/Sloane_Street',
    category: 'shopping',
    priority: 8
  },

  // Premium London Areas
  {
    name: 'Mayfair',
    variations: ['Mayfair District', 'Mayfair London'],
    url: 'https://en.wikipedia.org/wiki/Mayfair',
    category: 'area',
    priority: 10
  },
  {
    name: 'Belgravia',
    variations: ['Belgravia District'],
    url: 'https://en.wikipedia.org/wiki/Belgravia',
    category: 'area',
    priority: 9
  },
  {
    name: 'Chelsea',
    variations: ['Chelsea London', 'Chelsea District'],
    url: 'https://en.wikipedia.org/wiki/Chelsea,_London',
    category: 'area',
    priority: 9
  },
  {
    name: 'Knightsbridge',
    variations: ['Knightsbridge London'],
    url: 'https://en.wikipedia.org/wiki/Knightsbridge',
    category: 'area',
    priority: 9
  },
  {
    name: 'Notting Hill',
    variations: ['Notting Hill London'],
    url: 'https://en.wikipedia.org/wiki/Notting_Hill',
    category: 'area',
    priority: 8
  },
  {
    name: 'Covent Garden',
    variations: ['Covent Garden Market', 'Covent Garden London'],
    url: 'https://www.coventgarden.london',
    category: 'area',
    priority: 8
  },
  {
    name: 'Soho',
    variations: ['Soho London', 'Soho District'],
    url: 'https://en.wikipedia.org/wiki/Soho',
    category: 'area',
    priority: 8
  },
  {
    name: 'South Kensington',
    variations: ['South Ken'],
    url: 'https://en.wikipedia.org/wiki/South_Kensington',
    category: 'area',
    priority: 7
  },
  {
    name: 'Canary Wharf',
    variations: ['Canary Wharf London'],
    url: 'https://canarywharf.com',
    category: 'area',
    priority: 7
  },

  // Cultural Venues & Galleries
  {
    name: 'Saatchi Gallery',
    variations: ['Saatchi', 'Saatchi Gallery Chelsea'],
    url: 'https://www.saatchigallery.com',
    category: 'gallery',
    priority: 9
  },
  {
    name: 'Tate Modern',
    variations: ['Tate Modern Gallery'],
    url: 'https://www.tate.org.uk/visit/tate-modern',
    category: 'gallery',
    priority: 9
  },
  {
    name: 'National Gallery',
    variations: ['National Gallery London'],
    url: 'https://www.nationalgallery.org.uk',
    category: 'gallery',
    priority: 9
  },
  {
    name: 'V&A Museum',
    variations: ['Victoria and Albert Museum', 'V&A', 'Victoria & Albert Museum'],
    url: 'https://www.vam.ac.uk',
    category: 'gallery',
    priority: 8
  },
  {
    name: 'British Museum',
    variations: ['British Museum London'],
    url: 'https://www.britishmuseum.org',
    category: 'gallery',
    priority: 8
  },
  {
    name: 'White Cube',
    variations: ['White Cube Gallery'],
    url: 'https://whitecube.com',
    category: 'gallery',
    priority: 7
  },

  // Exclusive Clubs & Venues
  {
    name: 'Soho House',
    variations: ['Soho House London', 'Soho House Group'],
    url: 'https://www.sohohouse.com',
    category: 'club',
    priority: 8
  },
  {
    name: 'The Arts Club',
    variations: ['Arts Club', 'The Arts Club Mayfair'],
    url: 'https://theartsclub.co.uk',
    category: 'club',
    priority: 7
  },
  {
    name: 'Royal Thames Yacht Club',
    variations: ['RTYC', 'Royal Thames'],
    url: 'https://www.rtyc.org',
    category: 'club',
    priority: 7
  },

  // Major Events & Experiences
  {
    name: 'Wimbledon Championships',
    variations: ['Wimbledon', 'Wimbledon Tennis', 'The Championships'],
    url: 'https://www.wimbledon.com',
    category: 'event',
    priority: 10
  },
  {
    name: 'Royal Ascot',
    variations: ['Ascot', 'Royal Ascot Races'],
    url: 'https://www.ascot.co.uk',
    category: 'event',
    priority: 9
  },
  {
    name: 'Chelsea Flower Show',
    variations: ['RHS Chelsea Flower Show', 'Chelsea Flower Show RHS'],
    url: 'https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show',
    category: 'event',
    priority: 8
  },
  {
    name: 'London Fashion Week',
    variations: ['LFW', 'Fashion Week London'],
    url: 'https://www.londonfashionweek.co.uk',
    category: 'event',
    priority: 8
  },
  {
    name: 'Henley Royal Regatta',
    variations: ['Henley Regatta', 'Henley Royal'],
    url: 'https://www.hrr.co.uk',
    category: 'event',
    priority: 7
  },

  // Transport & Infrastructure
  {
    name: 'Victoria Station',
    variations: ['London Victoria', 'Victoria Railway Station'],
    url: 'https://tfl.gov.uk/tube-dlr-overground/travel-information/stations/victoria',
    category: 'transport',
    priority: 7
  },
  {
    name: 'Paddington Station',
    variations: ['London Paddington', 'Paddington Railway Station'],
    url: 'https://tfl.gov.uk/modes/rail/national-rail/london-paddington',
    category: 'transport',
    priority: 7
  },
  {
    name: 'King\'s Cross',
    variations: ['Kings Cross', 'King\'s Cross Station'],
    url: 'https://tfl.gov.uk/tube-dlr-overground/travel-information/stations/kings-cross-st-pancras',
    category: 'transport',
    priority: 7
  },
  {
    name: 'Heathrow Airport',
    variations: ['Heathrow', 'LHR', 'London Heathrow'],
    url: 'https://www.heathrow.com',
    category: 'transport',
    priority: 8
  },
  {
    name: 'Hyde Park Corner',
    variations: ['Hyde Park Corner Station'],
    url: 'https://tfl.gov.uk/tube-dlr-overground/travel-information/stations/hyde-park-corner',
    category: 'transport',
    priority: 6
  },

  // Luxury Experiences & Venues
  {
    name: 'The Shard',
    variations: ['Shard London', 'London Bridge Shard'],
    url: 'https://www.the-shard.com',
    category: 'experience',
    priority: 9
  },
  {
    name: 'London Eye',
    variations: ['Millennium Wheel', 'London Eye Wheel'],
    url: 'https://www.londoneye.com',
    category: 'experience',
    priority: 8
  },
  {
    name: 'Tower of London',
    variations: ['Tower London', 'HM Tower of London'],
    url: 'https://www.hrp.org.uk/tower-of-london',
    category: 'experience',
    priority: 8
  },
  {
    name: 'Westminster Abbey',
    variations: ['Westminster Abbey London'],
    url: 'https://www.westminster-abbey.org',
    category: 'experience',
    priority: 8
  },
  {
    name: 'Buckingham Palace',
    variations: ['Buckingham Palace London', 'The Palace'],
    url: 'https://www.rct.uk/visit/buckingham-palace',
    category: 'experience',
    priority: 8
  },

  // Exclusive Spas & Wellness
  {
    name: 'ESPA at Corinthia',
    variations: ['ESPA Corinthia', 'Corinthia Spa', 'Spa Corinthia', 'ESPA', 'Corinthia Hotel Spa'],
    url: 'https://www.corinthia.com/london/spa',
    category: 'experience',
    priority: 8
  },
  {
    name: 'The Berkeley Spa',
    variations: ['Berkeley Health Club & Spa', 'Berkeley Spa', 'Spa at Berkeley'],
    url: 'https://www.the-berkeley.co.uk/health-club-spa',
    category: 'experience',
    priority: 7
  },
  {
    name: 'Akasha at Hotel Café Royal',
    variations: ['Akasha Spa', 'Hotel Café Royal Spa', 'Akasha', 'Café Royal Spa'],
    url: 'https://www.hotelcaferoyal.com/wellness/akasha-holistic-wellbeing',
    category: 'experience',
    priority: 7
  },

  // Additional Luxury Hotels
  {
    name: 'Hotel Café Royal',
    variations: ['Café Royal', 'Hotel Cafe Royal'],
    url: 'https://www.hotelcaferoyal.com',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'Corinthia London',
    variations: ['Corinthia Hotel', 'The Corinthia'],
    url: 'https://www.corinthia.com/london',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'The Langham London',
    variations: ['The Langham', 'Langham Hotel'],
    url: 'https://www.langhamhotels.com/en/the-langham/london',
    category: 'hotel',
    priority: 8
  },
  {
    name: 'The Connaught',
    variations: ['Connaught Hotel'],
    url: 'https://www.the-connaught.co.uk',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'Brown\'s Hotel',
    variations: ['Browns Hotel', 'Brown\'s'],
    url: 'https://www.roccofortehotels.com/hotels-and-resorts/browns-hotel',
    category: 'hotel',
    priority: 8
  },
  {
    name: 'The Dorchester',
    variations: ['Dorchester Hotel'],
    url: 'https://www.dorchestercollection.com/en/london/the-dorchester',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'Mandarin Oriental Hyde Park',
    variations: ['Mandarin Oriental', 'Mandarin Oriental London'],
    url: 'https://www.mandarinoriental.com/london/hyde-park',
    category: 'hotel',
    priority: 9
  },
  {
    name: 'Park Lane Hotel',
    variations: ['The Park Lane Hotel'],
    url: 'https://www.parklane.co.uk',
    category: 'hotel',
    priority: 7
  },
  {
    name: 'The Goring',
    variations: ['Goring Hotel'],
    url: 'https://www.thegoring.com',
    category: 'hotel',
    priority: 8
  },
  {
    name: 'Rosewood London',
    variations: ['Rosewood Hotel'],
    url: 'https://www.rosewoodhotels.com/en/london',
    category: 'hotel',
    priority: 8
  },

  // Additional Fine Dining
  {
    name: 'Alain Ducasse at The Dorchester',
    variations: ['Alain Ducasse', 'Ducasse Dorchester'],
    url: 'https://www.dorchestercollection.com/en/london/the-dorchester/restaurants-bars/alain-ducasse',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Hélène Darroze at The Connaught',
    variations: ['Helene Darroze', 'Darroze Connaught'],
    url: 'https://www.the-connaught.co.uk/restaurants-bars/helene-darroze',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Nobu London',
    variations: ['Nobu', 'Nobu Berkeley Street'],
    url: 'https://www.noburestaurants.com/london/berkeley-street',
    category: 'restaurant',
    priority: 8
  },
  {
    name: 'The Ledbury',
    variations: ['Ledbury Restaurant'],
    url: 'https://www.theledbury.com',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Dinner by Heston Blumenthal',
    variations: ['Dinner Heston', 'Heston Blumenthal Restaurant'],
    url: 'https://www.dinnerbyheston.com',
    category: 'restaurant',
    priority: 9
  },
  {
    name: 'Fera at Claridge\'s',
    variations: ['Fera Restaurant', 'Fera Claridges'],
    url: 'https://www.claridges.co.uk/restaurants-bars/fera',
    category: 'restaurant',
    priority: 8
  },
  {
    name: 'Galvin La Chapelle',
    variations: ['La Chapelle', 'Galvin Restaurant'],
    url: 'https://galvinrestaurants.com/restaurant/galvin-la-chapelle',
    category: 'restaurant',
    priority: 8
  },
  {
    name: 'Rules Restaurant',
    variations: ['Rules', 'Rules London'],
    url: 'https://rules.co.uk',
    category: 'restaurant',
    priority: 7
  },
  {
    name: 'Simpson\'s in the Strand',
    variations: ['Simpsons Restaurant', 'Simpson\'s'],
    url: 'https://www.simpsonsinthestrand.co.uk',
    category: 'restaurant',
    priority: 7
  },

  // Additional Shopping & Fashion
  {
    name: 'Fortnum & Mason',
    variations: ['Fortnum and Mason', 'Fortnums', 'F&M'],
    url: 'https://www.fortnumandmason.com',
    category: 'shopping',
    priority: 9
  },
  {
    name: 'Liberty London',
    variations: ['Liberty', 'Liberty Department Store'],
    url: 'https://www.libertylondon.com',
    category: 'shopping',
    priority: 8
  },
  {
    name: 'King\'s Road',
    variations: ['Kings Road', 'King\'s Road Chelsea'],
    url: 'https://en.wikipedia.org/wiki/King%27s_Road',
    category: 'shopping',
    priority: 8
  },
  {
    name: 'Elizabeth Street',
    variations: ['Elizabeth St'],
    url: 'https://en.wikipedia.org/wiki/Elizabeth_Street,_London',
    category: 'shopping',
    priority: 7
  },
  {
    name: 'Motcomb Street',
    variations: ['Motcomb St'],
    url: 'https://en.wikipedia.org/wiki/Motcomb_Street',
    category: 'shopping',
    priority: 7
  },
  {
    name: 'Savile Row',
    variations: ['Savile Row London'],
    url: 'https://en.wikipedia.org/wiki/Savile_Row',
    category: 'shopping',
    priority: 8
  },
  {
    name: 'Jermyn Street',
    variations: ['Jermyn St'],
    url: 'https://en.wikipedia.org/wiki/Jermyn_Street',
    category: 'shopping',
    priority: 7
  },

  // Exclusive Venues & Experiences
  {
    name: 'Royal Opera House',
    variations: ['Covent Garden Opera House', 'ROH'],
    url: 'https://www.roh.org.uk',
    category: 'venue',
    priority: 9
  },
  {
    name: 'Royal Albert Hall',
    variations: ['Albert Hall'],
    url: 'https://www.royalalberthall.com',
    category: 'venue',
    priority: 8
  },
  {
    name: 'Barbican Centre',
    variations: ['Barbican', 'Barbican Theatre'],
    url: 'https://www.barbican.org.uk',
    category: 'venue',
    priority: 7
  },
  {
    name: 'The O2',
    variations: ['O2 Arena', 'O2 London'],
    url: 'https://www.theo2.co.uk',
    category: 'venue',
    priority: 7
  },
  {
    name: 'Ronnie Scott\'s',
    variations: ['Ronnie Scotts', 'Ronnie Scott\'s Jazz Club'],
    url: 'https://www.ronniescotts.co.uk',
    category: 'venue',
    priority: 7
  },

  // Private Members Clubs
  {
    name: 'Annabel\'s',
    variations: ['Annabels', 'Annabel\'s Mayfair'],
    url: 'https://annabels.co.uk',
    category: 'club',
    priority: 8
  },
  {
    name: '5 Hertford Street',
    variations: ['5 Hertford St', 'Hertford Street'],
    url: 'https://5hertfordstreet.com',
    category: 'club',
    priority: 7
  },
  {
    name: 'The Groucho Club',
    variations: ['Groucho Club'],
    url: 'https://www.thegrouchoclub.com',
    category: 'club',
    priority: 7
  },
  {
    name: 'White\'s Club',
    variations: ['Whites Club', 'White\'s'],
    url: 'https://en.wikipedia.org/wiki/White%27s',
    category: 'club',
    priority: 7
  },

  // Additional Transport
  {
    name: 'Gatwick Airport',
    variations: ['Gatwick', 'LGW', 'London Gatwick'],
    url: 'https://www.gatwickairport.com',
    category: 'transport',
    priority: 7
  },
  {
    name: 'London City Airport',
    variations: ['City Airport', 'LCY'],
    url: 'https://www.londoncityairport.com',
    category: 'transport',
    priority: 6
  },
  {
    name: 'St Pancras International',
    variations: ['St Pancras', 'Saint Pancras'],
    url: 'https://www.stpancras.com',
    category: 'transport',
    priority: 7
  },
  {
    name: 'Eurostar',
    variations: ['Eurostar Terminal'],
    url: 'https://www.eurostar.com',
    category: 'transport',
    priority: 7
  },

  // Premium Areas & Neighborhoods
  {
    name: 'Marylebone',
    variations: ['Marylebone Village'],
    url: 'https://en.wikipedia.org/wiki/Marylebone',
    category: 'area',
    priority: 7
  },
  {
    name: 'Fitzrovia',
    variations: ['Fitzrovia London'],
    url: 'https://en.wikipedia.org/wiki/Fitzrovia',
    category: 'area',
    priority: 6
  },
  {
    name: 'Bloomsbury',
    variations: ['Bloomsbury London'],
    url: 'https://en.wikipedia.org/wiki/Bloomsbury',
    category: 'area',
    priority: 6
  },
  {
    name: 'Pimlico',
    variations: ['Pimlico London'],
    url: 'https://en.wikipedia.org/wiki/Pimlico',
    category: 'area',
    priority: 6
  },
  {
    name: 'Little Venice',
    variations: ['Little Venice London'],
    url: 'https://en.wikipedia.org/wiki/Little_Venice',
    category: 'area',
    priority: 6
  }
];

export function processContentWithEntityLinks(content: string): string {
  let processedContent = content;
  const linkedEntities = new Set<string>();
  let linkCount = 0;
  const maxLinks = 60;

  // Sort entities by priority (highest first)
  const sortedEntities = [...entities].sort((a, b) => b.priority - a.priority);

  for (const entity of sortedEntities) {
    if (linkCount >= maxLinks) break;
    if (linkedEntities.has(entity.name)) continue;

    // Try main name first, then variations
    const namesToTry = [entity.name, ...entity.variations];
    
    for (const name of namesToTry) {
      // Create regex that matches the name as a whole word, case insensitive
      const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      
      // Check if this name exists in content and isn't already linked
      if (regex.test(processedContent) && !linkedEntities.has(entity.name)) {
        // Replace first occurrence only
        processedContent = processedContent.replace(regex, (match) => {
          // Don't link if already inside an anchor tag
          const beforeMatch = processedContent.substring(0, processedContent.indexOf(match));
          const openTags = (beforeMatch.match(/<a\b/gi) || []).length;
          const closeTags = (beforeMatch.match(/<\/a>/gi) || []).length;
          
          if (openTags > closeTags) {
            return match; // Inside an existing link
          }
          
          linkCount++;
          linkedEntities.add(entity.name);
          return `<a href="${entity.url}" target="_blank" rel="noopener noreferrer" class="text-black hover:text-gray-800 underline decoration-1 underline-offset-2 transition-colors">${match}</a>`;
        });
        break; // Move to next entity after successful linking
      }
    }
  }

  return processedContent;
}

export function getEntityLinkStats(content: string): { totalEntities: number; linkedEntities: number } {
  const linkedEntities = new Set<string>();
  let totalFound = 0;

  for (const entity of entities) {
    const namesToTry = [entity.name, ...entity.variations];
    
    for (const name of namesToTry) {
      const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      
      if (regex.test(content) && !linkedEntities.has(entity.name)) {
        totalFound++;
        linkedEntities.add(entity.name);
        break;
      }
    }
  }

  return {
    totalEntities: totalFound,
    linkedEntities: linkedEntities.size
  };
}