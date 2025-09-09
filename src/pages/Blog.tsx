import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogArticles } from "@/data/blog-articles";
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/utils/structuredData';

const Blog = () => {
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Blog", url: "https://fivelondon.com/blog" }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Five London Blog - Exclusive London Guide",
      "description": "Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with luxury recommendations.",
      "url": "https://fivelondon.com/blog",
      "inLanguage": "en-GB",
      "publisher": {
        "@type": "Organization",
        "name": "Five London",
        "url": "https://fivelondon.com",
        "logo": "https://fivelondon.com/logo.png"
      },
      "blogPost": blogArticles.map(article => ({
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.excerpt,
        "url": `https://fivelondon.com/blog/${article.slug}`,
        "datePublished": article.publishedAt,
        "dateModified": article.publishedAt,
        "author": {
          "@type": "Organization",
          "name": article.author
        },
        "image": article.image,
        "keywords": article.seoKeywords,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://fivelondon.com/blog/${article.slug}`
        }
      }))
    }
  ];

  const categories = [...new Set(blogArticles.map(article => article.category))];

  return (
    <>
      <SEO
        title="Blog - Exclusive London Guide & Luxury Lifestyle | Five London"
        description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with insider recommendations from luxury lifestyle experts covering Mayfair, Westminster, Kensington, Chelsea, and Central London."
        keywords="London blog, London guide, luxury lifestyle London, best restaurants London, exclusive events London, luxury hotels London, London experiences, sophisticated dining London, luxury travel London, London lifestyle guide, Mayfair restaurants, Westminster events, Kensington hotels, Chelsea lifestyle, Central London experiences"
        canonicalUrl="/blog"
        structuredData={structuredData}
        additionalMeta={{
          "geo.region": "GB-LND",
          "geo.placename": "London",
          "geo.position": "51.5074;-0.1278",
          "ICBM": "51.5074, -0.1278",
          "robots": "index,follow,max-image-preview:large"
        }}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  Discover London
                </h1>
                <p className="luxury-body-lg text-black">
                  Your exclusive guide to sophisticated experiences, exquisite restaurants, and London's best-kept secrets.
                </p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-6 sm:py-8 border-b border-border bg-gray-50">
            <div className="container-width">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center px-4">
                <Link to="/blog">
                  <Badge variant="secondary" className="px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-xs sm:text-sm">
                    All Articles
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link key={category} to={`/blog?category=${category.toLowerCase()}`}>
                    <Badge variant="outline" className="px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-xs sm:text-sm bg-black text-white hover:bg-gray-800 transition-colors">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container-width">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6">
                {blogArticles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-luxury transition-all duration-300 border border-border/50 hover:border-border overflow-hidden">
                    <div className="aspect-video bg-muted/50 relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <Badge variant="secondary" className="bg-background/90 text-black text-xs">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6 bg-white">
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                           <time dateTime={article.publishedAt} className="hidden sm:inline">
                             {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                               day: 'numeric',
                               month: 'long',
                               year: 'numeric'
                             })}
                           </time>
                           <time dateTime={article.publishedAt} className="sm:hidden">
                             {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                               day: 'numeric',
                               month: 'short'
                             })}
                           </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                      
                      <h2 className="luxury-heading-sm font-medium text-black group-hover:text-black/80 transition-colors leading-tight">
                        {article.title}
                      </h2>
                    </CardHeader>
                    
                    <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6 bg-white">
                      <p className="luxury-body-xs text-black leading-relaxed mb-4 sm:mb-6">
                        {article.excerpt}
                      </p>
                      
                      <Link to={`/blog/${article.slug}`}>
                        <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-black hover:text-black/80 luxury-body-sm">
                          Read full article
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* SEO Content - Invisible */}
          <div className="sr-only">
            <h2>London Luxury Lifestyle Guide - Exclusive Experiences and Sophisticated Recommendations</h2>
            <p>Immerse yourself in London's most exclusive lifestyle with our comprehensive guide to the capital's finest experiences. From Michelin-starred restaurants in Mayfair to private members' clubs in Belgravia, cultural events in South Kensington to luxury shopping in Knightsbridge, our insider knowledge reveals the sophisticated side of London that defines true elegance and refinement in one of the world's greatest cities.</p>
            
            <h3>Exclusive Restaurants and Dining Experiences in London's Premier Locations</h3>
            <p>Discover London's culinary excellence through our curated selection of the finest dining establishments. From the innovative cuisine at Sketch in Mayfair to the timeless elegance of Rules in Covent Garden, the contemporary sophistication of Core by Clare Smyth in Notting Hill to the theatrical dining at Dinner by Heston Blumenthal in Knightsbridge. Our guide includes intimate wine bars, exclusive private dining rooms, and hidden gems known only to London's sophisticated elite, ensuring every meal becomes a memorable experience worthy of the most discerning palates.</p>
            
            <h3>Premium Hotels and Accommodations for Sophisticated Stays</h3>
            <p>Experience London's hospitality at its finest with our selection of the capital's most prestigious hotels and accommodations. From the legendary service at The Ritz London and the contemporary luxury of Shangri-La at The Shard to the historic grandeur of Claridge's in Mayfair and the intimate boutique charm of The Ned in the City. Each recommendation represents the pinnacle of London hospitality, offering unparalleled service, elegant accommodations, and locations that place you at the heart of London's most exclusive neighborhoods.</p>
            
            <h3>Cultural Events and Entertainment for the Sophisticated Traveler</h3>
            <p>Engage with London's rich cultural heritage through exclusive events and entertainment experiences. From private viewings at the Tate Modern and Royal Academy to VIP access at West End premieres, from exclusive concerts at the Royal Opera House to intimate gallery openings in Shoreditch. Our cultural guide connects you with London's artistic soul, providing access to events, exhibitions, and performances that showcase the city's position as a global cultural capital.</p>
            
            <h4>Seasonal Events and Exclusive Calendar Highlights</h4>
            <p>Navigate London's sophisticated social calendar with our insider guide to the season's most exclusive events. From Royal Ascot and Wimbledon to the Chelsea Flower Show, from exclusive fashion week parties to private museum galas, from seasonal exhibitions at major galleries to intimate cultural salons in historic venues. Our recommendations ensure you experience London's social and cultural highlights at their most exclusive and sophisticated levels.</p>
            
            <h4>London Neighborhoods Guide for Luxury Lifestyle</h4>
            <p>Explore London's most prestigious neighborhoods, each offering unique characteristics and exclusive experiences. Mayfair's luxury shopping and fine dining, Knightsbridge's high-end retail and cultural sophistication, Chelsea's boutique charm and riverside elegance, Kensington's museum quarter and royal connections, Belgravia's architectural beauty and quiet sophistication, Covent Garden's theatrical heart and artisanal markets, and the City's historic architecture and modern financial power. Each area represents a different facet of London's sophisticated lifestyle, offering endless opportunities for refined experiences and cultural enrichment.</p>
          </div>

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-lg font-extralight mb-4 text-black">Stay Updated</h2>
                <p className="luxury-body-base text-black mb-8">
                  Contact us for the latest London experiences and exclusive recommendations.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                  onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;