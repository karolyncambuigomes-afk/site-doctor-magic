import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: number;
  image: string;
  meta_description: string;
  seo_keywords: string;
  service_keywords: string[];
  is_published: boolean;
  published_at: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting blog reset and seed operation...');

    // Step 1: Clear existing posts
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing blog_posts:', deleteError);
      throw deleteError;
    }

    console.log('Cleared existing blog posts');

    // Step 2: Insert curated articles
    const articles: BlogPost[] = [
      {
        slug: 'top-10-luxury-hotels-london-2025',
        title: 'Top 10 Luxury Hotels in London for an Unforgettable Stay in 2025',
        excerpt: 'Discover the most exclusive luxury hotels in London, from The Ritz to Claridge\'s, perfect for an unforgettable experience.',
        content: `<h2>Experience London's Finest Luxury Hotels</h2>
<p>London stands as one of the world's premier destinations for luxury hospitality, offering an unparalleled selection of five-star hotels that combine historic grandeur with modern sophistication.</p>

<h3>1. The Ritz London</h3>
<p>The epitome of British luxury, The Ritz has been welcoming discerning guests since 1906. Located in Piccadilly, this iconic hotel features opulent Louis XVI-style interiors, impeccable service, and the legendary Ritz Restaurant.</p>

<h3>2. Claridge's</h3>
<p>An art deco masterpiece in Mayfair, Claridge's has been the preferred choice of royalty and celebrities for generations. The hotel seamlessly blends 1920s glamour with contemporary luxury, offering exceptional dining and personalized service.</p>

<h3>3. The Savoy</h3>
<p>Overlooking the Thames, The Savoy combines Edwardian elegance with modern amenities. Home to the American Bar and Savoy Grill, this landmark hotel continues to set standards in luxury hospitality.</p>

<h3>4. Shangri-La at The Shard</h3>
<p>Occupying floors 34-52 of Western Europe's tallest building, Shangri-La offers breathtaking views across London. This contemporary luxury hotel features an infinity pool, GŎNG bar, and TĪNG restaurant.</p>

<h3>5. The Ned</h3>
<p>Set in a former 1920s bank building, The Ned combines Grade I-listed architecture with boutique luxury. With nine restaurants and a rooftop pool, it offers a unique blend of heritage and modernity.</p>

<h3>6. The Connaught</h3>
<p>This Mayfair institution has been synonymous with understated luxury since 1897. Recently renovated, it features Hélène Darroze's Michelin-starred restaurant and the celebrated Connaught Bar.</p>

<h3>7. Mandarin Oriental Hyde Park</h3>
<p>Overlooking Hyde Park, this Victorian landmark offers contemporary Asian-influenced luxury. The hotel's spa is among London's finest, and Dinner by Heston Blumenthal provides exceptional dining.</p>

<h3>8. The Dorchester</h3>
<p>A Park Lane icon since 1931, The Dorchester epitomizes British luxury with its art deco elegance. Three Michelin stars across its restaurants and impeccable service make it a perennial favorite.</p>

<h3>9. The Beaumont</h3>
<p>This art deco-inspired hotel in Mayfair offers intimate luxury with just 73 rooms. The Colony Grill Room and American Bar evoke 1920s New York glamour in the heart of London.</p>

<h3>10. Rosewood London</h3>
<p>A belle époque building transformed into a luxury hotel, Rosewood London features a stunning courtyard and the Mirror Room restaurant, offering refined British cuisine in an elegant setting.</p>`,
        category: 'Luxury Hotels',
        author: 'Victoria Elite Team',
        read_time: 8,
        image: '/images/ritz-london-exterior.webp',
        meta_description: 'Explore the top 10 luxury hotels in London for 2025, featuring The Ritz, Claridge\'s, The Savoy, and more exclusive destinations.',
        seo_keywords: 'luxury hotels London, 5-star hotels London, best hotels London 2025, The Ritz London, Claridge\'s',
        service_keywords: ['luxury hotels', 'London accommodation', 'five-star service', 'exclusive stays'],
        is_published: true,
        published_at: '2025-01-15T10:00:00Z'
      },
      {
        slug: 'michelin-star-restaurants-london-guide',
        title: 'The Ultimate Guide to Michelin Star Restaurants in London',
        excerpt: 'Explore London\'s finest Michelin-starred dining experiences, from contemporary British cuisine to innovative international flavors.',
        content: `<h2>London's Michelin Star Dining Scene</h2>
<p>London boasts one of the world's most exciting culinary landscapes, with over 70 Michelin-starred restaurants offering exceptional dining experiences.</p>

<h3>Three Michelin Stars</h3>
<p><strong>Restaurant Gordon Ramsay</strong> - Gordon Ramsay's flagship restaurant in Chelsea maintains three Michelin stars with impeccable French cuisine and flawless service.</p>

<h3>Two Michelin Stars</h3>
<p><strong>The Ledbury</strong> - Brett Graham's Notting Hill restaurant consistently ranks among the world's best, offering innovative modern European cuisine.</p>
<p><strong>Hélène Darroze at The Connaught</strong> - French haute cuisine with British influences in an elegant Mayfair setting.</p>

<h3>One Michelin Star Highlights</h3>
<p><strong>Sketch (The Lecture Room)</strong> - Pierre Gagnaire's artistic approach to French gastronomy in a whimsical setting.</p>
<p><strong>Core by Clare Smyth</strong> - Britain's finest ingredients transformed into exceptional dishes by a three-star chef.</p>
<p><strong>Jamavar</strong> - Refined Indian cuisine showcasing regional specialties and rare ingredients.</p>

<h3>Booking Tips</h3>
<p>Most Michelin-starred restaurants in London require reservations weeks or months in advance. Consider booking through your concierge service for better availability.</p>`,
        category: 'Dining',
        author: 'Victoria Elite Team',
        read_time: 7,
        image: '/images/sketch-restaurant.webp',
        meta_description: 'Discover London\'s best Michelin star restaurants, from three-star establishments to hidden gems offering exceptional fine dining experiences.',
        seo_keywords: 'Michelin star restaurants London, fine dining London, best restaurants London, Gordon Ramsay London',
        service_keywords: ['fine dining', 'Michelin restaurants', 'gourmet experiences', 'luxury dining'],
        is_published: true,
        published_at: '2025-01-14T10:00:00Z'
      },
      {
        slug: 'exclusive-members-clubs-london',
        title: 'London\'s Most Exclusive Members Clubs: An Insider\'s Guide',
        excerpt: 'Gain insight into London\'s prestigious private members clubs, from Annabel\'s to The Arts Club, where discretion meets luxury.',
        content: `<h2>The World of London's Private Members Clubs</h2>
<p>London's members clubs represent the pinnacle of exclusive social spaces, offering privacy, networking, and exceptional amenities to carefully vetted members.</p>

<h3>Annabel's</h3>
<p>Berkeley Square's legendary nightclub and members club, recently relocated and redesigned, remains the gold standard for exclusive London nightlife. Features include multiple bars, a cigar room, and exceptional dining.</p>

<h3>5 Hertford Street</h3>
<p>Robin Birley's intimate Mayfair club is renowned for its discretion and exclusive membership. The club offers exceptional dining and has become a favorite among international elites.</p>

<h3>The Arts Club</h3>
<p>Dover Street's cultural haven combines artistic heritage with modern luxury. Members enjoy access to gallery spaces, a rooftop restaurant, and regular cultural events.</p>

<h3>Soho House Group</h3>
<p>While more accessible than traditional clubs, Soho House locations across London (including the original Soho House, Shoreditch House, and others) offer excellent facilities and a creative membership base.</p>

<h3>The Ned</h3>
<p>Beyond its hotel offering, The Ned provides members-only access to additional bars, restaurants, and a stunning rooftop pool with city views.</p>

<h3>Membership Process</h3>
<p>Most prestigious clubs require sponsorship from existing members and involve lengthy application processes. Membership fees vary significantly, with some clubs requiring substantial joining fees plus annual subscriptions.</p>`,
        category: 'Lifestyle',
        author: 'Victoria Elite Team',
        read_time: 6,
        image: '/images/ned-banking-hall.webp',
        meta_description: 'Explore London\'s most exclusive private members clubs, including Annabel\'s, 5 Hertford Street, and The Arts Club.',
        seo_keywords: 'London members clubs, exclusive clubs London, Annabel\'s London, private clubs Mayfair',
        service_keywords: ['private clubs', 'exclusive access', 'luxury lifestyle', 'VIP membership'],
        is_published: true,
        published_at: '2025-01-13T10:00:00Z'
      },
      {
        slug: 'london-luxury-shopping-guide-2025',
        title: 'The Complete Guide to Luxury Shopping in London 2025',
        excerpt: 'From Bond Street to Harrods, discover where to find the world\'s most coveted luxury brands and exclusive shopping experiences.',
        content: `<h2>London's Premier Shopping Destinations</h2>
<p>London rivals Paris and New York as one of the world's premier luxury shopping destinations, offering everything from flagship stores to exclusive boutiques.</p>

<h3>Bond Street</h3>
<p>The epicenter of luxury retail in London, Bond Street (Old and New) hosts flagship stores of virtually every major luxury brand, including Chanel, Hermès, Louis Vuitton, and Cartier.</p>

<h3>Harrods</h3>
<p>This Knightsbridge institution remains the world's most famous department store. Beyond shopping, Harrods offers exceptional dining and its legendary food halls.</p>

<h3>Sloane Street</h3>
<p>Chelsea's Sloane Street provides a more intimate luxury shopping experience, with boutiques from Prada, Dior, Valentino, and other prestigious brands.</p>

<h3>Mount Street</h3>
<p>Mayfair's Mount Street offers a village-like atmosphere with luxury boutiques, including Balenciaga, Lanvin, and Christian Louboutin, plus exceptional restaurants.</p>

<h3>Dover Street Market</h3>
<p>Rei Kawakubo's avant-garde concept store represents cutting-edge fashion, featuring exclusive collaborations and emerging designers alongside established brands.</p>

<h3>Personal Shopping Services</h3>
<p>Most major stores offer VIP personal shopping experiences, providing private consultations, exclusive access to new collections, and discreet service.</p>`,
        category: 'Lifestyle',
        author: 'Victoria Elite Team',
        read_time: 7,
        image: '/images/clariges-lobby.webp',
        meta_description: 'Your ultimate guide to luxury shopping in London, covering Bond Street, Harrods, Sloane Street, and exclusive personal shopping services.',
        seo_keywords: 'luxury shopping London, Bond Street shopping, Harrods London, luxury brands London',
        service_keywords: ['luxury shopping', 'designer brands', 'personal shopping', 'exclusive retail'],
        is_published: true,
        published_at: '2025-01-12T10:00:00Z'
      },
      {
        slug: 'london-west-end-theatre-guide',
        title: 'London West End Theatre: Your Complete Guide to World-Class Shows',
        excerpt: 'Experience the magic of London\'s West End with our guide to the best shows, booking tips, and theatre etiquette.',
        content: `<h2>The Magic of London's West End</h2>
<p>London's West End stands alongside Broadway as one of the world's premier theatre districts, offering an unparalleled selection of musicals, plays, and performances.</p>

<h3>Current Must-See Productions</h3>
<p><strong>Hamilton</strong> - Lin-Manuel Miranda's revolutionary musical continues to captivate audiences at the Victoria Palace Theatre.</p>
<p><strong>The Phantom of the Opera</strong> - Andrew Lloyd Webber's longest-running musical remains spectacular at Her Majesty's Theatre.</p>
<p><strong>Harry Potter and the Cursed Child</strong> - The Palace Theatre hosts this magical continuation of the Potter saga.</p>

<h3>Historic Theatres</h3>
<p>The West End's historic venues are attractions in themselves. The Theatre Royal Drury Lane, Royal Opera House, and London Palladium combine architectural splendor with world-class productions.</p>

<h3>Booking Premium Seats</h3>
<p>For the best experience, consider Royal Circle or Dress Circle seats in most theatres. Premium booking services offer excellent seats and VIP packages including pre-theatre dining.</p>

<h3>Theatre Etiquette</h3>
<p>West End theatres maintain traditional standards. Dress smartly, arrive early, and ensure mobile phones are completely silenced. Many theatres offer excellent pre-theatre dining options.</p>`,
        category: 'Entertainment',
        author: 'Victoria Elite Team',
        read_time: 6,
        image: '/images/london-gala-event.webp',
        meta_description: 'Complete guide to London\'s West End theatre, including must-see shows, booking tips, historic venues, and theatre etiquette.',
        seo_keywords: 'West End theatre London, London shows, Hamilton London, West End musicals',
        service_keywords: ['theatre experiences', 'cultural events', 'entertainment', 'live shows'],
        is_published: true,
        published_at: '2025-01-11T10:00:00Z'
      },
      {
        slug: 'london-luxury-spa-wellness-guide',
        title: 'Ultimate Guide to Luxury Spa and Wellness in London',
        excerpt: 'Discover London\'s finest spa sanctuaries, from The Dorchester Spa to ESPA Life at Corinthia, for ultimate relaxation and rejuvenation.',
        content: `<h2>London's Premier Spa Destinations</h2>
<p>London offers world-class spa and wellness facilities, combining ancient therapies with cutting-edge treatments in luxurious settings.</p>

<h3>ESPA Life at Corinthia</h3>
<p>Spanning four floors, this 3,300 square meter sanctuary features a vitality pool, amphitheater sauna, ice fountain, and private spa suites. Treatments combine ESPA's renowned expertise with personalized wellness programs.</p>

<h3>The Dorchester Spa</h3>
<p>This intimate Park Lane spa offers bespoke treatments in elegantly appointed rooms. Signature treatments include gold facials and the Dorchester Signature Massage.</p>

<h3>Aman Spa at The Connaught</h3>
<p>A tranquil Mayfair sanctuary featuring traditional hammam treatments, Japanese-inspired therapies, and personalized wellness consultations.</p>

<h3>Mandarin Oriental Hyde Park Spa</h3>
<p>Combining Asian-inspired treatments with cutting-edge technology, this award-winning spa overlooks Hyde Park. The Oriental Suite provides the ultimate private spa experience.</p>

<h3>Spa at The Ned</h3>
<p>Set in the former bank's vault, this unique spa features a hammam, monsoon showers, and exceptional Cowshed products.</p>

<h3>Booking and Etiquette</h3>
<p>Book treatments well in advance, especially for weekends. Arrive 30 minutes early to enjoy facilities, and communicate any preferences or concerns to your therapist.</p>`,
        category: 'Wellness',
        author: 'Victoria Elite Team',
        read_time: 6,
        image: '/images/luxury-spa-treatment.webp',
        meta_description: 'Explore London\'s best luxury spas including ESPA Life, The Dorchester Spa, and Mandarin Oriental for ultimate wellness and relaxation.',
        seo_keywords: 'luxury spa London, best spas London, ESPA Life Corinthia, wellness London',
        service_keywords: ['luxury spa', 'wellness treatments', 'relaxation', 'spa experiences'],
        is_published: true,
        published_at: '2025-01-10T10:00:00Z'
      },
      {
        slug: 'london-private-art-galleries-collections',
        title: 'London\'s Private Art Galleries and Exclusive Collections',
        excerpt: 'Explore London\'s world-renowned art scene, from major museums to exclusive private galleries and viewing rooms.',
        content: `<h2>London's Art Scene</h2>
<p>London remains one of the world's most important art centers, with an unrivaled combination of public museums and exclusive private galleries.</p>

<h3>Major Public Collections</h3>
<p><strong>The National Gallery</strong> - Trafalgar Square's iconic gallery houses Western European paintings from the 13th to 19th centuries.</p>
<p><strong>Tate Modern</strong> - International modern and contemporary art in a transformed power station on the South Bank.</p>
<p><strong>The Wallace Collection</strong> - An exceptional private collection of fine arts housed in historic Hertford House.</p>

<h3>Mayfair Gallery District</h3>
<p>Cork Street, Dover Street, and surrounding areas host the world's leading commercial galleries, including White Cube, Gagosian, and Pace Gallery.</p>

<h3>Private Viewing Experiences</h3>
<p>Many galleries offer private viewings for serious collectors. Contact galleries directly or through art advisors for exclusive access.</p>

<h3>Art Fairs</h3>
<p>London hosts major international art fairs, including Frieze London and Masterpiece, offering unparalleled access to world-class art.</p>`,
        category: 'Culture',
        author: 'Victoria Elite Team',
        read_time: 7,
        image: '/images/savoy-thames-foyer.webp',
        meta_description: 'Guide to London\'s art galleries, museums, and private collections, from the National Gallery to exclusive Mayfair galleries.',
        seo_keywords: 'London art galleries, private art viewing London, Mayfair galleries, Frieze London',
        service_keywords: ['art galleries', 'cultural experiences', 'private viewings', 'fine art'],
        is_published: true,
        published_at: '2025-01-09T10:00:00Z'
      },
      {
        slug: 'london-exclusive-nightlife-guide',
        title: 'London\'s Most Exclusive Nightlife: Clubs, Bars, and Late Night Venues',
        excerpt: 'Navigate London\'s elite nightlife scene, from exclusive members clubs to hidden speakeasies and world-renowned cocktail bars.',
        content: `<h2>London After Dark</h2>
<p>London's nightlife offers sophisticated experiences ranging from exclusive clubs to innovative cocktail bars, setting global standards for evening entertainment.</p>

<h3>Exclusive Nightclubs</h3>
<p><strong>Annabel's</strong> - Berkeley Square's legendary club remains the pinnacle of exclusive nightlife, featuring multiple themed rooms and impeccable service.</p>
<p><strong>Chiltern Firehouse</strong> - André Balazs's Marylebone hotspot combines restaurant, bar, and late-night destination for London's elite.</p>

<h3>World-Class Cocktail Bars</h3>
<p><strong>The Connaught Bar</strong> - David Collins's art deco masterpiece offers exceptional cocktails in an intimate Mayfair setting.</p>
<p><strong>American Bar at The Savoy</strong> - The longest surviving American bar in Europe, recently restored to its 1920s glamour.</p>
<p><strong>GŎNG at Shangri-La</strong> - Europe's highest bar offers spectacular cocktails with panoramic London views from level 52.</p>

<h3>Hidden Speakeasies</h3>
<p>London excels at secretive bars. Evans & Peel Detective Agency requires solving a "case," while Mayor of Scaredy Cat Town is accessed through a refrigerator.</p>

<h3>Dress Codes and Access</h3>
<p>Most exclusive venues maintain strict dress codes and door policies. Reservations are essential for popular bars, while club access often requires memberships or connections.</p>`,
        category: 'Nightlife',
        author: 'Victoria Elite Team',
        read_time: 6,
        image: '/images/shangri-la-shard-view.webp',
        meta_description: 'Discover London\'s most exclusive nightlife, from Annabel\'s to hidden speakeasies and world-renowned cocktail bars.',
        seo_keywords: 'London nightlife, exclusive clubs London, best bars London, Annabel\'s London',
        service_keywords: ['exclusive nightlife', 'cocktail bars', 'private clubs', 'evening entertainment'],
        is_published: true,
        published_at: '2025-01-08T10:00:00Z'
      }
    ];

    const { data, error: insertError } = await supabase
      .from('blog_posts')
      .insert(articles);

    if (insertError) {
      console.error('Error inserting articles:', insertError);
      throw insertError;
    }

    console.log(`Successfully seeded ${articles.length} blog posts`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Blog reset complete. Inserted ${articles.length} curated articles.`,
        articles_count: articles.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in blog-reset-seed:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to reset and seed blog posts'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
