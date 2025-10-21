import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEOOptimized } from "@/components/SEOOptimized";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from "@/utils/structuredData";

import { toast } from "sonner";
import { useState } from "react";

// Removed image mapper import for better performance
import { OptimizedImage } from "@/components/OptimizedImage";
import { blogArticles } from "@/data/blog-articles";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Blog = () => {
  
  const { posts, loading, error, categories, refetch } = useBlogPosts();
  
  const [refreshing, setRefreshing] = useState(false);

  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Blog", url: "https://fivelondon.com/blog" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Five London Blog - Exclusive London Guide",
      description:
        "Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with luxury recommendations.",
      url: "https://fivelondon.com/blog",
      inLanguage: "en-GB",
      publisher: {
        "@type": "Organization",
        name: "Five London",
        url: "https://fivelondon.com",
        logo: "https://fivelondon.com/logo.png",
      },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: `https://fivelondon.com/blog/${post.slug}`,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: {
          "@type": "Organization",
          name: post.author,
        },
        image: post.image,
        keywords: post.seo_keywords,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://fivelondon.com/blog/${post.slug}`,
        },
      })),
    },
  ];

  if (loading) {
    return (
      <>
        <SEOOptimized
          title="Blog - Exclusive London Guide & Luxury Lifestyle | Five London"
          description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with insider recommendations."
          keywords="London blog, London guide, luxury lifestyle London, best restaurants London, exclusive events London, luxury hotels London"
          canonicalUrl="/blog"
        />
        <div className="min-h-screen bg-white">
          <Navigation />
          <main className="pt-0">
            {/* Hero Section with Loading State */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container-width text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                  <h1 className="text-4xl font-bold mb-6 text-foreground">
                    Discover London
                  </h1>
                  <p className="text-lg text-muted-foreground mb-12">
                    Your exclusive guide to sophisticated experiences, exquisite
                    restaurants, and London's best-kept secrets.
                  </p>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </section>

            {/* Loading Categories */}
            <section className="py-8 border-b border-border bg-muted/30">
              <div className="container-width">
                <div className="flex flex-wrap gap-3 justify-center px-4">
                  <div className="h-8 bg-muted animate-pulse rounded-full w-24"></div>
                  <div className="h-8 bg-muted animate-pulse rounded-full w-20"></div>
                  <div className="h-8 bg-muted animate-pulse rounded-full w-28"></div>
                  <div className="h-8 bg-muted animate-pulse rounded-full w-32"></div>
                </div>
              </div>
            </section>

            {/* Loading Articles */}
            <section className="py-12 md:py-16 lg:py-20 bg-white">
              <div className="container-width">
                <LoadingSpinner size="lg" />
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOOptimized
          title="Blog - Exclusive London Guide & Luxury Lifestyle | Five London"
          description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London."
          canonicalUrl="/blog"
        />
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-0">
            <Alert>
              <AlertDescription>
                Error loading blog posts. <button onClick={refetch} className="underline">Try again</button>
              </AlertDescription>
            </Alert>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOOptimized
        title="Blog - Exclusive London Guide & Luxury Lifestyle | Five London"
        description="Discover the best restaurants, exclusive events, unique experiences and sophisticated hotels in London. Your complete guide to living London in style with insider recommendations from luxury lifestyle experts covering Mayfair, Westminster, Kensington, Chelsea, and Central London."
        keywords="London blog, London guide, luxury lifestyle London, best restaurants London, exclusive events London, luxury hotels London, London experiences, sophisticated dining London, luxury travel London, London lifestyle guide, Mayfair restaurants, Westminster events, Kensington hotels, Chelsea lifestyle, Central London experiences"
        canonicalUrl="/blog"
        structuredData={structuredData}
        additionalMeta={{
          "geo.region": "GB-LND",
          "geo.placename": "London",
          "geo.position": "51.5074;-0.1278",
          ICBM: "51.5074, -0.1278",
          robots: "index,follow,max-image-preview:large",
        }}
      />

      <div className="min-h-screen bg-white">
        
        <Navigation />

        <main className="pt-0">
          {/* Hero Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                  Discover London
                </h1>
                <p className="luxury-body-lg text-black mb-12 md:mb-12">
                  Your exclusive guide to sophisticated experiences, exquisite
                  restaurants, and London's best-kept secrets.
                </p>
                <Button
                  onClick={async () => {
                    setRefreshing(true);
                    try {
                      // Simple refresh fallback
                      await refetch();
                      toast.success('Blog content refreshed!');
                    } catch (error) {
                      toast.error('Failed to refresh content');
                    } finally {
                      setRefreshing(false);
                    }
                  }}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="mb-4"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Content
                </Button>
              </div>
            </div>
            {/* Elegant separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </section>

          {/* Categories */}
          <section className="py-8 border-b border-border bg-muted/30">
            <div className="container-width">
              <div className="flex flex-wrap gap-3 justify-center px-4">
                <Link to="/blog">
                  <Badge
                    variant="secondary"
                    className="px-6 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    All Articles
                  </Badge>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/blog?category=${category.toLowerCase()}`}
                  >
                    <Badge
                      variant="outline"
                      className="px-6 py-2 text-sm font-medium bg-background border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
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
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="group hover:shadow-elegant transition-all duration-300 border border-border/50 hover:border-primary/20 overflow-hidden bg-background"
                  >
                    <div className="aspect-video bg-muted/50 relative overflow-hidden">
                      <OptimizedImage
                        src={post.image || 
                          (blogArticles.find(a => a.slug === post.slug)?.image as string) ||
                          '/images/blog/michelin-dining.webp'
                        }
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        data-blog-image="card"
                        data-post-title={post.title}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className="bg-background/95 backdrop-blur-sm text-foreground text-xs font-medium border border-border/50 shadow-minimal"
                        >
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-4 px-6 pt-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <time
                            dateTime={post.published_at}
                            className="hidden sm:inline"
                          >
                            {new Date(post.published_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </time>
                          <time
                            dateTime={post.published_at}
                            className="sm:hidden"
                          >
                            {new Date(post.published_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{post.read_time} min</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </CardHeader>

                    <CardContent className="pt-0 px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                        {post.excerpt}
                      </p>

                      <Link to={`/blog/${post.slug}`}>
                        <Button
                          variant="ghost"
                          className="group/btn p-0 h-auto font-medium text-foreground hover:text-primary text-sm"
                        >
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

          {/* About London Lifestyle Guide - Collapsible Rich Content */}
          <section className="py-16 bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6 md:p-8">
                <div className="mb-8">
                  <div className="text-center mb-6">
                    <h2 className="luxury-heading-lg text-foreground">About London Luxury Lifestyle Guide</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-4">
                    <h3 className="luxury-heading-md">
                      Exclusive Restaurants and Dining Experiences
                    </h3>
                    <p className="luxury-body-md text-muted-foreground leading-relaxed">
                      Discover London's most prestigious dining venues, from
                      Michelin-starred establishments in Mayfair to exclusive
                      private dining rooms in Knightsbridge. Our curated guide
                      features insider recommendations for romantic dinners,
                      business lunches, and special celebrations.
                    </p>
                    <p className="luxury-body-md text-muted-foreground leading-relaxed">
                      Experience world-class cuisine at venues like Sketch,
                      Hakkasan, and The Ritz Restaurant, where exceptional
                      service meets culinary artistry. Perfect for sophisticated
                      dining experiences with elite companions.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="luxury-heading-md">
                      Premium Hotels and Cultural Events
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="luxury-body-sm font-medium">
                          Luxury Accommodations
                        </h4>
                        <p className="luxury-body-xs text-muted-foreground">
                          Five-star hotels including Claridge's, The Langham,
                          and The Ned, offering world-class amenities and
                          impeccable service.
                        </p>
                      </div>
                      <div>
                        <h4 className="luxury-body-sm font-medium">
                          Cultural Attractions
                        </h4>
                        <p className="luxury-body-xs text-muted-foreground">
                          Premium experiences at Royal Opera House, Tate Modern,
                          and exclusive gallery openings in Chelsea and
                          Shoreditch.
                        </p>
                      </div>
                      <div>
                        <h4 className="luxury-body-sm font-medium">
                          Entertainment Venues
                        </h4>
                        <p className="luxury-body-xs text-muted-foreground">
                          Sophisticated nightlife at exclusive members' clubs,
                          rooftop bars, and luxury entertainment venues across
                          Central London.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container-width text-center">
              <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <h2 className="luxury-heading-lg font-extralight mb-4 text-black">
                  Stay Updated
                </h2>
                <p className="luxury-body-base text-black mb-8">
                  Contact us for the latest London experiences and exclusive
                  recommendations.
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                  onClick={() =>
                    window.open("https://wa.me/447436190679", "_blank")
                  }
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
