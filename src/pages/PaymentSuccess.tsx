import React, { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PaymentSuccess: React.FC = () => {
  const { refreshAccess } = useAuth();

  useEffect(() => {
    // Check subscription status after successful payment
    const checkSubscription = async () => {
      try {
        await supabase.functions.invoke('check-subscription');
        // Refresh auth context
        if (refreshAccess) {
          refreshAccess();
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, [refreshAccess]);

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
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Your payment has been processed successfully. You now have full access to our premium features.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-3">
                      <Crown className="w-6 h-6 text-amber-500 mr-2" />
                      <span className="font-medium text-green-800">Premium Benefits Activated</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Full access to exclusive models</li>
                      <li>✓ High-resolution photo galleries</li>
                      <li>✓ Detailed pricing and availability</li>
                      <li>✓ Priority customer support</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="five-london-button">
                    <Link to="/members">
                      <Crown className="w-4 h-4 mr-2" />
                      Enter Members Area
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