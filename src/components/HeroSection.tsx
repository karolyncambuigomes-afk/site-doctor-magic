import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import heroElegantWoman from '@/assets/hero-elegant-woman.jpg';

export const HeroSection = () => {
  return (
    <>
      {/* Ultra Luxurious Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[20s] ease-out"
            style={{
              backgroundImage: `url(${heroElegantWoman})`
            }}
          ></div>
          {/* Sophisticated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        
        {/* Premium Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top Content - Elegant Introduction */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-8 animate-fade-in-up">
                {/* Luxury Badge */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-body text-sm tracking-wider uppercase">
                    Premier Luxury Services
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="font-display text-white">
                  <span className="block">Five London</span>
                  <span className="block text-white/80 text-2xl md:text-4xl lg:text-5xl font-light italic mt-2">
                    Sophisticated Companions
                  </span>
                </h1>

                {/* Elegant Description */}
                <p className="text-white/90 font-body text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto">
                  Experience the pinnacle of elegance with our exclusive collection of sophisticated companions in London
                </p>

                {/* Refined CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
                  <Link to="/models" className="group">
                    <button className="btn-luxury text-white bg-white/15 border border-white/30 backdrop-blur-md hover:bg-white/25 hover:border-white/50 transition-all duration-500">
                      <span className="flex items-center space-x-2">
                        <span>Discover Our Models</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                  </Link>
                  
                  <a href="tel:+442045678901" className="group">
                    <button className="btn-outline-luxury border-white/40 text-white hover:bg-white hover:text-black">
                      <span className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Contact Us</span>
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-black/30 backdrop-blur-md border-t border-white/10">
            <div className="container-width py-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Contact Info */}
                <div className="flex items-center space-x-8">
                  <a 
                    href="tel:+442045678901" 
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-body text-sm">+44 20 4567 8901</span>
                  </a>
                  <a 
                    href="mailto:hello@fivelondon.com" 
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-body text-sm">hello@fivelondon.com</span>
                  </a>
                </div>

                {/* Discrete Info */}
                <div className="text-white/60 font-body text-xs tracking-wider uppercase">
                  Available 24/7 • Discretion Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};