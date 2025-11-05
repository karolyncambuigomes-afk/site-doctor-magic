import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { CookieConsent } from "@/components/CookieConsent";
import { ContactBar } from "@/components/ContactBar";

import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DegradedModeProvider, useDegradedMode } from "@/components/DegradedModeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";

// SEO-Critical Pages: Import directly (no lazy loading) for immediate rendering
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import { Models } from "./pages/Models";
import { ModelProfile } from "./pages/ModelProfile";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import Characteristics from "./pages/Characteristics";
import CharacteristicDetail from "./pages/CharacteristicDetail";
import LondonEscortGuide from "./pages/LondonEscortGuide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Reviews from "./pages/Reviews";
import NotFound from "./pages/NotFound";

// Non-SEO Pages: Keep lazy loading for bundle optimization
const Auth = lazy(() => import("./pages/Auth").then(m => ({ default: m.Auth })));
const Membership = lazy(() => import("./pages/Membership").then(m => ({ default: m.Membership })));
const Members = lazy(() => import("./pages/Members").then(m => ({ default: m.Members })));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess").then(m => ({ default: m.PaymentSuccess })));
const JoinUs = lazy(() => import("./pages/JoinUs"));

// Optimized QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes
    },
  },
});

// Optimized conditional features
const ConditionalFeatures = () => {
  const { isDegradedMode } = useDegradedMode();
  
  // Initialize auto-refresh functionality
  useAutoRefresh();
  
  return (
    <>
      {!isDegradedMode && <CookieConsent />}
    </>
  );
};





const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <DegradedModeProvider>
            <BrowserRouter>
              <AuthProvider>
                <ScrollToTop />
                <ConditionalFeatures />
                <Toaster />
                <Sonner />
                <ContactBar />
                <SkipToContent />
                
                <Routes>
                  {/* SEO-Critical Routes: No Suspense for immediate SSR */}
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/models/:id" element={<ModelProfile />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/locations/:locationSlug" element={<LocationDetail />} />
                  
                  {/* SEO Location routes */}
                  <Route path="/escorts-in-mayfair" element={<LocationDetail />} />
                  <Route path="/escorts-in-knightsbridge" element={<LocationDetail />} />
                  <Route path="/escorts-in-chelsea" element={<LocationDetail />} />
                  <Route path="/escorts-in-belgravia" element={<LocationDetail />} />
                  <Route path="/escorts-in-kensington" element={<LocationDetail />} />
                  <Route path="/escorts-in-canary-wharf" element={<LocationDetail />} />
                  <Route path="/escorts-in-notting-hill" element={<LocationDetail />} />
                  <Route path="/escorts-in-paddington" element={<LocationDetail />} />
                  <Route path="/escorts-in-st-johns-wood" element={<LocationDetail />} />
                  <Route path="/escorts-in-westminster" element={<LocationDetail />} />
                  <Route path="/escorts-in-city-of-london" element={<LocationDetail />} />
                  <Route path="/escorts-in-kings-cross" element={<LocationDetail />} />
                  <Route path="/escorts-in-islington" element={<LocationDetail />} />
                  <Route path="/escorts-in-hammersmith" element={<LocationDetail />} />
                  <Route path="/escorts-in-fulham" element={<LocationDetail />} />
                  <Route path="/escorts-in-clapham" element={<LocationDetail />} />
                  <Route path="/escorts-in-greenwich" element={<LocationDetail />} />
                  <Route path="/escorts-in-richmond" element={<LocationDetail />} />
                  <Route path="/escorts-in-wimbledon" element={<LocationDetail />} />
                  <Route path="/escorts-in-battersea" element={<LocationDetail />} />
                  <Route path="/escorts-in-bermondsey" element={<LocationDetail />} />
                  <Route path="/escorts-in-blackfriars" element={<LocationDetail />} />
                  
                  <Route path="/characteristics" element={<Characteristics />} />
                  <Route path="/characteristics/:characteristicSlug" element={<CharacteristicDetail />} />
                  
                  {/* SEO Characteristic routes */}
                  <Route path="/blonde-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/brunette-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/busty-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/petite-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/curvy-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/slim-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/english-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/international-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/young-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/mature-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/vip-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/gfe-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/redhead-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/asian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/european-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/ebony-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/tall-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/natural-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/brazilian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/russian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/middle-eastern-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/latina-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/iranian-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/vip-elite-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/party-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/adventurous-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/open-minded-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/exclusive-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/high-class-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/dinner-date-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/domination-fetish-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/bisexual-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/couples-escorts-london" element={<CharacteristicDetail />} />
                  <Route path="/outcalls-escorts-london" element={<CharacteristicDetail />} />
                  
                  <Route path="/london-escort-guide" element={<LondonEscortGuide />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/reviews" element={<Reviews />} />
                  
                  {/* Non-SEO Routes: Keep Suspense for lazy loading */}
                  <Route path="/auth" element={<Suspense fallback={<LoadingSpinner />}><Auth /></Suspense>} />
                  <Route path="/membership" element={<Suspense fallback={<LoadingSpinner />}><Membership /></Suspense>} />
                  <Route path="/members" element={<Suspense fallback={<LoadingSpinner />}><Members /></Suspense>} />
                  <Route path="/payment-success" element={<Suspense fallback={<LoadingSpinner />}><PaymentSuccess /></Suspense>} />
                  <Route path="/join-us" element={<Suspense fallback={<LoadingSpinner />}><JoinUs /></Suspense>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </DegradedModeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
