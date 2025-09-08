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
          <h1 className="heading-2xl font-display font-light mb-6 tracking-wide">
            Five London Elite Companions
          </h1>
          
          <p className="body-lg font-light mb-8 leading-relaxed text-white/90">
            Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea
          </p>
          
          <div className="flex justify-center gap-4">
            <SafeLink to="/models" className="inline-block">
              <button className="btn-luxury px-8 py-3 text-sm tracking-wider uppercase">
                View Models
              </button>
            </SafeLink>
            
            <a
              href="https://wa.me/447436190679"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-luxury px-8 py-3 text-sm tracking-wider uppercase inline-block"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};