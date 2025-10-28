import React from 'react';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactBar } from '@/components/ContactBar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';
import { generateReviewAggregateSchema, generateBreadcrumbSchema as generateAdvancedBreadcrumbs } from '@/utils/advancedStructuredData';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useReviews } from '@/hooks/useReviews';
import { ReviewCard } from '@/components/ReviewCard';

export const Reviews: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();
  const { data: reviewData, isLoading } = useReviews();

  // Generate enhanced structured data for reviews
  const structuredData = [
    generateOrganizationSchema(),
    generateAdvancedBreadcrumbs(breadcrumbs),
    ...(reviewData ? [generateReviewAggregateSchema(reviewData, "Five London")] : []),
    {
      "@context": "https://schema.org",
      "@type": "ReviewPage", 
      "about": {
        "@type": "Organization",
        "name": "Five London",
        "description": "Premier luxury escort agency in London"
      },
      "review": reviewData?.reviews.slice(0, 20).map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author_initial
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": 5
        },
        "reviewBody": review.review_text
      })) || []
    }
  ];

  return (
    <>
      <SEOOptimized 
        title="Client Reviews - Five London | Premium Escort Testimonials"
        description="Read authentic reviews from our satisfied clients about their experiences with Five London's premium escort services. Discover why discerning gentlemen choose us for exceptional companionship."
        keywords="escort reviews London, client testimonials, luxury companionship reviews, Five London reviews, premium escort testimonials"
        canonicalUrl="/reviews"
        structuredData={structuredData}
      />
      <Navigation />
      
      <main className="pt-0 bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:py-24 bg-white">
          <div className="container-width text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
                Client Reviews
              </h1>
              <p className="luxury-body-lg text-black mb-12 md:mb-12">
                Discover why discerning gentlemen choose Five London for exceptional companionship experiences.
              </p>
            </div>
          </div>
          {/* Elegant separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 mb-8">
            <Breadcrumbs 
              items={[{ label: "Reviews" }]}
              className="text-gray-600"
            />
          </div>
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="luxury-body-lg text-gray-600">Loading reviews...</p>
              </div>
            ) : reviewData && reviewData.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviewData.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    rating={review.rating}
                    reviewText={review.review_text}
                    authorInitial={review.author_initial}
                    createdAt={review.created_at}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="luxury-body-lg text-gray-600">No reviews available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-6 text-gray-800">What Our Clients Say</h2>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Service Quality Reviews</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Our clients consistently praise Five London for exceptional service quality, professionalism, and attention to detail. From business executives to international visitors, discerning gentlemen trust us for their most important occasions across London.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Professional Excellence</h4>
                      <p className="luxury-body-xs text-muted-foreground">Clients appreciate our companions' sophistication, intelligence, and ability to adapt to any social or business setting.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">Discretion Guaranteed</h4>
                      <p className="luxury-body-xs text-muted-foreground">100% confidentiality maintained for all bookings across London's most exclusive venues and private locations.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="luxury-heading-md">Companion Experiences</h3>
                  <p className="luxury-body-md text-muted-foreground leading-relaxed">
                    Reviews consistently highlight the exceptional quality of our companions, from their elegance and conversation skills to their professional demeanor at high-profile events, cultural occasions, and intimate dinner settings.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="luxury-body-sm font-medium">Cultural Sophistication</h4>
                      <p className="luxury-body-xs text-muted-foreground">Companions well-versed in arts, business, and current affairs, perfect for London's cultural scene and business environment.</p>
                    </div>
                    <div>
                      <h4 className="luxury-body-sm font-medium">International Appeal</h4>
                      <p className="luxury-body-xs text-muted-foreground">Multilingual companions experienced with international clientele visiting London for business and leisure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="luxury-heading-lg mb-6 text-black">Experience Excellence</h2>
            <p className="luxury-body-lg text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our satisfied clients and discover the Five London difference. Contact us today to experience the finest luxury companionship services in London.
            </p>
          </div>
        </section>
      </main>

      <ContactBar showOnScroll={false} />
      <Footer />
    </>
  );
};

export default Reviews;