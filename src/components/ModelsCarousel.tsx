import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useModels } from '@/hooks/useModels';

export const ModelsCarousel = () => {
  const { models, loading } = useModels();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const modelsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(models.length / modelsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  const getCurrentModels = () => {
    const startIndex = currentIndex * modelsPerPage;
    return models.slice(startIndex, startIndex + modelsPerPage);
  };

  if (loading) {
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
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-transparent hover:bg-white/5 border border-white/0 hover:border-white/20 transition-all duration-500 flex items-center justify-center group backdrop-blur-sm"
                aria-label="Previous models"
              >
                <ChevronLeft className="w-4 h-4 text-black/40 group-hover:text-black/70 transition-all duration-300" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-transparent hover:bg-white/5 border border-white/0 hover:border-white/20 transition-all duration-500 flex items-center justify-center group backdrop-blur-sm"
                aria-label="Next models"
              >
                <ChevronRight className="w-4 h-4 text-black/40 group-hover:text-black/70 transition-all duration-300" />
              </button>
            </>
          )}
          
          {/* Models Grid */}
          <div className={`grid gap-8 max-w-4xl mx-auto ${
            isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 md:gap-12'
          }`}>
            {getCurrentModels().map((model) => (
              <div key={model.id} className="group">
                <Link to={`/models/${model.id}`} className="block">
                  <div className="relative overflow-hidden mb-4">
                    {/* Main Image */}
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:opacity-0 absolute inset-0"
                    />
                    {/* Second Image (from gallery) */}
                    {model.gallery && model.gallery[1] && (
                      <img
                        src={model.gallery[1]}
                        alt={`${model.name} - alternate view`}
                        className="w-full aspect-[3/4] object-cover transition-all duration-700 opacity-0 group-hover:opacity-100"
                      />
                    )}
                    {/* Price overlay */}
                    {model.price && (
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-sm font-light tracking-wide z-10">
                        {model.price}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-sans text-lg font-normal text-black mb-1">
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-600 tracking-wide">
                      {model.location}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-black scale-125' 
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
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