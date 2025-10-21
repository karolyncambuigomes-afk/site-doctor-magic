import { MessageCircle, Phone } from 'lucide-react';
import { CTAButton } from '@/components/ui/cta-button';

export const QuickContactCTA = () => {
  return (
    <div className="md:hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-y border-primary/10">
      <div className="container-width py-6">
        <h2 className="luxury-heading-sm text-center mb-4">
          Available 24/7 - Discreet Service
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="https://wa.me/447436190679"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial"
          >
            <CTAButton 
              variant="whatsapp" 
              size="lg"
              className="w-full sm:w-auto min-h-[52px]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Now
            </CTAButton>
          </a>
          <a 
            href="tel:+447436190679"
            className="flex-1 sm:flex-initial"
          >
            <CTAButton 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto min-h-[52px]"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </CTAButton>
          </a>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          Discreet and professional concierge service
        </p>
      </div>
    </div>
  );
};
