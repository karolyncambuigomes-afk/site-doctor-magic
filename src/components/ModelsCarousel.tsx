import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomepageCarousel } from '@/hooks/useHomepageCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const ModelsCarousel = () => {
  const { models, loading } = useHomepageCarousel();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    console.log('ModelsCarousel: Loading models...');
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Models Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {models.map((model) => (
              <CarouselItem key={model.id} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                <div className="group relative">
                  <Link to={`/models/${model.id}`} className="block">
                    <div className="relative overflow-hidden mb-3 rounded-lg shadow-lg">
                      {/* Main Image */}
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      
                      {/* Elegant overlay that appears on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-[1]"></div>
                      
                      {/* Price overlay - refined styling */}
                      {model.price && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/75 backdrop-blur-md text-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-light tracking-normal z-10 rounded-full">
                          {model.price}
                        </div>
                      )}
                      
                      {/* Info overlay that appears on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                        <div className="space-y-1.5">
                          <h3 className="font-light text-base sm:text-lg tracking-normal">
                            {model.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-white/90 tracking-normal">
                              {model.age ? `${model.age} anos` : ''}
                            </p>
                            {model.characteristics?.[0] && (
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                {model.characteristics[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Static info below - minimal and elegant */}
                    <div className="text-center px-1">
                      <h3 className="font-light text-sm sm:text-base text-gray-900 mb-0.5 tracking-normal group-hover:text-gray-600 transition-colors duration-300">
                        {model.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 tracking-normal">
                        {model.location || 'London'}
                      </p>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-black/20 hover:border-black/40 bg-transparent hover:bg-white/10" />
          <CarouselNext className="hidden md:flex -right-12 border-black/20 hover:border-black/40 bg-transparent hover:bg-white/10" />
        </Carousel>
        
        {/* View All Models Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link 
            to="/models" 
            className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300"
          >
            <span className="text-sm tracking-[0.3em] uppercase font-light text-black">
              All Models
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};