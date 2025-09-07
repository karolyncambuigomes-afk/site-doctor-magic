import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import heroElegantWoman from '@/assets/hero-elegant-woman.jpg';

export const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroElegantWoman})`
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              Elite London Escorts
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Exquisite. Exclusive. Unforgettable.
            </p>
            
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              London's premier luxury escort agency offering sophisticated high-class companions for discerning gentlemen. Experience exceptional beauty, intelligence, and genuine connection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/models">
                <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Browse Elite Companions
                </button>
              </Link>
              
              <a 
                href="https://wa.me/447436190679"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Book Now - Available 24/7
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};