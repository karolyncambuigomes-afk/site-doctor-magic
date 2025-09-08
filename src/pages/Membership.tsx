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
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="container-width text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="heading-display mb-4 sm:mb-6 text-black">
              Premium Membership
            </h1>
            <p className="body-lg text-black">
              Access our exclusive collection of sophisticated companions with complete privacy and discretion.
            </p>
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
        <section className="py-20 md:py-32 bg-white">
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

        {/* Contact Section */}
        <section className="py-12 md:py-20 lg:py-24 bg-gray-50">
          <div className="container-width text-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-extralight mb-4">Ready to Join?</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8">
                Complete discretion - your statement shows "London Department Store".
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                onClick={() => window.open('https://wa.me/447563407874?text=Hello, I have questions about the premium membership', '_blank')}
              >
                Contact Us Discreetly
              </Button>
            </div>
          </div>
        </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};