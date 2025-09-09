import { Link } from "react-router-dom";
import { useSafeParams } from '@/hooks/useSafeRouter';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogArticleBySlug, getRelatedArticles } from "@/data/blog-articles";
import { BlogContentRenderer } from "@/components/BlogContentRenderer";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useSafeParams() as { slug?: string };
  
  if (!slug) {
    return <NotFound />;
  }

  const article = getBlogArticleBySlug(slug);
  
  if (!article) {
    return <NotFound />;
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.publishedAt,
    "dateModified": article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": "https://fivelondon.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Five London",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fivelondon.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fivelondon.com/blog/${article.slug}`
    },
    "keywords": article.seoKeywords,
    "articleSection": article.category,
    "wordCount": article.content.length,
    "timeRequired": `PT${article.readTime}M`
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.metaDescription}
        keywords={article.seoKeywords}
        canonicalUrl={`/blog/${article.slug}`}
        ogImage={article.image}
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-16">
          {/* Breadcrumb */}
          <section className="py-8 border-b border-border">
            <div className="container-width">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </section>

          {/* Article Header */}
          <section className="py-12 md:py-16 bg-white">
            <div className="container-width">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Badge variant="secondary" className="mb-4">
                    {article.category}
                  </Badge>
                  
                  <h1 className="luxury-heading-display mb-6 text-black leading-tight">
                    {article.title}
                  </h1>
                  
                  <p className="luxury-body-lg text-gray-700 leading-relaxed mb-8">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                       <time dateTime={article.publishedAt}>
                         {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                           day: 'numeric',
                           month: 'long',
                           year: 'numeric'
                         })}
                       </time>
                    </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime} minutes read</span>
                        </div>
                        <div>
                          By {article.author}
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-12">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="pb-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <BlogContentRenderer content={article.content} slug={article.slug} />
              </div>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container-width">
                <div className="max-w-6xl mx-auto">
                   <h2 className="luxury-heading-xl mb-12 text-center text-black">
                     Related Articles
                   </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedArticles.map((relatedArticle) => (
                      <Card key={relatedArticle.id} className="group hover:shadow-luxury transition-all duration-300 border border-border/50 hover:border-border overflow-hidden">
                        <div className="aspect-video bg-muted/50 relative overflow-hidden">
                          <img 
                            src={relatedArticle.image} 
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-background/90 text-foreground">
                              {relatedArticle.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader className="pb-4">
                           <h3 className="luxury-heading-sm font-medium text-black group-hover:text-gray-700 transition-colors leading-tight">
                             {relatedArticle.title}
                           </h3>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                           <p className="luxury-body-sm text-gray-600 leading-relaxed mb-6">
                             {relatedArticle.excerpt.substring(0, 120)}...
                           </p>
                          
                          <Link to={`/blog/${relatedArticle.slug}`}>
                            <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-foreground hover:text-foreground/80">
                              Read article
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="py-16 bg-white">
            <div className="container-width">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="luxury-heading-xl mb-6 text-black">
                  Ready for Your London Experience?
                </h2>
                <p className="luxury-body-lg text-gray-700 mb-8">
                  Contact us to plan your exclusive experience 
                  in London with our luxury companion services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button 
                      size="lg" 
                      className="five-london-button"
                      onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                    >
                      Contact Us
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button size="lg" variant="outline" className="five-london-button-outline">
                      Our Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;