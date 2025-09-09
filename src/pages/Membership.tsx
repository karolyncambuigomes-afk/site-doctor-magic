import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Lock, Mail } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
export const Membership: React.FC = () => {
  const auth = useAuth();
  const {
    user,
    hasAccess
  } = auth || {};
  const [loginLoading, setLoginLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      if (error) throw error;
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoginLoading(false);
    }
  };
  return <>
      <SEO title="Members Area - Exclusive Access | Five London" description="Exclusive membership area for Five London. Access requires approval from our team." keywords="members area, exclusive access, VIP membership, Five London" canonicalUrl="/membership" />
      
      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
        <div className="container-width text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h1 className="luxury-heading-xl mb-4 sm:mb-6 text-black">
              Members Area
            </h1>
            <p className="luxury-body-lg text-black">
              Exclusive access to our sophisticated companion collection. Membership is by invitation or approval only.
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

        {/* Login Section for Non-Logged In Users */}
        {!user && <section className="py-16 md:py-20 bg-white">
            <div className="max-w-md mx-auto">
              <Card className="border border-border shadow-elegant">
                <CardHeader className="text-center pb-6 bg-black">
                  <CardTitle className="luxury-heading-lg text-foreground">Member Login</CardTitle>
                  <CardDescription className="luxury-body-base text-muted-foreground">
                    Access your membership area
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pb-8 bg-black">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="luxury-body-sm text-foreground">Email</Label>
                      <Input id="email" type="email" value={loginForm.email} onChange={e => setLoginForm({
                        ...loginForm,
                        email: e.target.value
                      })} required className="luxury-body-base" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="luxury-body-sm text-foreground">Password</Label>
                      <Input id="password" type="password" value={loginForm.password} onChange={e => setLoginForm({
                        ...loginForm,
                        password: e.target.value
                      })} required className="luxury-body-base" />
                    </div>
                    
                    <Button type="submit" disabled={loginLoading} className="w-full py-3 text-base font-light tracking-widest">
                      {loginLoading ? <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Logging in...
                        </div> : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Access Request Information */}
              <div className="mt-8">
                <Card className="border border-border/50 bg-gray-50/50">
                  <CardContent className="p-6 text-center">
                    <Mail className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium mb-2 text-foreground">Request Membership Access</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Membership is by invitation or approval only. To request access, please contact our team.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/contact" className="inline-flex items-center justify-center text-white">
                        Contact for Access
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>}

        {/* Current Status for Logged In Users */}
        {user && <section className="py-16 md:py-20 bg-white">
            <div className="max-w-md mx-auto">
              <Card className={`border shadow-elegant ${hasAccess ? 'border-green-500/30 bg-green-50/5 dark:bg-green-950/5' : 'border-border'}`}>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${hasAccess ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                      {hasAccess ? <Check className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <span className="font-light text-lg">
                      {hasAccess ? 'Active Access' : 'Guest Access'}
                    </span>
                  </div>
                   {hasAccess && <Button onClick={() => window.location.href = '/members'} className="mt-4 px-6 py-2 font-light tracking-widest">
                      Access Members Area
                    </Button>}
                </CardContent>
              </Card>
            </div>
          </section>}

        {/* Divider */}
        <div className="py-3">
          <div className="container-width">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
          </div>
        </div>

        {/* Access Status for Users Without Access */}
        {user && !hasAccess && <section className="py-16 md:py-20 bg-white">
            <div className="max-w-md mx-auto">
              <Card className="border border-orange-200 bg-orange-50/30">
                <CardContent className="p-6 text-center">
                  <Lock className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-medium mb-2 text-foreground">Access Pending</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your membership request is being reviewed. You will be notified once approved.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact" className="inline-flex items-center justify-center">
                      Contact Support
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>}

        {/* SEO Content - Invisible */}
        <div className="sr-only">
          <h2>Exclusive VIP Membership Benefits - Premium Access to Elite Companions</h2>
          <p>Experience the ultimate in luxury companionship through our exclusive VIP membership program. Members gain privileged access to London's most sophisticated escort models, personalized concierge services, priority booking for special events, and bespoke experiences tailored to the refined tastes of our distinguished clientele. Our membership program represents the pinnacle of discretion, elegance, and personalized service in London's premium escort industry.</p>
          
          <h3>Premium Access to Elite Companions and Exclusive Gallery</h3>
          <p>VIP members enjoy unlimited access to our complete collection of elite companions, including exclusive models available only to premium members. Browse detailed profiles, high-quality photography, and comprehensive background information about each companion. Members receive priority booking privileges, advanced scheduling options, and access to special events featuring our most sought-after models. The exclusive members' gallery showcases the finest selection of sophisticated companions in London, carefully curated for discerning clients who demand nothing but excellence.</p>
          
          <h3>Members-Only Services and Personalized Experiences</h3>
          <p>Our VIP membership extends beyond companion access to include comprehensive lifestyle services. Members benefit from personalized restaurant recommendations and reservations at London's most exclusive venues, priority access to cultural events and private viewings, bespoke travel arrangements with international companions, and 24/7 concierge support for any special requests. Each service is tailored to individual preferences, ensuring every experience exceeds expectations and maintains the highest standards of luxury and discretion.</p>
          
          <h4>Exclusive Events and Private Member Functions</h4>
          <p>VIP members are invited to exclusive events throughout London, including private dinners at prestigious venues, cultural experiences at premier locations, and intimate gatherings with our elite companions. These events take place at carefully selected venues such as private dining rooms in Mayfair, exclusive galleries in Chelsea, luxury yachts on the Thames, and historic venues across London's most sophisticated neighborhoods, providing unparalleled networking opportunities within our distinguished member community.</p>
          
          <h4>Membership Tiers and Luxury Benefits</h4>
          <p>Our tiered membership structure offers increasing levels of luxury and exclusivity. Platinum members receive access to the most exclusive companions, priority booking for all services, complimentary upgrades, and personalized attention from our senior concierge team. Diamond members enjoy all benefits plus access to international travel companions, exclusive event invitations, and bespoke experiences designed specifically for their preferences. Each tier represents a commitment to excellence, ensuring that our most valued members receive the extraordinary service and attention they deserve.</p>
        </div>

        {/* Information Section */}
        
          </div>
        </main>
        
        <Footer />
      </div>
    </>;
};