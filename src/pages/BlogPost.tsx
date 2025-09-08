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
      
      <div className="min-h-screen bg-background">
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
          <section className="py-16">
            <div className="container-width">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <Badge variant="secondary" className="mb-4">
                    {article.category}
                  </Badge>
                  
                  <h1 className="heading-display mb-6 text-foreground leading-tight">
                    {article.title}
                  </h1>
                  
                  <p className="body-lg text-muted-foreground leading-relaxed mb-8">
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

          {/* Article Content */}
          <section className="pb-20">
            <div className="container-width">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                    prose-headings:font-light prose-headings:text-foreground
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                    prose-li:text-muted-foreground prose-li:leading-relaxed
                    prose-strong:text-foreground prose-strong:font-medium
                    prose-ul:my-6 prose-ol:my-6
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6
                    prose-blockquote:italic prose-blockquote:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="py-20 bg-muted/20">
              <div className="container-width">
                <div className="max-w-6xl mx-auto">
                   <h2 className="heading-xl mb-12 text-center text-foreground">
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
                           <h3 className="heading-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                             {relatedArticle.title}
                           </h3>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                           <p className="body-sm text-muted-foreground leading-relaxed mb-6">
                             {relatedArticle.excerpt.substring(0, 120)}...
                           </p>
                          
                          <Link to={`/blog/${relatedArticle.slug}`}>
                            <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:text-primary/80">
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
          <section className="py-20">
            <div className="container-width">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="heading-xl mb-6 text-foreground">
                  Ready for Your London Experience?
                </h2>
                <p className="body-lg text-muted-foreground mb-8">
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