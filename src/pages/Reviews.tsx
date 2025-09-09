import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/utils/structuredData';
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
  const structuredData = [
    generateOrganizationSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: "https://fivelondon.com/" },
      { name: "Reviews", url: "https://fivelondon.com/reviews" }
    ]),
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
      <SEO 
        title="Client Reviews - Five London | Premium Escort Testimonials"
        description="Read authentic reviews from our satisfied clients about their experiences with Five London's premium escort services. Discover why discerning gentlemen choose us for exceptional companionship."
        keywords="escort reviews London, client testimonials, luxury companionship reviews, Five London reviews, premium escort testimonials"
        canonicalUrl="/reviews"
        structuredData={structuredData}
      />
      <Navigation />
      
      <main className="pt-16 bg-white">
        {/* Breadcrumbs */}
        <section className="py-4 bg-white">
          <div className="container mx-auto px-4">
            <Breadcrumbs 
              items={[{ label: "Reviews" }]}
              className="text-gray-600"
            />
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="luxury-heading-xl mb-6 text-black">Client Reviews</h1>
            <p className="luxury-body-lg text-gray-800 max-w-2xl mx-auto">
              Discover why discerning gentlemen choose Five London for exceptional companionship experiences.
            </p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16 md:py-20 bg-white">
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