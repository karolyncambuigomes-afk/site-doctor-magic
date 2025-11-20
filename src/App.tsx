import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { CookieConsent } from "@/components/CookieConsent";
import { ContactBar } from "@/components/ContactBar";
import { ScriptInjector } from "@/components/ScriptInjector";
import { HeadScriptInjector } from "@/components/HeadScriptInjector";

import { SkipToContent } from "@/components/SkipToContent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DegradedModeProvider, useDegradedMode } from "@/components/DegradedModeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
// Lazy load pages for better performance
const Auth = lazy(() => import("./pages/Auth").then(m => ({ default: m.Auth })));
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Models = lazy(() => import("./pages/Models").then(m => ({ default: m.Models })));
const ModelProfile = lazy(() => import("./pages/ModelProfile").then(m => ({ default: m.ModelProfile })));
const Membership = lazy(() => import("./pages/Membership").then(m => ({ default: m.Membership })));
const Members = lazy(() => import("./pages/Members").then(m => ({ default: m.Members })));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess").then(m => ({ default: m.PaymentSuccess })));
const Locations = lazy(() => import("./pages/Locations"));
const LocationDetail = lazy(() => import("./pages/LocationDetail"));
const Characteristics = lazy(() => import("./pages/Characteristics"));
const CharacteristicDetail = lazy(() => import("./pages/CharacteristicDetail"));
const LondonEscortGuide = lazy(() => import("./pages/LondonEscortGuide"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Reviews = lazy(() => import("./pages/Reviews"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient with minimal cache for fresh data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch fresh data
      gcTime: 5 * 60 * 1000, // Keep in memory for 5 min for background refetch
      retry: 1,
      refetchOnWindowFocus: false,
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
                <HeadScriptInjector />
                <ScriptInjector position="body_start" />
                <ScrollToTop />
                <ConditionalFeatures />
                <Toaster />
                <Sonner />
                <ContactBar />
                <SkipToContent />
                
                
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/models/:id" element={<ModelProfile />} />
                    <Route path="/membership" element={<Membership />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
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
                  <Route path="/escorts-in-covent-garden" element={<LocationDetail />} />
                  <Route path="/escorts-in-shoreditch" element={<LocationDetail />} />
                  <Route path="/escorts-in-marylebone" element={<LocationDetail />} />
                  <Route path="/escorts-in-fitzrovia" element={<LocationDetail />} />
                  <Route path="/escorts-in-south-kensington" element={<LocationDetail />} />
                  
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
                    <Route path="/join-us" element={<JoinUs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <ScriptInjector position="body_end" />
              </AuthProvider>
            </BrowserRouter>
          </DegradedModeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
