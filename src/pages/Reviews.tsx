import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEOOptimized } from '@/components/SEOOptimized';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';
import { generateReviewAggregateSchema, generateBreadcrumbSchema as generateAdvancedBreadcrumbs } from '@/utils/advancedStructuredData';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useReviews } from '@/hooks/useReviews';
import { BookNowButton } from '@/components/BookNowButton';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "James M.",
    role: "Business Executive",
    content: "Exceptional service and professionalism. Sofia was the perfect companion for our company's annual gala. Highly recommended.",
    rating: 5
  },
  {
    name: "Robert K.",
    role: "Entrepreneur", 
    content: "Isabella's elegance and conversation skills made our evening unforgettable. Five London exceeded all expectations.",
    rating: 5
  },
  {
    name: "Michael D.",
    role: "Investment Banker",
    content: "Discreet, sophisticated, and charming. Victoria was an excellent choice for our charity dinner. Will definitely book again.",
    rating: 5
  },
  {
    name: "David L.",
    role: "Tech Executive",
    content: "Mei Lin's professionalism and grace were remarkable. Perfect for international business events.",
    rating: 5
  },
  {
    name: "Thomas H.",
    role: "Consultant",
    content: "Outstanding service from start to finish. The booking process was seamless and the experience was beyond expectations.",
    rating: 5
  },
  {
    name: "Andrew W.",
    role: "Finance Director", 
    content: "Five London sets the standard for premium companionship services. Truly exceptional quality.",
    rating: 5
  }
];

export const Reviews: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();
  const { data: reviewData } = useReviews();

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
      "review": testimonials.map(testimonial => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": testimonial.name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": testimonial.rating,
          "bestRating": 5
        },
        "reviewBody": testimonial.content
      }))
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gray-400 text-gray-400" />
                      ))}
                    </div>
                    <p className="luxury-body-md text-gray-800 italic flex-grow leading-relaxed">"{testimonial.content}"</p>
                    <div className="space-y-1 mt-auto">
                      <p className="luxury-heading-xs text-black">{testimonial.name}</p>
                      <p className="luxury-body-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <details className="mb-8">
              <summary className="cursor-pointer luxury-heading-lg text-center mb-6 text-gray-800 hover:text-muted-foreground transition-colors">
                <h2>What Our Clients Say</h2>
              </summary>
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
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="luxury-heading-lg mb-6 text-black">Experience Excellence</h2>
            <p className="luxury-body-lg text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our satisfied clients and discover the Five London difference. Contact us today to experience the finest luxury companionship services in London.
            </p>
            <BookNowButton />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Reviews;