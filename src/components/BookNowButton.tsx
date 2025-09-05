import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Phone, Mail } from 'lucide-react';

export const BookNowButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px from the top
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Booking inquiry:', formData);
    
    toast({
      title: "Inquiry sent successfully",
      description: "We'll get back to you within 24 hours."
    });

    setIsOpen(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="shadow-elegant hover:shadow-luxury transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 caption px-6 py-3"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="heading-md text-center">
              Make an Inquiry
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Quick Contact Options */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+442045678901"
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-border hover:bg-muted transition-luxury body-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <a
                href="mailto:info@fivelondon.com"
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-border hover:bg-muted transition-luxury body-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center caption">
                <span className="bg-background px-2 text-muted-foreground">Or fill the form</span>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="body-sm">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                  className="border-border focus:border-primary transition-luxury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="body-sm">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="border-border focus:border-primary transition-luxury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="body-sm">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+44 20 xxxx xxxx"
                  className="border-border focus:border-primary transition-luxury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="body-sm">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your requirements..."
                  className="border-border focus:border-primary transition-luxury min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full five-london-button"
              >
                Send Inquiry
              </Button>
            </form>

            <p className="caption text-center leading-relaxed">
              All inquiries are handled with complete discretion and confidentiality.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};