import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const BookNowButton = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Hide button on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px from the top
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <a 
        href="https://wa.me/447436190679"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          size="sm"
          className="shadow-elegant hover:shadow-luxury transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 caption px-6 py-3"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Book Now - 24/7
        </Button>
      </a>
    </div>
  );
};