import { Link } from "react-router-dom";
import { useSafeParams } from "@/hooks/useSafeRouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOOptimized } from "@/components/SEOOptimized";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useSafeParams() as { slug?: string };
  const { getPostBySlug, getRelatedPosts, loading } = useBlogPosts();

  if (!slug) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container-width py-16 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Loading article...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const article = getPostBySlug(slug);

  if (!article) {
    return <NotFound />;
  }

  const relatedArticles = getRelatedPosts(slug, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Organization",
      name: article.author,
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
    keywords: article.seo_keywords,
    articleSection: article.category,
    wordCount: article.content.length,
    timeRequired: `PT${article.read_time}M`,
  };

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

                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  {article.title}
                </h1>

                <p className="luxury-body-lg text-black">{article.excerpt}</p>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.read_time} minutes read</span>
                  </div>
                  <div>By {article.author}</div>
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
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="pb-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="prose prose-lg max-w-none [&>*]:text-black [&>p]:text-black [&>h1]:text-black [&>h2]:text-black [&>h3]:text-black [&>h4]:text-black [&>li]:text-black [&>strong]:text-black">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
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
                            {relatedArticle.excerpt.substring(0, 120)}...
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
                <p className="luxury-body-lg text-gray-700 mb-8">
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
                      variant="outline"
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
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
