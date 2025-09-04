import { useParams, Link, Navigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { locations } from '@/data/locations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowLeft, Phone, Calendar, Star, Users } from 'lucide-react';

const LocationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = locations.find(loc => loc.slug === slug);

  if (!location) {
    return <Navigate to="/404" replace />;
  }

  const relatedLocations = locations.filter(loc => loc.id !== location.id).slice(0, 3);

  return (
    <>
      <SEO 
        title={location.seoTitle}
        description={location.seoDescription}
        keywords={location.keywords.join(', ')}
        canonicalUrl={`/locations/${location.slug}`}
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-32">
          {/* Breadcrumb */}
          <section className="py-6 border-b border-border">
            <div className="container-width">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <span>/</span>
                <Link to="/locations" className="hover:text-foreground transition-colors">Locations</Link>
                <span>/</span>
                <span className="text-foreground">{location.name}</span>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
            <div className="container-width">
              <div className="max-w-4xl mx-auto">
                <Link 
                  to="/locations" 
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Locations
                </Link>
                
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h1 className="heading-xl mb-4">
                      Elite Escorts in {location.name}
                    </h1>
                    <p className="body-lg text-muted-foreground">
                      {location.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="section-padding">
            <div className="container-width">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: location.content }}
                  />
                  
                  {/* Features */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-primary" />
                          <CardTitle className="heading-sm">Premium Quality</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="body-sm text-muted-foreground">
                          Only the finest companions, carefully selected for their elegance and sophistication.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-primary" />
                          <CardTitle className="heading-sm">Local Expertise</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="body-sm text-muted-foreground">
                          Our escorts know {location.name} intimately and can enhance your experience.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Contact Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-md">Book Now</CardTitle>
                      <CardDescription>
                        Contact us to arrange your companion in {location.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <a href="tel:+442045678901" className="w-full">
                        <Button className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </a>
                      <Link to="/contact" className="block">
                        <Button variant="outline" className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Send Inquiry
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="heading-md">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link 
                        to="/models" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Browse Our Models
                      </Link>
                      <Link 
                        to="/services" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Our Services
                      </Link>
                      <Link 
                        to="/faq" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Frequently Asked Questions
                      </Link>
                      <Link 
                        to="/reviews" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Client Reviews
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Related Locations */}
          <section className="section-padding bg-muted/50">
            <div className="container-width">
              <div className="text-center mb-12">
                <h2 className="heading-lg mb-4">
                  Other London Locations
                </h2>
                <p className="body-lg text-muted-foreground">
                  Discover our services in other prestigious London districts
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedLocations.map((relatedLocation) => (
                  <Card key={relatedLocation.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <CardTitle className="heading-sm mb-2">{relatedLocation.name}</CardTitle>
                          <CardDescription className="body-sm">
                            {relatedLocation.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Link to={`/locations/${relatedLocation.slug}`}>
                        <Button variant="outline" className="w-full">
                          View {relatedLocation.name}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default LocationDetail;