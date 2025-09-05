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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/models">
                  <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    View Our Models
                  </button>
                </Link>
                
                <a href="tel:+447436190679">
                  <button 
                    className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors"
                    onClick={() => window.open('https://wa.me/447436190679', '_blank')}
                  >
                    Contact Us
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}


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