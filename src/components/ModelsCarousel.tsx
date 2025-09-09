import { useState, useEffect } from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
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
                  <SafeLink to={model?.id ? `/models/${model.id}` : undefined} className="block">
                    <div className="relative overflow-hidden mb-3 rounded-lg shadow-lg">
                      {/* Exclusive Members Badge */}
                      {model.members_only && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg border border-yellow-400/30 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5">
                              <Crown size={12} className="fill-current text-yellow-100" />
                              <span className="text-xs font-semibold tracking-wide">
                                <span className="hidden sm:inline">EXCLUSIVE</span>
                                <span className="sm:hidden">VIP</span>
                              </span>
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                      
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
                        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10">
                          <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-white/10">
                            <span className="text-white text-xs sm:text-sm font-medium">
                              {model.price}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Info overlay that appears on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                        <div className="space-y-1.5">
                           <h3 className="luxury-heading-sm tracking-normal">
                             {model.name}
                           </h3>
                          <div className="flex items-center justify-between">
                            <p className="luxury-body-sm text-white/90 tracking-normal">
                              {model.age ? `${model.age} anos` : ''}
                            </p>
                            {model.characteristics?.[0] && (
                              <span className="luxury-body-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                {model.characteristics[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Static info below - minimal and elegant */}
                    <div className="text-center px-1">
                       <h3 className="luxury-body-md text-black mb-0.5 tracking-normal group-hover:text-gray-600 transition-colors duration-300">
                         {model.name}
                       </h3>
                       <p className="luxury-body-xs text-gray-600 tracking-normal">
                         {model.location || 'London'}
                       </p>
                    </div>
                  </SafeLink>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-black/20 hover:border-black/40 bg-transparent hover:bg-white/10" />
          <CarouselNext className="hidden md:flex -right-12 border-black/20 hover:border-black/40 bg-transparent hover:bg-white/10" />
        </Carousel>
        
        {/* View All Models Button */}
        <div className="text-center mt-12 md:mt-16">
          <SafeLink 
            to="/models" 
            className="inline-block border border-black/20 hover:border-black/40 px-8 py-3 transition-all duration-300"
          >
            <span className="luxury-body-sm tracking-[0.3em] uppercase font-light text-black">
              All Models
            </span>
          </SafeLink>
        </div>
      </div>
    </section>
  );
};