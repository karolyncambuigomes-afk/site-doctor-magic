export interface Characteristic {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const characteristics: Characteristic[] = [
  // Physical Appearance - Hair & Body
  {
    id: "blonde",
    name: "Blonde",
    slug: "blonde-escorts",
    description: "Stunning blonde companions with golden beauty",
    content: `
      <p>Meet our gorgeous blonde escorts who embody classic beauty with their stunning golden locks and radiant personalities. These captivating companions showcase the timeless allure of blonde beauty.</p>
      
      <p>Our blonde escorts provide:</p>
      
      <ul>
        <li>Classic blonde beauty and elegance</li>
        <li>Radiant and captivating presence</li>
        <li>Versatile styling and presentation</li>
        <li>Bright and engaging personalities</li>
        <li>Timeless appeal and sophistication</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate the classic beauty of blonde hair, radiant personalities, and the timeless elegance that blonde companions bring to any occasion.</p>
    `,
    seoTitle: "Blonde Escorts London | Golden Beauty Companions | Five London",
    seoDescription: "Blonde escorts in London with stunning golden beauty. Classic blonde companions with radiant personalities and elegant presence.",
    keywords: ["blonde escorts", "blonde escorts london", "golden hair companions", "fair hair escorts", "classic blonde beauty"]
  },
  {
    id: "brunette",
    name: "Brunette",
    slug: "brunette-escorts",
    description: "Sophisticated brunette companions with exotic allure",
    content: `
      <p>Discover our stunning brunette escorts who possess sophisticated dark beauty and mysterious allure. These captivating companions showcase the elegant appeal of rich, dark hair and intense personalities.</p>
      
      <p>Our brunette escorts offer:</p>
      
      <ul>
        <li>Sophisticated dark beauty and elegance</li>
        <li>Mysterious and alluring presence</li>
        <li>Rich and luxurious hair styling</li>
        <li>Intense and passionate personalities</li>
        <li>Classic and timeless sophistication</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate the sophisticated beauty of dark hair, mysterious charm, and the classic elegance that brunette companions bring to sophisticated encounters.</p>
    `,
    seoTitle: "Brunette Escorts London | Dark Beauty Companions | Five London",
    seoDescription: "Brunette escorts in London with sophisticated dark beauty. Elegant brunette companions with mysterious allure and passionate personalities.",
    keywords: ["brunette escorts", "brunette escorts london", "dark hair companions", "sophisticated brunettes", "exotic brunette beauty"]
  },
  {
    id: "busty",
    name: "Busty",
    slug: "busty-escorts",
    description: "Curvaceous companions with stunning figures",
    content: `
      <p>Experience the allure of our busty escorts who possess stunning curvaceous figures and natural confidence. These captivating companions embrace their beautiful curves with pride and grace.</p>
      
      <p>Our busty escorts provide:</p>
      
      <ul>
        <li>Stunning curvaceous figures and natural beauty</li>
        <li>Confident and sensual presence</li>
        <li>Natural grace and feminine appeal</li>
        <li>Warm and engaging personalities</li>
        <li>Classic feminine beauty and charm</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate classic feminine curves, natural beauty, and companions who exude confidence and sensual appeal.</p>
    `,
    seoTitle: "Busty Escorts London | Curvaceous Beauty Companions | Five London",
    seoDescription: "Busty escorts in London with stunning curvaceous figures. Beautiful companions with natural confidence and feminine appeal.",
    keywords: ["busty escorts", "busty escorts london", "curvaceous companions", "voluptuous escorts", "curvy beauty"]
  },
  {
    id: "petite",
    name: "Petite",
    slug: "petite-escorts",
    description: "Delicate and charming petite companions",
    content: `
      <p>Discover our petite escorts who possess delicate beauty and charming personalities. These adorable companions showcase the appeal of petite figures with natural grace and elegance.</p>
      
      <p>Our petite escorts offer:</p>
      
      <ul>
        <li>Delicate and graceful figures</li>
        <li>Charming and sweet personalities</li>
        <li>Elegant presence and poise</li>
        <li>Youthful and fresh appeal</li>
        <li>Refined and sophisticated charm</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate delicate beauty, charming personalities, and the elegant appeal that petite companions bring to intimate encounters.</p>
    `,
    seoTitle: "Petite Escorts London | Delicate Beauty Companions | Five London",
    seoDescription: "Petite escorts in London with delicate charm and graceful figures. Small and elegant companions with sweet personalities.",
    keywords: ["petite escorts", "petite escorts london", "small companions", "delicate escorts", "tiny escorts"]
  },
  {
    id: "curvy",
    name: "Curvy",
    slug: "curvy-escorts",
    description: "Beautiful curvy companions with natural figures",
    content: `
      <p>Meet our stunning curvy escorts who celebrate natural feminine beauty with their gorgeous curves and confident personalities. These captivating companions embrace their natural figures with pride.</p>
      
      <p>Our curvy escorts provide:</p>
      
      <ul>
        <li>Beautiful natural curves and feminine appeal</li>
        <li>Confident and sensual presence</li>
        <li>Warm and engaging personalities</li>
        <li>Natural beauty and charm</li>
        <li>Authentic feminine allure</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate natural feminine curves, authentic beauty, and companions who exude confidence and sensual charm.</p>
    `,
    seoTitle: "Curvy Escorts London | Natural Beauty Companions | Five London",
    seoDescription: "Curvy escorts in London with beautiful natural figures. Feminine companions with confident personalities and sensual appeal.",
    keywords: ["curvy escorts", "curvy escorts london", "natural curves", "feminine escorts", "voluptuous companions"]
  },
  {
    id: "slim",
    name: "Slim",
    slug: "slim-escorts",
    description: "Elegant slim companions with graceful figures",
    content: `
      <p>Discover our collection of slim escorts who possess elegant, graceful figures and natural poise. These stunning companions maintain their beautiful physiques through healthy lifestyles and active living.</p>
      
      <p>Our slim escorts offer:</p>
      
      <ul>
        <li>Elegant and graceful appearance</li>
        <li>Fashion-forward style and presentation</li>
        <li>Active and health-conscious lifestyles</li>
        <li>Versatile looks for any occasion</li>
        <li>Natural elegance and poise</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate classic beauty, elegant figures, and companions who embody grace and sophistication in their appearance.</p>
    `,
    seoTitle: "Slim Escorts London | Elegant Figure Companions | Five London",
    seoDescription: "Slim escorts in London with elegant figures and graceful poise. Beautiful companions with classic beauty and sophisticated style.",
    keywords: ["slim escorts", "elegant escorts london", "graceful companions", "slender escorts", "lean escorts"]
  },
  {
    id: "tall",
    name: "Tall",
    slug: "tall-escorts",
    description: "Statuesque tall companions with commanding presence",
    content: `
      <p>Experience the elegance of our tall escorts who possess statuesque figures and commanding presence. These stunning companions showcase the beauty of height with natural grace and sophistication.</p>
      
      <p>Our tall escorts provide:</p>
      
      <ul>
        <li>Statuesque figures and elegant height</li>
        <li>Commanding and confident presence</li>
        <li>Model-like poise and grace</li>
        <li>Sophisticated and refined appeal</li>
        <li>Natural elegance and charm</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate height, elegance, and companions who possess the natural grace and sophistication that comes with statuesque beauty.</p>
    `,
    seoTitle: "Tall Escorts London | Statuesque Beauty Companions | Five London",
    seoDescription: "Tall escorts in London with statuesque figures and commanding presence. Elegant tall companions with model-like grace.",
    keywords: ["tall escorts", "tall escorts london", "statuesque companions", "height escorts", "model escorts"]
  },
  {
    id: "mature",
    name: "Mature",
    slug: "mature-escorts",
    description: "Sophisticated mature companions with experience",
    content: `
      <p>Discover our mature escorts who bring wisdom, sophistication, and life experience to their companionship. These elegant women possess the confidence and grace that comes with maturity.</p>
      
      <p>Our mature escorts offer:</p>
      
      <ul>
        <li>Sophisticated and refined personalities</li>
        <li>Life experience and worldly knowledge</li>
        <li>Confident and self-assured presence</li>
        <li>Emotional maturity and understanding</li>
        <li>Elegant and timeless beauty</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate maturity, sophistication, and the unique charm that comes with life experience and emotional intelligence.</p>
    `,
    seoTitle: "Mature Escorts London | Sophisticated Experience Companions | Five London",
    seoDescription: "Mature escorts in London with sophistication and life experience. Elegant mature companions with confidence and wisdom.",
    keywords: ["mature escorts", "mature escorts london", "experienced companions", "sophisticated women", "older escorts"]
  },
  {
    id: "natural",
    name: "Natural",
    slug: "natural-escorts",
    description: "Naturally beautiful companions with authentic charm",
    content: `
      <p>Experience authentic beauty with our natural escorts who showcase genuine charm and unenhanced allure. These stunning companions embrace their natural beauty and radiate confidence from within.</p>
      
      <p>Our natural escorts offer:</p>
      
      <ul>
        <li>Authentic beauty and genuine personalities</li>
        <li>Natural confidence and self-assurance</li>
        <li>Real and meaningful connections</li>
        <li>Unpretentious and down-to-earth attitudes</li>
        <li>Fresh and natural approach to companionship</li>
      </ul>
      
      <p>These companions are chosen for their natural beauty, genuine personalities, and ability to create authentic connections that feel real and meaningful.</p>
    `,
    seoTitle: "Natural Escorts London | Authentic Beauty Companions | Five London",
    seoDescription: "Natural escorts in London with authentic beauty and genuine charm. Real companions for meaningful connections and authentic experiences.",
    keywords: ["natural escorts", "authentic escorts london", "genuine companions", "natural beauty escorts", "real escorts"]
  },

  // Ethnicity & Nationality
  {
    id: "english",
    name: "English",
    slug: "english-escorts",
    description: "Beautiful English companions with local charm",
    content: `
      <p>Meet our stunning English escorts who embody the charm and sophistication of British beauty. These lovely companions showcase the best of English elegance and cultural refinement.</p>
      
      <p>Our English escorts provide:</p>
      
      <ul>
        <li>Classic English beauty and elegance</li>
        <li>Local knowledge and cultural insight</li>
        <li>Refined accents and proper etiquette</li>
        <li>Sophisticated social skills</li>
        <li>Traditional British charm and grace</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate English culture, sophisticated accents, and the traditional charm that English companions bring to social occasions.</p>
    `,
    seoTitle: "English Escorts London | British Beauty Companions | Five London",
    seoDescription: "English escorts in London with classic British beauty and local charm. Sophisticated English companions with cultural refinement.",
    keywords: ["english escorts", "english escorts london", "british companions", "local escorts", "uk escorts"]
  },
  {
    id: "brazilian",
    name: "Brazilian",
    slug: "brazilian-escorts",
    description: "Exotic Brazilian companions with passionate nature",
    content: `
      <p>Experience the exotic allure of our Brazilian escorts who bring passion, warmth, and Latin charm to their companionship. These stunning companions showcase the natural beauty and vibrant culture of Brazil.</p>
      
      <p>Our Brazilian escorts offer:</p>
      
      <ul>
        <li>Exotic Latin beauty and sensual appeal</li>
        <li>Passionate and warm personalities</li>
        <li>Natural rhythm and dance skills</li>
        <li>Vibrant and engaging presence</li>
        <li>Cultural richness and exotic charm</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate Latin culture, passionate personalities, and the exotic appeal that Brazilian companions bring to intimate encounters.</p>
    `,
    seoTitle: "Brazilian Escorts London | Exotic Latin Companions | Five London",
    seoDescription: "Brazilian escorts in London with exotic Latin beauty and passionate nature. Sensual Brazilian companions with vibrant charm.",
    keywords: ["brazilian escorts", "brazilian escorts london", "latin companions", "exotic escorts", "south american escorts"]
  },
  {
    id: "russian",
    name: "Russian",
    slug: "russian-escorts",
    description: "Stunning Russian companions with elegant beauty",
    content: `
      <p>Discover our beautiful Russian escorts who possess striking Slavic beauty and sophisticated elegance. These captivating companions showcase the classic appeal of Eastern European charm.</p>
      
      <p>Our Russian escorts provide:</p>
      
      <ul>
        <li>Striking Slavic beauty and elegance</li>
        <li>Sophisticated and cultured personalities</li>
        <li>Natural grace and poise</li>
        <li>Mysterious and alluring presence</li>
        <li>Classic Eastern European charm</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate Slavic beauty, sophisticated culture, and the mysterious appeal that Russian companions bring to elegant encounters.</p>
    `,
    seoTitle: "Russian Escorts London | Slavic Beauty Companions | Five London",
    seoDescription: "Russian escorts in London with striking Slavic beauty and sophisticated elegance. Eastern European companions with mysterious charm.",
    keywords: ["russian escorts", "russian escorts london", "slavic companions", "eastern european escorts", "sophisticated russians"]
  },
  {
    id: "european",
    name: "European",
    slug: "european-escorts",
    description: "Sophisticated European companions with continental charm",
    content: `
      <p>Meet our elegant European escorts who bring continental sophistication and cultural refinement to their companionship. These stunning companions represent the diverse beauty of Europe.</p>
      
      <p>Our European escorts offer:</p>
      
      <ul>
        <li>Continental sophistication and elegance</li>
        <li>Cultural diversity and refinement</li>
        <li>Multilingual abilities and worldliness</li>
        <li>Sophisticated social skills</li>
        <li>Classic European charm and grace</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate European culture, sophisticated conversation, and the continental charm that European companions bring to social occasions.</p>
    `,
    seoTitle: "European Escorts London | Continental Sophistication | Five London",
    seoDescription: "European escorts in London with continental sophistication and cultural refinement. Elegant European companions with worldly charm.",
    keywords: ["european escorts", "european escorts london", "continental companions", "sophisticated europeans", "cultured escorts"]
  },
  {
    id: "middle-eastern",
    name: "Middle Eastern",
    slug: "middle-eastern-escorts",
    description: "Exotic Middle Eastern companions with mysterious beauty",
    content: `
      <p>Experience the exotic allure of our Middle Eastern escorts who possess mysterious beauty and captivating charm. These stunning companions showcase the rich cultural heritage of the Middle East.</p>
      
      <p>Our Middle Eastern escorts provide:</p>
      
      <ul>
        <li>Exotic and mysterious beauty</li>
        <li>Rich cultural heritage and traditions</li>
        <li>Captivating and alluring presence</li>
        <li>Warm and hospitable personalities</li>
        <li>Unique and enchanting appeal</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate exotic beauty, cultural richness, and the mysterious appeal that Middle Eastern companions bring to intimate encounters.</p>
    `,
    seoTitle: "Middle Eastern Escorts London | Exotic Beauty Companions | Five London",
    seoDescription: "Middle Eastern escorts in London with exotic beauty and mysterious charm. Captivating companions with rich cultural heritage.",
    keywords: ["middle eastern escorts", "middle eastern escorts london", "exotic companions", "mysterious beauty", "persian escorts"]
  },
  {
    id: "asian",
    name: "Asian",
    slug: "asian-escorts",
    description: "Beautiful Asian companions with oriental charm",
    content: `
      <p>Discover our stunning Asian escorts who possess delicate oriental beauty and graceful charm. These captivating companions showcase the elegance and sophistication of Asian culture.</p>
      
      <p>Our Asian escorts offer:</p>
      
      <ul>
        <li>Delicate oriental beauty and grace</li>
        <li>Cultural sophistication and refinement</li>
        <li>Gentle and caring personalities</li>
        <li>Natural elegance and poise</li>
        <li>Traditional values with modern appeal</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate oriental beauty, cultural sophistication, and the gentle charm that Asian companions bring to elegant encounters.</p>
    `,
    seoTitle: "Asian Escorts London | Oriental Beauty Companions | Five London",
    seoDescription: "Asian escorts in London with delicate oriental beauty and graceful charm. Sophisticated Asian companions with cultural elegance.",
    keywords: ["asian escorts", "asian escorts london", "oriental companions", "chinese escorts", "japanese escorts"]
  },
  {
    id: "ebony",
    name: "Ebony Escorts",
    slug: "ebony-escorts",
    description: "Stunning ebony companions with natural beauty",
    content: `
      <p>Experience the stunning beauty of our ebony escorts who possess natural grace and captivating charm. These gorgeous companions showcase the elegance and appeal of African heritage.</p>
      
      <p>Our ebony escorts provide:</p>
      
      <ul>
        <li>Natural beauty and stunning features</li>
        <li>Graceful and elegant presence</li>
        <li>Warm and vibrant personalities</li>
        <li>Cultural richness and diversity</li>
        <li>Confident and captivating appeal</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate natural beauty, cultural diversity, and the vibrant charm that ebony companions bring to social occasions.</p>
    `,
    seoTitle: "Ebony Escorts London | Natural Beauty Companions | Five London",
    seoDescription: "Ebony escorts in London with stunning natural beauty and graceful charm. Beautiful African companions with vibrant personalities.",
    keywords: ["ebony escorts", "ebony escorts london", "african companions", "black escorts", "dark beauty"]
  },
  {
    id: "latina",
    name: "Latina",
    slug: "latina-escorts",
    description: "Passionate Latina companions with fiery charm",
    content: `
      <p>Meet our passionate Latina escorts who bring fiery charm and Latin sensuality to their companionship. These captivating companions showcase the vibrant culture and beauty of Latin America.</p>
      
      <p>Our Latina escorts offer:</p>
      
      <ul>
        <li>Passionate and fiery personalities</li>
        <li>Latin sensuality and charm</li>
        <li>Vibrant cultural heritage</li>
        <li>Natural rhythm and dance skills</li>
        <li>Warm and engaging presence</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate Latin culture, passionate personalities, and the fiery charm that Latina companions bring to intimate encounters.</p>
    `,
    seoTitle: "Latina Escorts London | Passionate Latin Companions | Five London",
    seoDescription: "Latina escorts in London with passionate personalities and fiery Latin charm. Sensual Latina companions with vibrant culture.",
    keywords: ["latina escorts", "latina escorts london", "latin companions", "hispanic escorts", "passionate latinas"]
  },
  {
    id: "iranian",
    name: "Iranian",
    slug: "iranian-escorts",
    description: "Elegant Iranian companions with Persian beauty",
    content: `
      <p>Discover our elegant Iranian escorts who possess sophisticated Persian beauty and cultural refinement. These stunning companions showcase the timeless appeal of Persian heritage.</p>
      
      <p>Our Iranian escorts provide:</p>
      
      <ul>
        <li>Sophisticated Persian beauty and elegance</li>
        <li>Rich cultural heritage and traditions</li>
        <li>Refined and educated personalities</li>
        <li>Mysterious and alluring presence</li>
        <li>Classic Middle Eastern charm</li>
      </ul>
      
      <p>These companions are perfect for clients who appreciate Persian culture, sophisticated beauty, and the elegant charm that Iranian companions bring to refined encounters.</p>
    `,
    seoTitle: "Iranian Escorts London | Persian Beauty Companions | Five London",
    seoDescription: "Iranian escorts in London with sophisticated Persian beauty and cultural refinement. Elegant Iranian companions with mysterious charm.",
    keywords: ["iranian escorts", "iranian escorts london", "persian companions", "middle eastern beauty", "sophisticated iranians"]
  },
  {
    id: "international",
    name: "International",
    slug: "international-escorts",
    description: "Worldly international companions from diverse backgrounds",
    content: `
      <p>Experience the diversity of our international escorts who bring worldly sophistication and global perspectives to their companionship. These cosmopolitan companions represent cultures from around the world.</p>
      
      <p>Our international escorts offer:</p>
      
      <ul>
        <li>Diverse cultural backgrounds and experiences</li>
        <li>Worldly sophistication and knowledge</li>
        <li>Multilingual abilities and global perspectives</li>
        <li>Cosmopolitan charm and appeal</li>
        <li>Rich cultural diversity and understanding</li>
      </ul>
      
      <p>These companions are ideal for clients who appreciate cultural diversity, worldly sophistication, and the unique perspectives that international companions bring to social occasions.</p>
    `,
    seoTitle: "International Escorts London | Worldly Diverse Companions | Five London",
    seoDescription: "International escorts in London with diverse cultural backgrounds and worldly sophistication. Cosmopolitan companions from around the globe.",
    keywords: ["international escorts", "international escorts london", "diverse companions", "worldly escorts", "cosmopolitan companions"]
  },

  // Service Types & Experience Levels
  {
    id: "vip-elite",
    name: "VIP / Elite",
    slug: "vip-elite-escorts",
    description: "Exclusive VIP companions for elite clientele",
    content: `
      <p>Experience the ultimate in luxury with our VIP/Elite escorts who provide exclusive companionship for the most discerning clientele. These exceptional companions represent the pinnacle of sophistication and elegance.</p>
      
      <p>Our VIP/Elite escorts provide:</p>
      
      <ul>
        <li>Exclusive and elite companionship services</li>
        <li>Unparalleled sophistication and refinement</li>
        <li>Discretion and professionalism</li>
        <li>Luxury experiences and high-end events</li>
        <li>Exceptional beauty and intelligence</li>
      </ul>
      
      <p>These companions are carefully selected for their exceptional qualities, representing the absolute finest in luxury companionship for elite clients who demand excellence.</p>
    `,
    seoTitle: "VIP Elite Escorts London | Exclusive Luxury Companions | Five London",
    seoDescription: "VIP Elite escorts in London for exclusive luxury experiences. Premium companions for discerning elite clientele with sophisticated tastes.",
    keywords: ["vip escorts", "elite escorts london", "luxury companions", "exclusive escorts", "premium companionship"]
  },
  {
    id: "party",
    name: "Party",
    slug: "party-escorts",
    description: "Fun-loving party companions for social events",
    content: `
      <p>Meet our exciting party escorts who bring energy, fun, and social charisma to any event. These vivacious companions are perfect for clients who love to celebrate and enjoy London's vibrant nightlife scene.</p>
      
      <p>Our party escorts provide:</p>
      
      <ul>
        <li>Energetic presence at clubs and parties</li>
        <li>Social butterfly personalities</li>
        <li>Knowledge of London's best nightlife spots</li>
        <li>Fun and engaging conversation</li>
        <li>Perfect companions for celebrations</li>
      </ul>
      
      <p>These companions are selected for their outgoing personalities, social skills, and ability to ensure you have an unforgettable time at any social gathering or celebration.</p>
    `,
    seoTitle: "Party Escorts London | Fun Social Companions | Five London",
    seoDescription: "Party escorts in London. Energetic companions for nightlife, clubs, and social events. Fun-loving escorts for celebrations.",
    keywords: ["party escorts", "nightlife escorts london", "party companions", "social escorts", "club escorts"]
  },
  {
    id: "adventurous",
    name: "Adventurous",
    slug: "adventurous-escorts",
    description: "Exciting adventurous companions for unique experiences",
    content: `
      <p>Discover our adventurous escorts who bring excitement and spontaneity to their companionship. These daring companions are perfect for clients seeking unique experiences and thrilling adventures.</p>
      
      <p>Our adventurous escorts offer:</p>
      
      <ul>
        <li>Exciting and spontaneous personalities</li>
        <li>Willingness to try new experiences</li>
        <li>Active and energetic lifestyles</li>
        <li>Creative and imaginative approaches</li>
        <li>Bold and confident attitudes</li>
      </ul>
      
      <p>These companions are chosen for their adventurous spirits, open-minded attitudes, and ability to create memorable experiences that go beyond the ordinary.</p>
    `,
    seoTitle: "Adventurous Escorts London | Exciting Experience Companions | Five London",
    seoDescription: "Adventurous escorts in London for exciting unique experiences. Daring companions with spontaneous personalities and bold attitudes.",
    keywords: ["adventurous escorts", "adventurous escorts london", "exciting companions", "bold escorts", "spontaneous escorts"]
  },
  {
    id: "open-minded",
    name: "Open-Minded",
    slug: "open-minded-escorts",
    description: "Non-judgmental open-minded companions",
    content: `
      <p>Experience true acceptance with our open-minded escorts who provide non-judgmental companionship for all types of clients and preferences. These exceptional companions pride themselves on their accepting attitudes and flexible approaches.</p>
      
      <p>Our open-minded escorts excel at:</p>
      
      <ul>
        <li>Creating comfortable, judgment-free environments</li>
        <li>Accommodating diverse preferences and requests</li>
        <li>Providing emotional support and understanding</li>
        <li>Adapting to unique situations and requirements</li>
        <li>Offering genuine acceptance and warmth</li>
      </ul>
      
      <p>These companions are chosen for their emotional maturity, acceptance of diversity, and ability to make every client feel valued and understood, creating truly meaningful connections.</p>
    `,
    seoTitle: "Open Minded Escorts London | Non-Judgmental Companions | Five London",
    seoDescription: "Open-minded escorts in London offering accepting companionship. Non-judgmental services with flexible and understanding companions.",
    keywords: ["open minded escorts", "non-judgmental escorts", "accepting companions", "flexible escorts london", "understanding escorts"]
  },
  {
    id: "exclusive",
    name: "Exclusive",
    slug: "exclusive-escorts",
    description: "Premium exclusive companions for selective clientele",
    content: `
      <p>Experience exclusivity with our premium escorts who provide selective companionship for discerning clients. These exceptional companions offer limited availability and personalized attention.</p>
      
      <p>Our exclusive escorts provide:</p>
      
      <ul>
        <li>Limited availability and selective bookings</li>
        <li>Personalized and attentive service</li>
        <li>Premium quality companionship</li>
        <li>Discretion and professionalism</li>
        <li>Exceptional beauty and sophistication</li>
      </ul>
      
      <p>These companions are carefully chosen for their exceptional qualities and provide exclusive experiences for clients who value premium quality and personalized attention.</p>
    `,
    seoTitle: "Exclusive Escorts London | Premium Select Companions | Five London",
    seoDescription: "Exclusive escorts in London with limited availability for selective clientele. Premium companions offering personalized luxury experiences.",
    keywords: ["exclusive escorts", "exclusive escorts london", "premium companions", "selective escorts", "limited availability"]
  },
  {
    id: "high-class",
    name: "High-Class",
    slug: "high-class-escorts",
    description: "Elite high-class companions offering luxury companionship",
    content: `
      <p>Discover our exclusive collection of high-class escorts who embody sophistication, elegance, and refinement. These exceptional companions are carefully selected for their intelligence, poise, and ability to excel in the most prestigious social settings.</p>
      
      <p>Our high-class escorts are perfect for:</p>
      
      <ul>
        <li>Exclusive business events and corporate functions</li>
        <li>High-end social gatherings and galas</li>
        <li>Fine dining at Michelin-starred restaurants</li>
        <li>Cultural events and art gallery openings</li>
        <li>Private luxury experiences</li>
      </ul>
      
      <p>Each high-class companion possesses the education, cultural knowledge, and social graces necessary to move seamlessly within elite circles, ensuring your reputation and status are always enhanced.</p>
    `,
    seoTitle: "High Class Escorts London | Elite Luxury Companions | Five London",
    seoDescription: "Premium high-class escorts in London. Elite companions for luxury events, business functions, and sophisticated experiences. Discreet and professional services.",
    keywords: ["high class escorts", "elite escorts london", "luxury companions", "sophisticated escorts", "high-class companionship"]
  },
  {
    id: "dinner-date",
    name: "Dinner Date",
    slug: "dinner-date-escorts",
    description: "Elegant companions for fine dining experiences",
    content: `
      <p>Experience fine dining with our elegant dinner date escorts who excel at sophisticated culinary experiences. These cultured companions are perfect for upscale restaurants and intimate dining occasions.</p>
      
      <p>Our dinner date escorts provide:</p>
      
      <ul>
        <li>Sophisticated dining etiquette and manners</li>
        <li>Engaging conversation and cultural knowledge</li>
        <li>Elegant presentation and style</li>
        <li>Wine and culinary appreciation</li>
        <li>Perfect companionship for fine dining</li>
      </ul>
      
      <p>These companions are chosen for their sophistication, cultural awareness, and ability to enhance any dining experience with their elegant presence and engaging conversation.</p>
    `,
    seoTitle: "Dinner Date Escorts London | Fine Dining Companions | Five London",
    seoDescription: "Dinner date escorts in London for sophisticated culinary experiences. Elegant companions for fine dining and upscale restaurants.",
    keywords: ["dinner date escorts", "dinner date escorts london", "fine dining companions", "restaurant escorts", "culinary companions"]
  },
  {
    id: "gfe",
    name: "GFE (Girlfriend Experience)",
    slug: "gfe-girlfriend-experience-escorts",
    description: "Intimate girlfriend experience companions",
    content: `
      <p>Experience genuine intimacy with our GFE escorts who specialize in creating authentic girlfriend experiences. These caring companions provide emotional connection and intimate companionship.</p>
      
      <p>Our GFE escorts offer:</p>
      
      <ul>
        <li>Genuine emotional connection and intimacy</li>
        <li>Caring and affectionate personalities</li>
        <li>Natural and authentic interactions</li>
        <li>Romantic and intimate experiences</li>
        <li>Personal attention and emotional support</li>
      </ul>
      
      <p>These companions are selected for their ability to create genuine connections, providing the warmth, affection, and emotional intimacy of a true girlfriend experience.</p>
    `,
    seoTitle: "GFE Escorts London | Girlfriend Experience Companions | Five London",
    seoDescription: "GFE escorts in London offering authentic girlfriend experiences. Intimate companions providing emotional connection and romantic encounters.",
    keywords: ["gfe escorts", "girlfriend experience london", "intimate companions", "romantic escorts", "emotional connection"]
  },
  {
    id: "domination-fetish",
    name: "Domination / Fetish",
    slug: "domination-fetish-escorts",
    description: "Specialized companions for alternative preferences",
    content: `
      <p>Explore your desires with our specialized domination and fetish escorts who cater to alternative preferences and unique requirements. These experienced companions provide safe, consensual, and professional specialized services.</p>
      
      <p>Our domination/fetish escorts provide:</p>
      
      <ul>
        <li>Specialized knowledge and experience</li>
        <li>Safe and consensual practices</li>
        <li>Professional and discreet service</li>
        <li>Understanding of alternative preferences</li>
        <li>Non-judgmental and accepting attitudes</li>
      </ul>
      
      <p>These companions are carefully selected for their experience, professionalism, and ability to provide safe, consensual exploration of alternative desires in a respectful environment.</p>
    `,
    seoTitle: "Domination Fetish Escorts London | Specialized Companions | Five London",
    seoDescription: "Professional domination and fetish escorts in London. Experienced companions for alternative preferences with safe, consensual services.",
    keywords: ["domination escorts", "fetish escorts london", "specialized companions", "alternative preferences", "consensual services"]
  },
  {
    id: "bisexual",
    name: "Bisexual",
    slug: "bisexual-escorts",
    description: "Open-minded bisexual companions for diverse experiences",
    content: `
      <p>Meet our stunning collection of bisexual escorts who offer open-minded companionship and diverse experiences. These beautiful companions are comfortable with all types of clients and situations, bringing warmth and acceptance to every encounter.</p>
      
      <p>Our bisexual escorts provide:</p>
      
      <ul>
        <li>Open-minded companionship for all clients</li>
        <li>Couples experiences and threesome arrangements</li>
        <li>Non-judgmental and accepting attitudes</li>
        <li>Diverse social and intimate experiences</li>
        <li>Flexible and accommodating services</li>
      </ul>
      
      <p>These companions are selected for their open attitudes, emotional intelligence, and ability to make everyone feel comfortable and accepted, regardless of preferences or orientation.</p>
    `,
    seoTitle: "Bisexual Escorts London | Open-Minded Companions | Five London",
    seoDescription: "Professional bisexual escorts in London. Open-minded companions for diverse experiences. Discreet services for couples and individuals.",
    keywords: ["bisexual escorts", "bisexual escorts london", "open minded escorts", "couples escorts", "threesome escorts"]
  },
  {
    id: "couples",
    name: "Couples",
    slug: "couples-escorts",
    description: "Specialized companions for couples experiences",
    content: `
      <p>Enhance your relationship with our couples escorts who specialize in providing companionship for couples seeking to explore together. These understanding companions create comfortable environments for shared experiences.</p>
      
      <p>Our couples escorts offer:</p>
      
      <ul>
        <li>Specialized experience with couples</li>
        <li>Understanding of relationship dynamics</li>
        <li>Creating comfortable shared experiences</li>
        <li>Non-judgmental and accepting attitudes</li>
        <li>Enhancing intimacy and connection</li>
      </ul>
      
      <p>These companions are chosen for their emotional intelligence, understanding of relationship dynamics, and ability to enhance the connection between couples in a respectful and professional manner.</p>
    `,
    seoTitle: "Couples Escorts London | Relationship Enhancement Companions | Five London",
    seoDescription: "Couples escorts in London for shared experiences. Professional companions specializing in enhancing relationships and intimacy for couples.",
    keywords: ["couples escorts", "couples escorts london", "relationship enhancement", "shared experiences", "threesome companions"]
  },
  {
    id: "outcalls",
    name: "Outcalls",
    slug: "outcalls-escorts",
    description: "Mobile companions for hotel and private visits",
    content: `
      <p>Experience convenience with our outcalls escorts who provide mobile companionship services, visiting you at your hotel, residence, or preferred location. These professional companions offer flexible and discreet services.</p>
      
      <p>Our outcalls escorts provide:</p>
      
      <ul>
        <li>Mobile companionship services</li>
        <li>Hotel and residence visits</li>
        <li>Flexible scheduling and locations</li>
        <li>Discreet and professional service</li>
        <li>Convenient and comfortable experiences</li>
      </ul>
      
      <p>These companions are selected for their professionalism, reliability, and ability to provide exceptional service in various locations while maintaining the highest standards of discretion and quality.</p>
    `,
    seoTitle: "Outcalls Escorts London | Mobile Companionship Services | Five London",
    seoDescription: "Outcalls escorts in London providing mobile companionship. Professional hotel and residence visits with discreet flexible services.",
    keywords: ["outcalls escorts", "outcalls escorts london", "mobile escorts", "hotel visits", "residence visits"]
  }
];