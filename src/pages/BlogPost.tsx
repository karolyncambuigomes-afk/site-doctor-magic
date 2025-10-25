import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSafeParams } from "@/hooks/useSafeRouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { SEOOptimized } from "@/components/SEOOptimized";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { SkipToContent } from "@/components/SkipToContent";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useSafeParams() as { slug?: string };
  const { getPostBySlug, getRelatedPosts, loading } = useBlogPosts();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback: load static article if slug not found in DB posts
  const [fallbackArticle, setFallbackArticle] = useState<any | null>(null);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setAttemptedFallback(false);
      setFallbackArticle(null);
      if (!slug) return;
      const inState = getPostBySlug(slug);
      if (!inState) {
        try {
          const { blogArticles } = await import('@/data/blog-articles');
          const a = blogArticles.find((x: any) => x.slug === slug);
          if (!cancelled && a) {
            setFallbackArticle({
              id: a.slug,
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt,
              content: a.content,
              image: a.image,
              author: a.author,
              category: a.category,
              meta_description: a.metaDescription,
              seo_keywords: a.seoKeywords,
              read_time: a.readTime,
              is_published: true,
              published_at: a.publishedAt,
              service_keywords: a.serviceAreas || [],
              created_at: a.publishedAt,
              updated_at: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn('[Blog] Static fallback load failed', e);
        } finally {
          if (!cancelled) setAttemptedFallback(true);
        }
      } else {
        if (!cancelled) setAttemptedFallback(true);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, getPostBySlug]);

  if (!slug) {
    return <NotFound />;
  }

  if (loading && !attemptedFallback) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <SkipToContent />
        
        <main className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Title Skeleton */}
            <Skeleton className="h-16 w-3/4 mx-auto" />
            
            {/* Excerpt Skeleton */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            
            {/* Meta Info Skeleton */}
            <div className="flex items-center gap-4 justify-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            {/* Image Skeleton */}
            <Skeleton className="aspect-video w-full rounded-lg" />
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-4 w/full" />
              <Skeleton className="h-4 w/full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w/full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  const article = getPostBySlug(slug) || fallbackArticle;

  // Debug logging to capture runtime issues
  React.useEffect(() => {
    try {
      console.log('[BlogPost] Render', { slug, hasArticle: !!article, articleKeys: article ? Object.keys(article) : [] });
    } catch {}
  }, [slug, article]);

  if (!article) {
    return <NotFound />;
  }

  const relatedArticles = getRelatedPosts(slug, 3);

  // Process content for better performance and accessibility
  const processedContent = useMemo(() => {
    try {
      if (!article || typeof article.content !== 'string') return '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = article.content || '';
      // Add IDs to headers for navigation
      tempDiv.querySelectorAll('h2, h3, h4').forEach((heading, index) => {
        try { (heading as HTMLElement).id = (heading as HTMLElement).id || `section-${index}`; } catch {}
      });
      return tempDiv.innerHTML;
    } catch (e) {
      console.warn('[Blog] Failed to process content', e);
      return article?.content || '';
    }
  }, [article]);

  const structuredData = useMemo(() => {
    try {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title || '',
        description: article.excerpt || '',
        image: article.image || '',
        datePublished: article.published_at || undefined,
        dateModified: article.updated_at || undefined,
        author: {
          "@type": "Organization",
          name: article.author || 'Five London',
          url: "https://fivelondon.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Five London",
          logo: {
            "@type": "ImageObject",
            url: "https://fivelondon.com/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://fivelondon.com/blog/${article.slug}`,
        },
        keywords: article.seo_keywords || '',
        articleSection: article.category || '',
        wordCount: (article.content || '').length,
        timeRequired: `PT${Number(article.read_time || 0)}M`,
      } as const;
    } catch (e) {
      console.warn('[Blog] Failed to build structured data', e);
      return undefined;
    }
  }, [article]);

  return (
    <>
      <SEOOptimized
        title={article.title}
        description={article.meta_description}
        keywords={article.seo_keywords}
        canonicalUrl={`/blog/${article.slug}`}
        ogImage={article.image}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-white">
        <Navigation />

        <main className="pt-0">
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
          <section className="pt-20 pb-16 md:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Badge variant="secondary" className="mb-4">
                  {article.category}
                </Badge>

                <h1 
                  id="article-title"
                  className="luxury-heading-xl mb-4 sm:mb-6 text-gray-900 font-light"
                >
                  {article.title}
                </h1>

                <p className="luxury-body-lg text-gray-700 font-light">{article.excerpt}</p>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
                  {article.published_at && !isNaN(new Date(article.published_at as string).getTime()) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={article.published_at} className="text-gray-600">
                        {new Date(article.published_at as string).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </time>
                    </div>
                  )}
                  {Number(article.read_time) > 0 && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-gray-600">{article.read_time} minutes read</span>
                    </div>
                  )}
                  {article.author && (
                    <div className="text-gray-900 font-medium">By {article.author}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </section>

          {/* Featured Image */}
          <section className="py-8 bg-white">
            <div className="container-width">
              <div className="max-w-4xl mx-auto">
                {article.image && (
                  <div className="aspect-video relative overflow-hidden rounded-lg mb-12 bg-gray-100">
                    <OptimizedImage
                      src={article.image}
                      alt={`Featured image for article: ${article.title}. ${(article.excerpt || '').substring(0, 100)}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      priority={true}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                    {!imageLoaded && !imageError && (
                      <Skeleton className="absolute inset-0" />
                    )}
                    {imageError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <p className="text-gray-500">Image not available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <article 
            className="pb-20 bg-white"
            role="article"
            aria-labelledby="article-title"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="blog-content prose prose-lg max-w-none
                  [&>p]:mb-6 [&>p]:leading-8 [&>p]:text-gray-800
                  [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-3xl [&>h2]:font-light [&>h2]:text-gray-900
                  [&>h3]:mt-10 [&>h3]:mb-5 [&>h3]:text-2xl [&>h3]:font-normal [&>h3]:text-gray-900
                  [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-xl [&>h4]:font-medium [&>h4]:text-gray-900
                  [&>ul]:my-6 [&>ul]:space-y-3 [&>ul>li]:leading-7 [&>ul>li]:text-gray-800
                  [&>ol]:my-6 [&>ol]:space-y-3 [&>ol>li]:leading-7 [&>ol>li]:text-gray-800
                  [&>strong]:text-gray-900 [&>strong]:font-semibold"
                >
                  <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                </div>
              </div>
            </div>
          </article>

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
                      <Card
                        key={relatedArticle.id}
                        className="group hover:shadow-luxury transition-all duration-300 border border-border/50 hover:border-border overflow-hidden"
                      >
                        <div className="aspect-video bg-muted/50 relative overflow-hidden">
                          <img
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge
                              variant="secondary"
                              className="bg-background/90 text-foreground"
                            >
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
                            {(relatedArticle.excerpt || '').substring(0, 120)}...
                          </p>
                          <Link to={`/blog/${relatedArticle.slug}`}>
                            <Button
                              variant="ghost"
                              className="group/btn p-0 h-auto font-medium text-gray-600 hover:text-gray-800"
                            >
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
                <p className="luxury-body-lg text-black mb-8">
                  Contact us to plan your exclusive experience in London with
                  our luxury companion services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() =>
                        window.open("https://wa.me/447436190679", "_blank")
                      }
                    >
                      Contact Us
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Our Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

      <ContactBar showOnScroll={false} />
      <Footer />
      </div>
    </>
  );
};

export default BlogPost;
