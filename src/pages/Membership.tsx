import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, Star, Lock, Users, Image, Shield } from 'lucide-react';
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
      
      {/* Hero Section */}
      <section className="relative pt-20 py-20 md:py-32 bg-gradient-to-br from-background via-background/95 to-muted">
        <div className="container-width mx-auto px-6">
          <div className="text-center mb-20">
            {/* Crown Icon */}
            <div className="mx-auto w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary via-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-8 shadow-luxury">
              <Crown className="w-12 h-12 md:w-14 md:h-14 text-white" />
            </div>
            
            {/* Main heading */}
            <h1 className="heading-display text-4xl md:text-6xl text-primary mb-8">
              Premium Membership
            </h1>
            <div className="w-16 h-0.5 bg-foreground mx-auto mb-8 md:mb-12"></div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                Unlock exclusive access to our most sophisticated companions and premium features. 
                Experience luxury companionship with complete discretion and unparalleled service.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Join London's most exclusive escort membership and discover a world of elite companions, 
                full photo galleries, and priority access to our premium services.
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
        <section className="py-16 md:py-20 bg-background">
          {user && (
            <div className="max-w-md mx-auto">
              <Card className={`border-2 shadow-elegant ${hasAccess ? 'border-green-500 bg-green-50/10 dark:bg-green-950/10' : 'border-amber-500 bg-amber-50/10 dark:bg-amber-950/10'}`}>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${hasAccess ? 'bg-green-100 dark:bg-green-900' : 'bg-amber-100 dark:bg-amber-900'}`}>
                      {hasAccess ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-lg">
                        {hasAccess ? 'Premium Member' : 'Free Account'}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {hasAccess 
                          ? 'Full access to all features'
                          : 'Limited access'
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {hasAccess 
                      ? 'You have complete access to our exclusive gallery and premium companions'
                      : 'Upgrade to unlock our full collection of sophisticated companions'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Premium Pricing Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-muted/20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight mb-4">
              Join the <span className="text-primary">Elite</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience luxury companionship with our exclusive membership program
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary bg-gradient-to-br from-background via-background/90 to-primary/5 shadow-luxury relative overflow-hidden hover:shadow-2xl transition-all duration-500">
              {/* Premium Badge */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                  PREMIUM
                </div>
              </div>
              
              <CardHeader className="text-center pb-6 pt-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-5xl md:text-6xl font-light text-primary">£149</CardTitle>
                <CardDescription className="text-xl text-muted-foreground">per month</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">Cancel anytime • No hidden fees</p>
              </CardHeader>
              
              <CardContent className="space-y-8 px-8 pb-8">
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <Image className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Full Photo Galleries</span>
                      <p className="text-sm text-muted-foreground">High-resolution images with faces visible</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <Users className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Exclusive Models</span>
                      <p className="text-sm text-muted-foreground">Access to premium-only companions</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <Crown className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Priority Support</span>
                      <p className="text-sm text-muted-foreground">24/7 concierge booking service</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium">Detailed Profiles</span>
                      <p className="text-sm text-muted-foreground">Complete information and pricing</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSubscribe}
                  disabled={loading || hasAccess}
                  className="w-full py-6 text-lg font-medium bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-600 shadow-elegant hover:shadow-luxury transition-all duration-300"
                  variant="default"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : hasAccess ? (
                    <div className="flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      Already Subscribed
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Crown className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </div>
                  )}
                </Button>

                <div className="text-center space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Secure payment via Stripe • SSL encrypted
                  </p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <Lock className="w-3 h-3 mr-1" />
                    <span>100% secure and confidential</span>
                  </div>
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

        {/* Features Comparison */}
        <section className="py-16 md:py-20 lg:py-24 bg-background">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight mb-4">
              Access <span className="text-primary">Comparison</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare what's included with each access level
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Free Access */}
              <Card className="border border-border shadow-minimal hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-light flex items-center">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mr-3">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      Free Access
                    </CardTitle>
                    <span className="text-2xl font-bold text-muted-foreground">£0</span>
                  </div>
                  <p className="text-muted-foreground">Basic browsing and contact</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>Browse companion gallery</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>Basic profile information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>Contact information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Lock className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-muted-foreground">Limited photo access (faces blurred)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Lock className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-muted-foreground">No exclusive models</span>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Access */}
              <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 via-background to-amber-500/5 shadow-luxury hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-amber-500"></div>
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl font-light flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center mr-3">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      Premium Access
                    </CardTitle>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">£149</span>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">Complete access to all features</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium">Everything in Free Access</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium">Full high-resolution galleries</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium">Exclusive premium models</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium">Detailed pricing information</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-medium">Priority customer support</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Trust & Security Section */}
        <section className="py-16 md:py-20 lg:py-24 bg-muted/20">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-light tracking-tight mb-4">
              Trust & <span className="text-primary">Security</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy and security are our top priorities
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-minimal">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-3">Complete Discretion</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All transactions and communications are completely confidential and secure
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-minimal">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-3">Secure Payments</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SSL encrypted payments through Stripe with bank-level security
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-background border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-minimal">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-3">Verified Agency</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Established reputation with hundreds of satisfied clients since 2018
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};