export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  author: string;
  category: string;
  readTime: number;
  seoKeywords: string;
  metaDescription: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "best-restaurants-london-dinner-dates",
    title: "The Best Restaurants in London for Special Dinner Dates",
    excerpt: "Discover London's most sophisticated and romantic restaurants, perfect for an unforgettable evening with your luxury companion.",
    metaDescription: "Guide to the best restaurants in London for special dinner dates. Discover sophisticated and romantic venues for a unique dining experience.",
    seoKeywords: "London restaurants, romantic dinner London, fine dining London, luxury restaurants London, special dates London",
    content: `
      <h2>Unique Culinary Experiences in London</h2>
      
      <p>London offers some of the world's most refined dining experiences. For a truly special evening, we've selected restaurants that provide not only exceptional cuisine but also the perfect atmosphere for intimate moments.</p>

      <h3>1. Sketch - Mayfair</h3>
      <p>One of London's most iconic restaurants, Sketch combines contemporary art with haute cuisine. Its surreal interior and innovative menu create a unique dining experience. Perfect for impressing on a first date.</p>
      
      <p><strong>Specialty:</strong> Modern French cuisine<br>
      <strong>Atmosphere:</strong> Artistic and sophisticated<br>
      <strong>Average price:</strong> £150-200 per person</p>

      <h3>2. Core by Clare Smyth - Notting Hill</h3>
      <p>A 3-Michelin-starred restaurant led by the first female chef in the UK to achieve such distinction. The culinary experience here is incomparable, featuring high-quality British ingredients.</p>

      <p><strong>Specialty:</strong> Contemporary British cuisine<br>
      <strong>Atmosphere:</strong> Elegant and intimate<br>
      <strong>Average price:</strong> £180-250 per person</p>

      <h3>3. The Ritz Restaurant</h3>
      <p>Located in the iconic Ritz hotel, this restaurant offers a classic and timeless experience. The formal dress code and opulent decoration make it perfect for special occasions.</p>

      <p><strong>Specialty:</strong> Classic French cuisine<br>
      <strong>Atmosphere:</strong> Classic and majestic<br>
      <strong>Average price:</strong> £120-180 per person</p>

      <h3>4. Aqua Shard</h3>
      <p>Situated on the 31st floor of the iconic Shard, it offers panoramic views of London while you enjoy contemporary British dishes. The night view of the city is simply magical.</p>

      <p><strong>Specialty:</strong> Modern British cuisine<br>
      <strong>Atmosphere:</strong> Modern with panoramic views<br>
      <strong>Average price:</strong> £100-150 per person</p>

      <h3>5. Restaurant Gordon Ramsay</h3>
      <p>The renowned chef Gordon Ramsay's first restaurant has maintained its 3 Michelin stars for over 20 years. The refined French cuisine and impeccable service ensure an unforgettable experience.</p>

      <p><strong>Specialty:</strong> Refined French cuisine<br>
      <strong>Atmosphere:</strong> Sophisticated and professional<br>
      <strong>Average price:</strong> £200-300 per person</p>

      <h3>Tips for a Perfect Date</h3>
      <ul>
        <li>Book in advance - the best restaurants have waiting lists</li>
        <li>Inform about dietary preferences or allergies</li>
        <li>Consider each establishment's dress code</li>
        <li>Request a table in a more private location for greater privacy</li>
        <li>Ask about tasting menus for a complete experience</li>
      </ul>

      <p>Each of these restaurants offers a unique experience, perfect for creating special memories during your stay in London.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-15",
    author: "Five London Team",
    category: "Dining",
    readTime: 8
  },
  {
    id: "2",
    slug: "london-annual-events-luxury-experiences",
    title: "London's Exclusive Annual Events: A Luxury Calendar",
    excerpt: "Explore London's most prestigious events throughout the year, from Wimbledon to Royal Ascot, and discover how to experience them in style.",
    metaDescription: "Complete guide to London's most exclusive annual events. From Wimbledon to Royal Ascot, discover the luxury experiences London offers.",
    seoKeywords: "London events, Wimbledon, Royal Ascot, London Fashion Week, exclusive events London, London calendar",
    content: `
      <h2>London's Social Calendar</h2>
      
      <p>London is a city that pulses with exclusive events throughout the year. From prestigious sporting competitions to unique cultural festivals, the British capital offers incomparable experiences for those seeking the best of London's social life.</p>

      <h3>Spring: Cultural Renaissance</h3>
      
      <h4>Chelsea Flower Show (May)</h4>
      <p>The world's most prestigious gardening event attracts royalty and celebrities. This unique floral exhibition offers an incomparable sensory experience amid the most beautiful gardens created by the world's best landscape designers.</p>
      
      <p><strong>When:</strong> Third week of May<br>
      <strong>Location:</strong> Royal Hospital Chelsea<br>
      <strong>VIP Experience:</strong> Preview Days tickets with champagne reception</p>

      <h4>London Fashion Week (September/February)</h4>
      <p>One of the world's most important fashion events, where top designers present their collections. Exclusive access to shows and after-parties make this an unforgettable experience.</p>

      <h3>Summer: The Social Season</h3>
      
      <h4>Royal Ascot (June)</h4>
      <p>The world's most elegant horse racing event, frequented by the royal family. The strict dress code and centuries-old traditions create a unique atmosphere of elegance and sophistication.</p>
      
      <p><strong>When:</strong> Third week of June<br>
      <strong>Dress Code:</strong> Formal (top hats for men, hats for women)<br>
      <strong>Experience:</strong> Royal Enclosure with exclusive access</p>

      <h4>Wimbledon Championships (June/July)</h4>
      <p>The world's most prestigious tennis tournament offers a unique experience combining elite sport with British traditions. Strawberries and cream at Centre Court are mandatory.</p>
      
      <p><strong>When:</strong> Last two weeks of June/first week of July<br>
      <strong>VIP Experience:</strong> Centre Court Debenture Seats with hospitality</p>

      <h4>Henley Royal Regatta (July)</h4>
      <p>The world's most elegant regatta, where the British elite gathers on the banks of the Thames. The Stewards' Enclosure offers the most exclusive experience of the event.</p>

      <h3>Autumn: Art and Culture</h3>
      
      <h4>Frieze Art Fair (October)</h4>
      <p>One of the world's most important contemporary art fairs, attracting international collectors and art enthusiasts. The event takes place in specially built tents in Regent's Park.</p>

      <h4>Lord Mayor's Show (November)</h4>
      <p>A tradition of more than 800 years celebrating the election of the new Lord Mayor of the City of London. The procession through the city's historic streets is a unique spectacle.</p>

      <h3>Winter: Elegance and Tradition</h3>
      
      <h4>Royal Opera House Season</h4>
      <p>The Royal Opera House opera and ballet season offers world-class performances in one of London's most beautiful theatres.</p>
      
      <p><strong>VIP Experience:</strong> Royal Box or Grand Tier with dinner at the Amphitheatre Restaurant</p>

      <h4>New Year's Eve Fireworks</h4>
      <p>London's New Year's celebration is world-famous, with spectacular fireworks over the London Eye and Thames.</p>

      <h3>How to Experience These Events in Style</h3>
      <ul>
        <li><strong>Advance planning:</strong> Many events have limited tickets that sell out quickly</li>
        <li><strong>Appropriate dress code:</strong> Each event has its own dress rules</li>
        <li><strong>VIP experiences:</strong> Consider packages that include hospitality and exclusive access</li>
        <li><strong>Luxury accommodation:</strong> Book hotels near event venues</li>
        <li><strong>Private transport:</strong> Avoid crowds with exclusive transport services</li>
      </ul>

      <p>These events represent the best of London's social life and offer unique opportunities to experience British culture and traditions in their most refined form.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-10",
    author: "Five London Team",
    category: "Events",
    readTime: 10
  },
  {
    id: "3",
    slug: "exclusive-experiences-london-luxury",
    title: "Exclusive Experiences in London: Beyond Conventional Tourism",
    excerpt: "Discover truly unique experiences available only to the privileged few in London, from private visits to historic locations to exclusive gastronomic experiences.",
    metaDescription: "Guide to exclusive experiences in London for sophisticated visitors. Discover unique and private activities beyond conventional tourism.",
    seoKeywords: "exclusive experiences London, luxury tourism London, private activities London, London VIP, unique experiences London",
    content: `
      <h2>London Beyond the Conventional</h2>
      
      <p>For those seeking truly unique experiences, London offers an infinity of exclusive activities that go far beyond traditional tourist routes. These experiences are designed to provide privileged access to the city's best-kept treasures.</p>

      <h3>Private Historical Experiences</h3>
      
      <h4>Tower of London - After Hours Access</h4>
      <p>Visit the Tower of London after closing to the public, with exclusive access to the Crown Jewels and an intimate experience with the Beefeaters. This limited experience offers a unique perspective on British royal history.</p>
      
      <p><strong>Duration:</strong> 3 hours<br>
      <strong>Includes:</strong> Private guide, champagne reception, access to Crown Jewels<br>
      <strong>Capacity:</strong> Maximum 12 people</p>

      <h4>Buckingham Palace - State Rooms with Royal Guide</h4>
      <p>Private access to the State Rooms with a guide specialized in royal history. This experience offers unique insights into royal family life and palace history.</p>

      <h4>Westminster Abbey - Private Visit</h4>
      <p>Explore England's most famous abbey without crowds, with access to areas normally closed to the public, including the Chapter House and Pyx Chamber.</p>

      <h3>Exclusive Gastronomic Experiences</h3>
      
      <h4>Private Dining at Sky Garden</h4>
      <p>Private dinner at the top of the "Walkie-Talkie" with 360° panoramic views of London. The chef prepares a personalized menu while you enjoy the city's most spectacular views.</p>
      
      <p><strong>Capacity:</strong> 2-20 people<br>
      <strong>Includes:</strong> Personalized tasting menu, dedicated sommelier, professional photographer</p>

      <h4>Harrods Food Hall - Private Gastronomic Shopping</h4>
      <p>Private gastronomic shopping experience in Harrods' legendary Food Hall, with specialized personal shopper and exclusive product tastings.</p>

      <h4>Borough Market - VIP Gastronomic Tour</h4>
      <p>Explore London's most famous gastronomic market with VIP access to exclusive suppliers, private tastings and meetings with renowned chefs.</p>

      <h3>Unique Cultural Experiences</h3>
      
      <h4>Royal Opera House - Backstage Experience</h4>
      <p>Access to Royal Opera House backstage, including private rehearsals, artist meetings and visits to costume and set design workshops.</p>
      
      <p><strong>Includes:</strong> Private rehearsal, meet & greet with artists, dinner at Amphitheatre Restaurant</p>

      <h4>Tate Modern - Private Curator</h4>
      <p>Private tour with senior Tate Modern curator, with access to works normally in technical reserve and in-depth discussions about contemporary art.</p>

      <h4>Shakespeare's Globe - Private Performance</h4>
      <p>Watch a Shakespearean performance in private session at the historic Globe Theatre, with professional actors and authentic Elizabethan atmosphere.</p>

      <h3>Luxury and Wellness Experiences</h3>
      
      <h4>The Ned - Full Day Spa Experience</h4>
      <p>Complete wellness experience at The Ned spa, including personalized treatments, rooftop pool access and relaxation in private lounges.</p>

      <h4>Claridge's - Private Afternoon Tea</h4>
      <p>Claridge's famous afternoon tea in private setting, with personalized service and special selection of rare teas and exclusive delicacies.</p>

      <h3>Exclusive Night Experiences</h3>
      
      <h4>London Eye - Private Capsule</h4>
      <p>Private London Eye experience with exclusive capsule, Bollinger champagne and spectacular night views of the illuminated city.</p>
      
      <p><strong>Duration:</strong> 30 minutes<br>
      <strong>Includes:</strong> Champagne, Godiva chocolates, priority access</p>

      <h4>Thames - Private Cruise</h4>
      <p>Private Thames cruise on luxury yacht, with dinner prepared by renowned chef and unique view of illuminated historic landmarks.</p>

      <h3>Seasonal Experiences</h3>
      
      <h4>Winter Wonderland VIP (December/January)</h4>
      <p>VIP access to Winter Wonderland in Hyde Park, with fast-track to all attractions, private chalet and exclusive gastronomic experience.</p>

      <h4>Chelsea Physic Garden - Private Visit</h4>
      <p>Explore London's oldest botanical garden with the head curator, learning about historic medicinal plants and secret gardens.</p>

      <h3>How to Book These Experiences</h3>
      <ul>
        <li><strong>Minimum advance notice:</strong> Most require booking 2-4 weeks in advance</li>
        <li><strong>Documentation:</strong> Some experiences may require identity verification</li>
        <li><strong>Flexibility:</strong> Many experiences can be customized according to preferences</li>
        <li><strong>Specialized concierge:</strong> Use concierge services for exclusive access</li>
        <li><strong>Combined packages:</strong> Many experiences can be combined for a full day</li>
      </ul>

      <p>These experiences represent the best London has to offer for visitors seeking something truly special and memorable, providing access to aspects of the city that few have the privilege to know.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-05",
    author: "Five London Team",
    category: "Experiences",
    readTime: 12
  },
  {
    id: "4",
    slug: "luxury-hotels-london-sophisticated-stays",
    title: "Sophisticated Hotels in London: Where Luxury Meets Tradition",
    excerpt: "Explore London's most luxurious hotels, from timeless classics to modern boutique properties, perfect for an unforgettable stay.",
    metaDescription: "Guide to London's most luxurious hotels. Discover sophisticated accommodations, from classics like Claridge's to modern boutique hotels.",
    seoKeywords: "luxury hotels London, sophisticated hotel London, Claridge's, The Ritz London, Savoy Hotel, luxury accommodation London",
    content: `
      <h2>The Art of London Hospitality</h2>
      
      <p>London houses some of the world's most prestigious hotels, where centuries-old tradition meets contemporary luxury. These properties are not just places to stay, but destinations in themselves, offering unique experiences that define the standard of luxury hospitality.</p>

      <h3>The Timeless Classics</h3>
      
      <h4>Claridge's - Mayfair</h4>
      <p>A symbol of British elegance for over 150 years, Claridge's is synonymous with discreet luxury and impeccable service. Frequented by royalty and celebrities, every detail of the hotel reflects timeless sophistication.</p>
      
      <p><strong>Unique features:</strong><br>
      • Authentic 1930s Art Deco<br>
      • World-famous afternoon tea<br>
      • AKASHA Spa with art deco pool<br>
      • Royal suites with personalized decoration<br>
      • Privileged location in Mayfair</p>
      
      <p><strong>Featured experience:</strong> Brook Penthouse with private terrace and panoramic views of London</p>

      <h4>The Ritz London - Piccadilly</h4>
      <p>The hotel that defined the concept of luxury over a century ago continues to be a reference in elegance. Its French architecture and opulent decoration transport guests to an era of incomparable glamour.</p>
      
      <p><strong>Unique features:</strong><br>
      • French neoclassical architecture by César Ritz<br>
      • The Ritz Restaurant with Michelin star<br>
      • Palm Court for traditional afternoon tea<br>
      • Rivoli Bar with artisanal cocktails<br>
      • Green Park view rooms</p>

      <h4>The Savoy - Covent Garden</h4>
      <p>Legend of London hospitality, The Savoy combines Victorian tradition with contemporary touches. Its location on the Thames and rich history make it an iconic choice.</p>
      
      <p><strong>Unique features:</strong><br>
      • Location on the curve of the River Thames<br>
      • American Bar, the world's most famous hotel bar<br>
      • Savoy Grill by Gordon Ramsay<br>
      • Thames Foyer for afternoon tea with view<br>
      • Royal Suite with private entrance</p>

      <h3>Contemporary Elegance</h3>
      
      <h4>The Ned - City of London</h4>
      <p>Installed in a former 1920s bank, The Ned redefines the concept of luxury boutique hotel. Its multiple restaurants and private club create a unique social experience.</p>
      
      <p><strong>Unique features:</strong><br>
      • 9 restaurants in the same location<br>
      • Ned's Club with rooftop pool<br>
      • Cowshed Spa with exclusive treatments<br>
      • Preserved historic banking architecture<br>
      • Location in the financial heart</p>

      <h4>Edition London - Fitzrovia</h4>
      <p>Ian Schrager's modern vision for luxury hospitality. Minimalist and sophisticated design combined with cutting-edge technology and personalized service.</p>
      
      <p><strong>Unique features:</strong><br>
      • Design by Ian Schrager<br>
      • Exclusive Punch Room bar<br>
      • Edition Spa with hammam<br>
      • Berners Tavern with spectacular ceiling<br>
      • Advanced room technology</p>

      <h3>Exclusive Boutique Hotels</h3>
      
      <h4>The Zetter Townhouse - Marylebone</h4>
      <p>Authentic Georgian charm in an intimate boutique property. Each room is unique, decorated with antiques and offering a personalized experience.</p>
      
      <p><strong>Unique features:</strong><br>
      • Only 24 unique rooms<br>
      • Seymour's Parlour cocktail bar<br>
      • Decoration with authentic antiques<br>
      • Private Georgian house atmosphere<br>
      • Discreet location in Marylebone</p>

      <h4>Chiltern Firehouse - Marylebone</h4>
      <p>Former fire station transformed into chic boutique hotel. Popular among celebrities, it offers an exclusive and contemporary experience.</p>
      
      <p><strong>Unique features:</strong><br>
      • Victorian fire station architecture<br>
      • Celebrity-favorite restaurant<br>
      • Intimate ground floor bar<br>
      • Only 26 exclusive rooms<br>
      • Discreet and private atmosphere</p>

      <h3>Luxury with History</h3>
      
      <h4>Brown's Hotel - Mayfair</h4>
      <p>London's first hotel (1837) maintains its Victorian elegance while offering modern comforts. Its rich history includes guests like Agatha Christie and Theodore Roosevelt.</p>
      
      <p><strong>Unique features:</strong><br>
      • London's first hotel<br>
      • Charlie's Bar with centenary history<br>
      • Exclusive ESPA spa<br>
      • HIX Mayfair restaurant<br>
      • Kipling Cotta for afternoon tea</p>

      <h4>The Langham - Marylebone</h4>
      <p>Grand dame of European hotels, The Langham has set luxury standards since 1865. Its restored elegance and privileged location maintain its contemporary relevance.</p>

      <h3>Hotel Dining Experiences</h3>
      
      <h4>Alain Ducasse at The Dorchester</h4>
      <p>3 Michelin stars in the heart of Mayfair, offering contemporary French cuisine in opulent surroundings.</p>

      <h4>Fera at Claridge's</h4>
      <p>Simon Rogan brings his farm-to-table philosophy to Mayfair, creating unique gastronomic experiences with British ingredients.</p>

      <h3>Spas and Wellness</h3>
      
      <h4>ESPA Life at Corinthia</h4>
      <p>Considered one of the world's best urban spas, offering exclusive treatments in luxurious thermal environment.</p>

      <h4>The Spa at The Dorchester</h4>
      <p>Intimate spa with personalized treatments and exclusive products, perfect for complete relaxation.</p>

      <h3>Tips for Choosing the Perfect Hotel</h3>
      <ul>
        <li><strong>Location:</strong> Consider proximity to places of interest</li>
        <li><strong>Style:</strong> Classic versus contemporary according to preference</li>
        <li><strong>Experiences:</strong> Evaluate restaurants, spas and unique services</li>
        <li><strong>Advance bookings:</strong> Best suites require planning</li>
        <li><strong>Concierge:</strong> Use services for personalized experiences</li>
        <li><strong>Season:</strong> Consider seasonal events that may affect availability</li>
      </ul>

      <p>Each hotel offers a unique interpretation of London luxury, from centuries-old tradition to contemporary innovation. The right choice depends on personal style and desired experiences during your stay in the British capital.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2023-12-28",
    author: "Five London Team",
    category: "Accommodation",
    readTime: 15
  }
];

export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.slug === slug);
};

export const getBlogArticlesByCategory = (category: string): BlogArticle[] => {
  return blogArticles.filter(article => article.category === category);
};

export const getRelatedArticles = (currentSlug: string, limit: number = 3): BlogArticle[] => {
  return blogArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, limit);
};