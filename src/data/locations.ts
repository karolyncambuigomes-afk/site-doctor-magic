export interface Location {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  postcodes: string[];
  nearbyLandmarks: string[];
}

export const locations: Location[] = [
  {
    id: "knightsbridge",
    name: "Knightsbridge",
    slug: "escorts-in-knightsbridge",
    description: "Premium escort services in the heart of Knightsbridge",
    content: `
      <p>Discover the finest escort services in Knightsbridge, one of London's most prestigious districts. Our carefully selected companions offer unparalleled elegance and sophistication for discerning clients.</p>
      
      <p>Located in the heart of Royal Borough of Kensington and Chelsea, Knightsbridge is renowned for its luxury shopping, world-class dining, and exclusive residences. Our escorts are perfectly suited to accompany you to:</p>
      
      <ul>
        <li>Harrods and luxury boutiques</li>
        <li>Fine dining at Michelin-starred restaurants</li>
        <li>Cultural events at nearby venues</li>
        <li>Private events and business meetings</li>
      </ul>
      
      <p>All our Knightsbridge escorts are sophisticated, intelligent, and well-versed in the social dynamics of this exclusive area. Whether you're visiting for business or pleasure, our companions will ensure your experience exceeds expectations.</p>
    `,
    seoTitle: "Elite Knightsbridge Escorts | Premium Companions SW1 SW3 | Five London",
    seoDescription: "Luxury escort services in Knightsbridge SW1, SW3. Elite companions near Harrods, Hyde Park Corner. Verified models available 24/7. Same-day booking.",
    keywords: ["knightsbridge escorts", "luxury escorts london sw1", "premium companionship", "knightsbridge companions", "harrods escorts", "sw3 escorts"],
    coordinates: {
      lat: 51.5007,
      lng: -0.1563
    },
    postcodes: ["SW1X", "SW3", "SW7"],
    nearbyLandmarks: ["Harrods", "Hyde Park Corner", "Sloane Street", "Brompton Road"]
  },
  {
    id: "mayfair",
    name: "Mayfair",
    slug: "escorts-in-mayfair",
    description: "Exclusive escort services in London's most elite district",
    content: `
      <p>Experience the epitome of luxury with our exclusive escort services in Mayfair, London's most prestigious and affluent district. Our elite companions embody the sophistication and refinement that Mayfair represents.</p>
      
      <p>Mayfair, situated in the City of Westminster, is synonymous with luxury, exclusivity, and high-end lifestyle. Our escorts are the perfect companions for:</p>
      
      <ul>
        <li>Exclusive events at prestigious venues</li>
        <li>Fine dining at world-renowned restaurants</li>
        <li>Art gallery openings and cultural events</li>
        <li>Business functions and networking events</li>
        <li>Private shopping experiences on Bond Street</li>
      </ul>
      
      <p>Our Mayfair escorts are selected for their intelligence, beauty, and ability to move seamlessly within the highest circles of London society. Each companion is educated, well-traveled, and possesses the social graces expected in such an exclusive environment.</p>
    `,
    seoTitle: "Luxury Mayfair Escorts | Elite Companions W1K W1J W1S | Five London",
    seoDescription: "Exclusive escort services in Mayfair W1. Sophisticated companions near Bond Street, Park Lane. Elite models for high-end events. Discreet luxury service.",
    keywords: ["mayfair escorts", "luxury escorts w1", "elite companions london", "mayfair companionship", "bond street escorts", "park lane escorts"],
    coordinates: {
      lat: 51.5088,
      lng: -0.1443
    },
    postcodes: ["W1K", "W1J", "W1S"],
    nearbyLandmarks: ["Bond Street", "Park Lane", "Grosvenor Square", "Berkeley Square"]
  },
  {
    id: "chelsea",
    name: "Chelsea",
    slug: "escorts-in-chelsea",
    description: "Sophisticated escort services in trendy Chelsea",
    content: `
      <p>Discover sophisticated escort services in Chelsea, one of London's most desirable and fashionable districts. Our elegant companions are perfectly suited to the trendy, artistic atmosphere that defines this iconic area.</p>
      
      <p>Chelsea, located in the Royal Borough of Kensington and Chelsea, is renowned for its chic boutiques, art galleries, and vibrant social scene. Our escorts excel at:</p>
      
      <ul>
        <li>Accompanying you to gallery openings and cultural events</li>
        <li>Fine dining at Chelsea's renowned restaurants</li>
        <li>Shopping experiences on King's Road</li>
        <li>Social events and private parties</li>
        <li>Riverside walks along the Thames</li>
      </ul>
      
      <p>Our Chelsea escorts combine beauty with intelligence, offering engaging conversation and sophisticated companionship. They understand the area's unique character and can enhance any experience in this culturally rich district.</p>
    `,
    seoTitle: "Chelsea Escorts | Sophisticated Companions SW3 SW10 | Five London",
    seoDescription: "Elite escort services in Chelsea SW3, SW10. Cultured companions near King's Road, Sloane Square. Professional models for cultural events & dining.",
    keywords: ["chelsea escorts", "sophisticated escorts london sw3", "chelsea companions", "elegant escort services", "kings road escorts", "sloane square escorts"],
    coordinates: {
      lat: 51.4875,
      lng: -0.1687
    },
    postcodes: ["SW3", "SW10"],
    nearbyLandmarks: ["King's Road", "Sloane Square", "Chelsea Embankment", "Saatchi Gallery"]
  },
  {
    id: "belgravia",
    name: "Belgravia",
    slug: "escorts-in-belgravia",
    description: "Refined escort services in exclusive Belgravia",
    content: `
      <p>Experience refined escort services in Belgravia, one of London's most exclusive residential areas. Our distinguished companions offer the utmost discretion and elegance in this prestigious district.</p>
      
      <p>Belgravia, known for its grand Georgian architecture and exclusive atmosphere, attracts discerning individuals who appreciate the finer things in life. Our escorts provide:</p>
      
      <ul>
        <li>Discreet companionship for private events</li>
        <li>Elegant accompaniment to fine dining establishments</li>
        <li>Cultural excursions to nearby attractions</li>
        <li>Professional support for business engagements</li>
        <li>Sophisticated conversation and company</li>
      </ul>
      
      <p>Our Belgravia escorts are selected for their refinement, education, and ability to provide exceptional companionship in this most exclusive of London districts.</p>
    `,
    seoTitle: "Belgravia Escorts | Refined Companions SW1X SW1W | Five London",
    seoDescription: "Exclusive escort services in Belgravia SW1. Refined companions near Victoria, Eaton Square. Discreet elite models for prestigious residential area.",
    keywords: ["belgravia escorts", "exclusive escorts london sw1", "refined companionship", "belgravia companions", "victoria escorts", "eaton square escorts"],
    coordinates: {
      lat: 51.4957,
      lng: -0.1447
    },
    postcodes: ["SW1X", "SW1W"],
    nearbyLandmarks: ["Eaton Square", "Victoria Station", "Buckingham Palace Gardens", "Wellington Arch"]
  },
  {
    id: "kensington",
    name: "Kensington",
    slug: "escorts-in-kensington",
    description: "Cultured escort services in historic Kensington",
    content: `
      <p>Discover cultured escort services in Kensington, a district steeped in history and renowned for its cultural attractions. Our intelligent companions are perfect for exploring this fascinating area of London.</p>
      
      <p>Kensington, home to world-famous museums and royal residences, offers a unique blend of culture and sophistication. Our escorts excel at:</p>
      
      <ul>
        <li>Cultural visits to museums and exhibitions</li>
        <li>Elegant dining experiences</li>
        <li>Shopping at Kensington's boutiques</li>
        <li>Walks through Kensington Gardens</li>
        <li>Attending concerts and cultural events</li>
      </ul>
      
      <p>Our Kensington escorts are cultured, well-educated, and passionate about the arts. They make ideal companions for anyone seeking to experience the rich cultural heritage of this remarkable district.</p>
    `,
    seoTitle: "Kensington Escorts | Cultured Companions W8 SW7 | Five London", 
    seoDescription: "Premium escort services in Kensington W8, SW7. Cultured companions near museums, galleries. Elite models for cultural events & sophisticated dining.",
    keywords: ["kensington escorts", "cultured escorts london w8", "museum companions", "kensington companionship", "south kensington escorts", "cultural escorts"],
    coordinates: {
      lat: 51.5047,
      lng: -0.1931
    },
    postcodes: ["W8", "SW7"],
    nearbyLandmarks: ["Kensington Palace", "Hyde Park", "Royal Albert Hall", "Natural History Museum"]
  },
  {
    id: "canary-wharf",
    name: "Canary Wharf",
    slug: "escorts-in-canary-wharf",
    description: "Professional escort services in London's financial district",
    content: `
      <p>Professional escort services in Canary Wharf, London's premier financial district. Our sophisticated companions understand the demands of the business world and provide exceptional support for professional engagements.</p>
      
      <p>Canary Wharf, as London's financial powerhouse, requires companions who can navigate the corporate environment with ease. Our escorts provide:</p>
      
      <ul>
        <li>Professional accompaniment to business events</li>
        <li>Sophisticated company for corporate dinners</li>
        <li>Elegant presence at networking functions</li>
        <li>Discreet support for client entertainment</li>
        <li>Intelligent conversation on current affairs</li>
      </ul>
      
      <p>Our Canary Wharf escorts are selected for their professionalism, intelligence, and ability to conduct themselves impeccably in high-stakes business environments.</p>
    `,
    seoTitle: "Canary Wharf Escorts | Professional Companions E14 | Five London",
    seoDescription: "Elite escort services in Canary Wharf E14. Professional companions for business events, corporate dining. Sophisticated models available 24/7.",
    keywords: ["canary wharf escorts", "business escorts london e14", "corporate companions", "professional escort services", "financial district escorts", "city escorts"],
    coordinates: {
      lat: 51.5054,
      lng: -0.0235
    },
    postcodes: ["E14", "E1W"],
    nearbyLandmarks: ["One Canada Square", "Canary Wharf Station", "West India Quay", "Greenwich Observatory"]
  },
  {
    id: "notting-hill",
    name: "Notting Hill",
    slug: "escorts-in-notting-hill",
    description: "Charming escort services in vibrant Notting Hill",
    content: `
      <p>Experience charming escort services in Notting Hill, one of London's most vibrant and eclectic districts. Our stylish companions perfectly complement the bohemian and cosmopolitan atmosphere of this iconic area.</p>
      
      <p>Notting Hill, famous for its colorful houses, antique markets, and lively cultural scene, offers unique experiences. Our escorts are ideal for:</p>
      
      <ul>
        <li>Exploring Portobello Road Market</li>
        <li>Dining at trendy restaurants and gastropubs</li>
        <li>Attending carnival events and festivals</li>
        <li>Visiting vintage shops and boutiques</li>
        <li>Enjoying the local nightlife scene</li>
      </ul>
      
      <p>Our Notting Hill escorts are creative, free-spirited, and embrace the area's artistic energy while maintaining the highest standards of sophistication.</p>
    `,
    seoTitle: "Notting Hill Escorts | Stylish Companions W11 W2 | Five London",
    seoDescription: "Vibrant escort services in Notting Hill W11, W2. Creative companions near Portobello Market. Bohemian escorts for festivals & cultural events.",
    keywords: ["notting hill escorts", "vibrant escorts london w11", "creative companions", "portobello escorts", "carnival escorts", "bohemian companions"],
    coordinates: {
      lat: 51.5152,
      lng: -0.2003
    },
    postcodes: ["W11", "W2"],
    nearbyLandmarks: ["Portobello Road", "Notting Hill Gate", "Hyde Park", "Westbourne Grove"]
  },
  {
    id: "covent-garden",
    name: "Covent Garden",
    slug: "escorts-in-covent-garden",
    description: "Entertaining escort services in lively Covent Garden",
    content: `
      <p>Discover entertaining escort services in Covent Garden, London's premier entertainment district. Our vivacious companions are perfect for experiencing the theaters, restaurants, and vibrant street performances that define this cultural hub.</p>
      
      <p>Covent Garden, renowned for its world-class theaters and bustling market atmosphere, offers endless entertainment options. Our escorts excel at:</p>
      
      <ul>
        <li>Theater visits and West End shows</li>
        <li>Fine dining at acclaimed restaurants</li>
        <li>Shopping at unique boutiques and markets</li>
        <li>Enjoying street performances and entertainment</li>
        <li>Experiencing the vibrant nightlife</li>
      </ul>
      
      <p>Our Covent Garden escorts are cultured, entertaining, and well-versed in the arts, making them ideal companions for this theatrical district.</p>
    `,
    seoTitle: "Covent Garden Escorts | Entertaining Companions WC2 | Five London",
    seoDescription: "Premium escort services in Covent Garden WC2. Cultured companions for theater, dining, shopping. West End escorts available same-day.",
    keywords: ["covent garden escorts", "theater escorts london wc2", "entertainment companions", "west end escorts", "opera escorts", "cultural companions"],
    coordinates: {
      lat: 51.5118,
      lng: -0.1226
    },
    postcodes: ["WC2E", "WC2H"],
    nearbyLandmarks: ["Royal Opera House", "Covent Garden Market", "Leicester Square", "Strand"]
  },
  {
    id: "shoreditch",
    name: "Shoreditch",
    slug: "escorts-in-shoreditch",
    description: "Trendy escort services in creative Shoreditch",
    content: `
      <p>Experience trendy escort services in Shoreditch, London's creative and artistic quarter. Our contemporary companions embody the innovative spirit and cutting-edge culture that makes this district so unique.</p>
      
      <p>Shoreditch, known for its street art, independent galleries, and avant-garde scene, attracts creative minds from around the world. Our escorts are perfect for:</p>
      
      <ul>
        <li>Gallery hopping and art exhibitions</li>
        <li>Exploring the vibrant street art scene</li>
        <li>Dining at innovative restaurants</li>
        <li>Experiencing the dynamic nightlife</li>
        <li>Attending creative events and launches</li>
      </ul>
      
      <p>Our Shoreditch escorts are artistic, contemporary, and embrace the district's creative energy while providing sophisticated companionship.</p>
    `,
    seoTitle: "Shoreditch Escorts | Creative Companions E1 E2 | Five London",
    seoDescription: "Contemporary escort services in Shoreditch E1, E2. Artistic companions for galleries, street art tours. Creative escorts for innovative experiences.",
    keywords: ["shoreditch escorts", "creative escorts london e1", "artistic companions", "contemporary escort services", "street art escorts", "gallery companions"],
    coordinates: {
      lat: 51.5257,
      lng: -0.0781
    },
    postcodes: ["E1", "E2"],
    nearbyLandmarks: ["Brick Lane", "Old Street", "Hoxton Square", "Boxpark Shoreditch"]
  },
  {
    id: "marylebone",
    name: "Marylebone",
    slug: "escorts-in-marylebone",
    description: "Sophisticated escort services in charming Marylebone",
    content: `
      <p>Discover sophisticated escort services in Marylebone, a charming district that perfectly balances village-like tranquility with urban sophistication. Our refined companions are ideal for exploring this delightful area of central London.</p>
      
      <p>Marylebone, with its Georgian architecture and boutique shopping, offers a more intimate London experience. Our escorts are perfect for:</p>
      
      <ul>
        <li>Shopping on Marylebone High Street</li>
        <li>Dining at cozy restaurants and cafes</li>
        <li>Visiting cultural attractions and museums</li>
        <li>Exploring charming residential streets</li>
        <li>Enjoying the relaxed atmosphere</li>
      </ul>
      
      <p>Our Marylebone escorts are sophisticated yet approachable, perfectly matching the district's blend of elegance and warmth.</p>
    `,
    seoTitle: "Marylebone Escorts | Sophisticated Companions W1U NW1 | Five London",
    seoDescription: "Refined escort services in Marylebone W1U, NW1. Sophisticated companions for boutique shopping, dining. Village atmosphere in central London.",
    keywords: ["marylebone escorts", "sophisticated escorts london w1u", "boutique escorts", "marylebone companions", "fitzrovia escorts", "village london escorts"],
    coordinates: {
      lat: 51.5186,
      lng: -0.1492
    },
    postcodes: ["W1U", "NW1"],
    nearbyLandmarks: ["Marylebone High Street", "Baker Street", "Regent's Park", "Madame Tussauds"]
  },
  {
    id: "fitzrovia",
    name: "Fitzrovia",
    slug: "escorts-in-fitzrovia",
    description: "Intellectual escort services in literary Fitzrovia",
    content: `
      <p>Experience intellectual escort services in Fitzrovia, a district with a rich literary and artistic heritage. Our cultured companions appreciate the area's bohemian history and contemporary cultural significance.</p>
      
      <p>Fitzrovia, historically home to writers, artists, and intellectuals, maintains its reputation as a center of culture and creativity. Our escorts are ideal for:</p>
      
      <ul>
        <li>Literary walks and historical tours</li>
        <li>Dining at traditional pubs and modern restaurants</li>
        <li>Visiting galleries and cultural venues</li>
        <li>Exploring media and broadcasting landmarks</li>
        <li>Enjoying intellectual conversations</li>
      </ul>
      
      <p>Our Fitzrovia escorts are well-read, culturally aware, and appreciate the district's intellectual heritage and contemporary relevance.</p>
    `,
    seoTitle: "Fitzrovia Escorts | Intellectual Companions W1T W1W | Five London",
    seoDescription: "Cultural escort services in Fitzrovia W1T, W1W. Intellectual companions for literary walks, media events. Cultured escorts near BBC & galleries.",
    keywords: ["fitzrovia escorts", "intellectual escorts london w1t", "literary companions", "cultured escort services", "bbc escorts", "media escorts"],
    coordinates: {
      lat: 51.5189,
      lng: -0.1363
    },
    postcodes: ["W1T", "W1W"],
    nearbyLandmarks: ["Charlotte Street", "Fitzroy Square", "BBC Broadcasting House", "University College London"]
  },
  {
    id: "south-kensington",
    name: "South Kensington",
    slug: "escorts-in-south-kensington",
    description: "Educational escort services in museum quarter",
    content: `
      <p>Discover educational escort services in South Kensington, London's renowned museum quarter. Our knowledgeable companions are perfect for exploring the world-class cultural institutions that make this area famous.</p>
      
      <p>South Kensington, home to some of the world's greatest museums and educational institutions, offers unparalleled cultural experiences. Our escorts excel at:</p>
      
      <ul>
        <li>Museum visits and educational tours</li>
        <li>Cultural events and exhibitions</li>
        <li>Fine dining near cultural venues</li>
        <li>Academic and intellectual discussions</li>
        <li>Exploring beautiful garden squares</li>
      </ul>
      
      <p>Our South Kensington escorts are educated, culturally sophisticated, and passionate about learning, making them ideal companions for this intellectually rich district.</p>
    `,
    seoTitle: "South Kensington Escorts | Educational Companions SW7 | Five London",
    seoDescription: "Premium escort services in South Kensington SW7. Knowledgeable companions for museums, exhibitions. Cultural escorts near Imperial College & V&A.",
    keywords: ["south kensington escorts", "museum escorts london sw7", "educational companions", "cultural escort services", "exhibition escorts", "academic escorts"],
    coordinates: {
      lat: 51.4946,
      lng: -0.1663
    },
    postcodes: ["SW7"],
    nearbyLandmarks: ["Victoria & Albert Museum", "Natural History Museum", "Science Museum", "Imperial College London"]
  }
];