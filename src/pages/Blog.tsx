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
        description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with insider recommendations from luxury lifestyle experts."
        keywords="London blog, London guide, luxury lifestyle London, best restaurants London, exclusive events London, luxury hotels London, London experiences, sophisticated dining London, luxury travel London, London lifestyle guide"
        canonicalUrl="/blog"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-display mb-4 sm:mb-6 text-black">
                  Discover London
                </h1>
                <p className="luxury-body-lg text-black">
                  Your exclusive guide to sophisticated experiences, exquisite restaurants, and London's best-kept secrets.
                </p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-6 sm:py-8 border-b border-border">
            <div className="container-width">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center px-4">
                <Link to="/blog">
                  <Badge variant="secondary" className="px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-xs sm:text-sm">
                    All Articles
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link key={category} to={`/blog?category=${category.toLowerCase()}`}>
                    <Badge variant="outline" className="px-3 sm:px-4 md:px-6 py-1 sm:py-2 text-xs sm:text-sm hover:bg-muted transition-colors">
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
                    
                    <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
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