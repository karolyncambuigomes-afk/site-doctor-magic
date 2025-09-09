import React from 'react';
import { SafeLink } from '@/components/ui/safe-link';
import heroMain from '@/assets/hero-main.jpg';

export const HeroSection: React.FC = () => {
  return <section className="relative min-h-screen flex items-end">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroMain} alt="Elite luxury escorts and sophisticated companions in London's prestigious Mayfair, Knightsbridge, and Chelsea districts offering discreet premium escort services for discerning clientele" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Minimalist and positioned at bottom */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 text-center text-white">
        <div className="max-w-2xl mx-auto">
          {/* Visible H1 with elegant styling */}
          <h1 className="luxury-heading-lg mb-4 text-white font-light tracking-wide leading-tight">
            Premium London Escort Agency
          </h1>
          <p className="luxury-body-lg mb-6 text-white/90">
            Unparalleled sophistication in Mayfair, Knightsbridge and Chelsea
          </p>
          
          {/* SEO Rich Content - Hidden by default, reveals on hover */}
          <div className="group">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 mb-8">
              <p className="luxury-body-md text-white/80 mb-4 leading-relaxed">
                Elite companions for discerning gentlemen in London's most prestigious areas. Available 24/7 for dinner dates, business events, and sophisticated social occasions with complete discretion and professionalism.
              </p>
              <p className="luxury-body-sm text-white/70 mb-6">
                Our carefully selected international models offer exclusive companion services throughout Central London, specializing in high-class entertainment, cultural experiences, and business accompaniment for distinguished clients seeking uncompromising quality and elegance.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <SafeLink to="/models" className="inline-block">
              <button className="bg-white text-black hover:bg-gray-100 px-6 py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
                View Models
              </button>
            </SafeLink>
            
            <a href="https://wa.me/447436190679" target="_blank" rel="noopener noreferrer" className="inline-block border border-white text-white hover:bg-white hover:text-black px-6 py-2 transition-all duration-300 luxury-body font-medium tracking-wider uppercase text-xs">
              Book Now
            </a>
          </div>
        </div>
      </div>

      {/* Hidden SEO Content - Invisible but indexable */}
      <div className="sr-only">
        <p>Five London offers exclusive escort services with sophisticated companions available throughout London's most prestigious districts including Mayfair W1, Knightsbridge SW1, Chelsea SW3, and Belgravia. Our elite escort agency provides discreet, professional companion services for business events, social occasions, dinner dates, and cultural experiences.</p>
        <p>Available 24/7 for outcall services to luxury hotels including The Ritz London, Claridge's, The Savoy, and Shangri-La at The Shard. Our carefully vetted international models offer uncompromising quality, intelligence, and elegance for discerning clients seeking premium escort services in Central London.</p>
        <p>Specializing in high-class entertainment, business accompaniment, social events, and cultural experiences throughout London's exclusive areas. Complete discretion guaranteed with professional, sophisticated companions fluent in multiple languages and experienced in international business and social etiquette.</p>
      </div>
    </section>;
};