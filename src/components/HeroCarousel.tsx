import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: '/images/model1.jpg',
    title: 'Five London',
    subtitle: 'Premier luxury companion services'
  },
  {
    id: 2,
    image: '/images/model2.jpg',
    title: 'Sophisticated Elegance',
    subtitle: 'Exclusive experiences in London'
  },
  {
    id: 3,
    image: '/images/model3.jpg',
    title: 'Discretion & Quality',
    subtitle: 'Unparalleled companion services'
  },
  {
    id: 4,
    image: '/images/model4.jpg',
    title: 'Exceptional Standards',
    subtitle: 'Where luxury meets sophistication'
  }
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleSlideChange = (slideIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(slideIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const handleDotClick = (index: number) => {
    if (index !== currentSlide) {
      handleSlideChange(index);
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-6">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl lg:text-2xl font-light tracking-wide text-white/90 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Book Now Button - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-30">
        <Link 
          to="/contact" 
          className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 px-6 py-3 transition-all duration-300"
        >
          <span className="relative z-10 text-sm tracking-[0.2em] uppercase font-light text-white">
            Book Now
          </span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
      </div>

      {/* Navigation Dots - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <div className="w-px h-8 bg-white/40"></div>
      </div>
    </section>
  );
};