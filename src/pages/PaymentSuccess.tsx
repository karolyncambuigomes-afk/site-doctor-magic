import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const PaymentSuccess: React.FC = () => {
  const auth = useAuth();
  const { refreshAccess, hasAccess } = auth || {};
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    // Check subscription status after successful payment
    const checkSubscription = async () => {
      try {
        setIsProcessing(true);
        console.log('PaymentSuccess - Checking subscription and auto-approving user...');
        
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          toast({
            title: "Error",
            description: "Error verifying payment. Please contact support.",
            variant: "destructive"
          });
        } else {
          console.log('PaymentSuccess - Subscription check result:', data);
          
          // Refresh auth context to update access
          if (refreshAccess) {
            await refreshAccess();
          }
          
          setAccessGranted(true);
          toast({
            title: "Success!",
            description: "Payment confirmed! Welcome to the premium area!",
            variant: "default"
          });
          
          // Auto-redirect to models page after 3 seconds
          setTimeout(() => {
            navigate('/models');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Error verifying payment. Please contact support.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    checkSubscription();
  }, [refreshAccess, navigate]);

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border border-green-500 shadow-luxury">
              <CardHeader className="pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-light tracking-wide">
                  Welcome to Premium!
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isProcessing ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Processing your payment and setting up your access...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This may take a few moments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-lg text-muted-foreground">
                      Your payment has been processed successfully. You now have full access to our premium features.
                    </p>
                    
                    {accessGranted && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center mb-3">
                          <Crown className="w-6 h-6 text-amber-500 mr-2" />
                          <span className="font-medium text-green-800">Premium Access Activated</span>
                        </div>
                        <ul className="text-sm text-green-700 space-y-1 mb-3">
                          <li>✓ Full access to exclusive models</li>
                          <li>✓ High-resolution photo galleries</li>
                          <li>✓ Detailed pricing and availability</li>
                          <li>✓ Priority customer support</li>
                        </ul>
                        <p className="text-sm text-green-600 text-center font-medium">
                          Redirecting to Models Gallery in 3 seconds...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    className="five-london-button"
                    disabled={isProcessing}
                  >
                    <Link to="/models">
                      <Crown className="w-4 h-4 mr-2" />
                      View Exclusive Models
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline">
                    <Link to="/">
                      Return Home
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    You will receive a confirmation email shortly. Your subscription will renew automatically each month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};