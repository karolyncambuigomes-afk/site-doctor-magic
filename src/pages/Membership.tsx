import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Lock } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';

export const Membership: React.FC = () => {
  const auth = useAuth();
  const { user, hasAccess } = auth || {};
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (hasAccess) {
      toast.info('You already have an active membership');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Premium Membership - Exclusive Access | Five London"
        description="Join our exclusive premium membership for £149/month. Complete access to our sophisticated companion collection."
        keywords="premium membership, exclusive escorts London, VIP access, luxury companions, elite escort membership, Five London premium"
        canonicalUrl="/membership"
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 py-20 md:py-32">
        <div className="container-width mx-auto px-6">
          <div className="text-center">
            <h1 className="heading-display text-primary mb-6">
              Five London
            </h1>
            <div className="w-16 h-0.5 bg-foreground mx-auto mb-8"></div>
            <p className="body-lg text-muted-foreground tracking-widest">
              Exclusive Membership
            </p>
            <div className="max-w-2xl mx-auto mt-8">
              <p className="body-lg text-muted-foreground leading-relaxed">
                Access our exclusive collection of sophisticated companions in London. 
                Complete privacy and discretion guaranteed with premium features and priority support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="py-3">
        <div className="container-width">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
        </div>
      </div>

      <div className="container-width px-6">

        {/* Current Status */}
        {user && (
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-md mx-auto">
              <Card className={`border shadow-elegant ${hasAccess ? 'border-green-500/30 bg-green-50/5 dark:bg-green-950/5' : 'border-border'}`}>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${hasAccess ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                      {hasAccess ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-light text-lg">
                      {hasAccess ? 'Active Access' : 'Guest Access'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Premium Pricing Section */}
        <section className="py-20 md:py-32 bg-gray-50">
          <div className="max-w-md mx-auto">
            <Card className="border border-border shadow-elegant relative overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="heading-xl text-primary mb-2">£149</CardTitle>
                <CardDescription className="body-lg text-muted-foreground">per month</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8">
                <div className="space-y-4 text-center">
                  <div className="body-base font-light text-muted-foreground">
                    Complete Access
                  </div>
                  <div className="body-base font-light text-muted-foreground">
                    Premium Collection
                  </div>
                  <div className="body-base font-light text-muted-foreground">
                    Priority Support
                  </div>
                </div>

                <Button 
                  onClick={handleSubscribe}
                  disabled={loading || hasAccess}
                  className="w-full py-4 text-base font-light tracking-widest"
                  variant="default"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : hasAccess ? (
                    "Active"
                  ) : (
                    "Join"
                  )}
                </Button>

                <div className="text-center">
                  <p className="body-xs text-muted-foreground font-light">
                    Secure & Confidential
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Questions Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="text-center">
            <p className="body-lg text-muted-foreground mb-8 tracking-widest">
              Questions about membership?
            </p>
            <Button 
              onClick={() => window.open('https://wa.me/447563407874?text=Hello, I have questions about the premium membership', '_blank')}
              variant="outline"
              className="font-light tracking-widest px-8 py-4"
            >
              Contact us discreetly
            </Button>
          </div>
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Billing Discretion Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="text-center max-w-md mx-auto">
            <p className="body-base text-muted-foreground font-light mb-2">
              Complete Discretion
            </p>
            <p className="body-xs text-muted-foreground font-light leading-relaxed">
              Your credit card statement will show "London Department Store" for complete privacy and discretion.
            </p>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};