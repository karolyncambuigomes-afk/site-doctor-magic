import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, Star, Lock, Users, Image } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';

export const Membership: React.FC = () => {
  const { user, hasAccess } = useAuth();
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
        description="Join our exclusive premium membership for £149/month. Access full photo galleries, exclusive models, and premium companion services in London."
        keywords="premium membership, exclusive escorts London, VIP access, luxury companions, elite escort membership, Five London premium"
        canonicalUrl="/membership"
      />
      
      <Navigation />
      
      <div className="min-h-screen bg-background pt-20 pb-16">
        <div className="container-width">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-light tracking-wide mb-6">
              Premium Membership
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock exclusive access to our most sophisticated companions and premium features
            </p>
          </div>

          {/* Current Status */}
          {user && (
            <div className="max-w-md mx-auto mb-12">
              <Card className={`border ${hasAccess ? 'border-green-500 bg-green-50/50' : 'border-amber-500 bg-amber-50/50'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {hasAccess ? (
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-600 mr-2" />
                    )}
                    <span className="font-medium">
                      {hasAccess ? 'Premium Member' : 'Free Account'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {hasAccess 
                      ? 'You have full access to all premium features'
                      : 'Upgrade to access exclusive content'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-16">
            <Card className="border-2 border-primary shadow-luxury relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-amber-500 mr-1" />
                  <span className="text-sm font-medium text-amber-500">PREMIUM</span>
                  <Star className="w-5 h-5 text-amber-500 ml-1" />
                </div>
                <CardTitle className="text-3xl font-light">£149</CardTitle>
                <CardDescription className="text-lg">per month</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Image className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Full photo galleries with faces visible</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Access to exclusive models</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Premium companion services</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Detailed profiles and pricing</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>Priority booking support</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubscribe}
                  disabled={loading || hasAccess}
                  className="five-london-button w-full py-6 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : hasAccess ? (
                    'Already Subscribed'
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment via Stripe. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Comparison */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Access */}
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-light flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                    Free Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Check className="w-4 h-4 mr-2" />
                    <span>Browse companion gallery</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Check className="w-4 h-4 mr-2" />
                    <span>Basic profile information</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Check className="w-4 h-4 mr-2" />
                    <span>Contact information</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Limited photo access</span>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Access */}
              <Card className="border-2 border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-xl font-light flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-amber-500" />
                    Premium Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span>Everything in Free Access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span>Full high-resolution galleries</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span>Exclusive models access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span>Detailed pricing information</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    <span>Priority customer support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};