import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';

interface ContactBarProps {
  showOnScroll?: boolean; // true = aparece após scroll (Index), false = sempre visível (outras páginas)
}

export const ContactBar = ({ showOnScroll = true }: ContactBarProps) => {
  const [isVisible, setIsVisible] = useState(!showOnScroll); // Se não precisa scroll, já começa visível

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!showOnScroll) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // Show bar after scrolling past the hero section (approximately 700px)
      setIsVisible(window.scrollY > 700);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll]);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-black/95 backdrop-blur-md
        border-t border-white/10
        transform transition-transform duration-300
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile version */}
        <div className="flex sm:hidden items-center justify-around py-3">
          <a
            href="https://wa.me/447436190679"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-light">WhatsApp</span>
          </a>

          <a
            href="tel:+447436190679"
            className="flex flex-col items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-light">Call 24/7</span>
          </a>

          <a
            href="https://t.me/FiveLondon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-white hover:text-gray-300 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="text-[10px] font-light">Telegram</span>
          </a>
        </div>

        {/* Desktop version */}
        <div className="hidden sm:flex items-center justify-center gap-8 py-3">
          <a
            href="https://wa.me/447436190679"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-light tracking-wide">WhatsApp</span>
          </a>

          <div className="h-4 w-px bg-white/20" />

          <a
            href="tel:+447436190679"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-light tracking-wide">+44 7436 190679</span>
          </a>

          <div className="h-4 w-px bg-white/20" />

          <a
            href="https://t.me/FiveLondon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-light tracking-wide">Telegram</span>
          </a>

          <div className="h-4 w-px bg-white/20" />

          <span className="text-xs text-gray-400 font-light tracking-wider">24/7</span>
        </div>
      </div>
    </div>
  );
};
