import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import heroMain from '@/assets/hero-main.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroMain}
          alt="Luxury London escorts"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 tracking-wide leading-tight">
            Five London Elite Companions
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-8 leading-relaxed text-white/90 max-w-3xl mx-auto">
            Experience unparalleled sophistication with Five London's carefully curated selection of elite companions in Mayfair, Knightsbridge and Chelsea
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <SafeLink to="/models" className="inline-block">
                <button className="bg-white text-black hover:bg-gray-100 px-8 py-4 transition-all duration-300 font-medium tracking-wider uppercase text-sm">
                  View Our Models
                </button>
              </SafeLink>
              
              <a
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 transition-all duration-300 font-medium tracking-wider uppercase text-sm"
              >
                Book Now - 24/7
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};