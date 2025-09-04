import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogArticles } from "@/data/blog-articles";

const Blog = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Five London Blog",
    "description": "Exclusive guide to luxury experiences in London",
    "url": "https://fivelondon.com/blog",
    "inLanguage": "en-GB",
    "publisher": {
      "@type": "Organization",
      "name": "Five London",
      "url": "https://fivelondon.com"
    },
    "blogPost": blogArticles.map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "url": `https://fivelondon.com/blog/${article.slug}`,
      "datePublished": article.publishedAt,
      "author": {
        "@type": "Organization",
        "name": article.author
      },
      "image": article.image,
      "keywords": article.seoKeywords
    }))
  };

  const categories = [...new Set(blogArticles.map(article => article.category))];

  return (
    <>
      <SEO
        title="Blog - Exclusive London Guide"
        description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style."
        keywords="London blog, London guide, London restaurants, luxury hotels London, London events, exclusive experiences London"
        canonicalUrl="/blog"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-32">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-b from-background to-muted/20">
            <div className="container-width">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-light mb-6 text-foreground">
                  Discover London
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                  Your exclusive guide to sophisticated experiences, exquisite restaurants, 
                  prestigious events and London's best-kept secrets.
                </p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-8 border-b border-border">
            <div className="container-width">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/blog">
                  <Badge variant="secondary" className="px-6 py-2 text-sm">
                    All Articles
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link key={category} to={`/blog?category=${category.toLowerCase()}`}>
                    <Badge variant="outline" className="px-6 py-2 text-sm hover:bg-muted transition-colors">
                      {category}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-20">
            <div className="container-width">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogArticles.map((article) => (
                  <Card key={article.id} className="group hover:shadow-luxury transition-all duration-300 border border-border/50 hover:border-border overflow-hidden">
                    <div className="aspect-video bg-muted/50 relative overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                           <time dateTime={article.publishedAt}>
                             {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                               day: 'numeric',
                               month: 'long',
                               year: 'numeric'
                             })}
                           </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h2>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {article.excerpt}
                      </p>
                      
                      <Link to={`/blog/${article.slug}`}>
                        <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:text-primary/80">
                          Read full article
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-20 bg-muted/20">
            <div className="container-width">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light mb-6 text-foreground">
                  Stay Updated
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Receive our exclusive articles about the best experiences in London 
                  directly in your email.
                </p>
                <Link to="/contact">
                  <Button size="lg" className="five-london-button">
                    Contact Us
                  </Button>
                </Link>
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