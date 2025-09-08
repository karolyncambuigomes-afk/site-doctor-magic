import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
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
  return (
    <>
      <SEO 
        title="Client Reviews - Five London"
        description="Read authentic reviews from our satisfied clients about their experiences with Five London's premium escort services."
        keywords="escort reviews London, client testimonials, luxury companionship reviews"
      />
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-subtle">
          <div className="container-width text-center">
            <h1 className="heading-xl mb-6">Client Reviews</h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Discover why discerning gentlemen choose Five London for exceptional companionship experiences.
            </p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="section-padding">
          <div className="container-width">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="minimal-card h-full">
                  <div className="space-y-4 h-full flex flex-col">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="body-base italic flex-grow">"{testimonial.content}"</p>
                    <div className="space-y-1 mt-auto">
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="body-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-width text-center">
            <h2 className="heading-lg mb-6">Experience Excellence</h2>
            <p className="body-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our satisfied clients and discover the Five London difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="minimal-button bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Book Now: +44 7436 190679
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Reviews;