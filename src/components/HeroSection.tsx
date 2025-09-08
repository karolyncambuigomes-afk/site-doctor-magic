import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import heroMain from '@/assets/hero-main.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-end">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroMain}
          alt="Luxury London escorts"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Minimalist and positioned at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="luxury-heading-lg mb-4 text-white">
            Five London Elite Companions
          </h1>
          
          <p className="luxury-body-lg mb-6 text-white/90">
            Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea
          </p>
          
          <div className="flex justify-center gap-4">
            <SafeLink to="/models" className="inline-block">
              <button className="bg-white text-black hover:bg-gray-100 px-6 py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                View Models
              </button>
            </SafeLink>
            
            <a
              href="https://wa.me/447436190679"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white text-white hover:bg-white hover:text-black px-6 py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};