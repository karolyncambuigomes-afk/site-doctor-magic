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
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-sans text-2xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-black mb-4">
              Discover our exquisite models
            </h2>
            <div className="w-16 h-px bg-black/20 mx-auto"></div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Loading models...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-sans text-2xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-black mb-4">
            Discover our exquisite models
          </h2>
          <div className="w-16 h-px bg-black/20 mx-auto"></div>
        </div>
        
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
                <div className="group">
                  <Link to={`/models/${model.id}`} className="block">
                    <div className="relative overflow-hidden mb-4">
                      {/* Main Image */}
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      {/* Price overlay - Top right corner */}
                      {model.price && (
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 text-sm font-medium tracking-wide z-10 rounded-lg">
                          {model.price}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-sans text-lg font-normal text-black mb-1">
                        {model.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 tracking-wide">
                          {model.age ? `${model.age} anos` : ''} {model.age && model.characteristics?.[0] ? '•' : ''} {model.characteristics?.[0] || ''}
                        </p>
                      </div>
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
        <div className="text-center mt-16 md:mt-24">
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