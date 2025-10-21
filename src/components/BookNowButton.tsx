import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const BookNowButton = () => {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[55]">
      <a 
        href="https://wa.me/447436190679"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          size="sm"
          className="shadow-elegant hover:shadow-luxury transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 caption px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
          Book Now
        </Button>
      </a>
    </div>
  );
};