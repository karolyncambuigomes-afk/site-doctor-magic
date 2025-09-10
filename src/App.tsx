import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { BookNowButton } from "@/components/BookNowButton";
import { SkipToContent } from "@/components/SkipToContent";
import { DegradedModeProvider, useDegradedMode } from "@/components/DegradedModeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { UserApprovalStatus } from "@/components/UserApprovalStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VersionManager } from "@/components/VersionManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResourcePreloader, IdlePrefetcher, DNSPrefetcher } from "@/components/ResourceOptimizer";
// Temporarily disabled CSS optimizer due to blue screen issue
// import { CSSOptimizer, ResponsiveCSS } from "@/components/CSSOptimizer";

// Critical pages that should load immediately
import { Auth } from "./pages/Auth";
import { AdminLogin } from "./pages/AdminLogin";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Lazy components
import {
  Analytics,
  CookieConsent,
  ServiceWorkerManager,
  MobileOptimizer,
  MobileForceRefresh,
  MobileDebugPanel,
  MobileRefreshButton,
  Blog,
  BlogPost,
  Models,
  ModelProfile,
  Membership,
  Members,
  PaymentSuccess,
  Locations,
  LocationDetail,
  Characteristics,
  CharacteristicDetail,
  LondonEscortGuide,
  Reviews,
  JoinUs,
  AdminDashboard,
  GlobalSEO,
  MetaTagsManager,
  StructuredDataManager,
  TechnicalSEO,
  PerformanceAnalytics,
  ContentManager,
  ModelsListManager,
  ModelFormPage,
  ApplicationsManager,
  CharacteristicsManagerPage,
  ServicesManagerPage,
  ReviewsManagerPage,
  LocationsManagerPage,
  LocalSEOManagerPage,
  UsersManager,
  PermissionsManagerPage,
  SystemSettings,
  ThemeManagerPage,
  CategoriesManagerPage,
  LegalPagesManagerPage,
  LazyPageWrapper,
  LazyAdminWrapper
} from './components/LazyComponents';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Component to conditionally render features based on degraded mode
const ConditionalFeatures = () => {
  const { isDegradedMode, isPrivateMode } = useDegradedMode();
  const isMobile = useIsMobile();
  
  return (
    <>
      {!isPrivateMode && (
        <LazyPageWrapper>
          <Analytics />
        </LazyPageWrapper>
      )}
      <LazyPageWrapper>
        <ServiceWorkerManager />
      </LazyPageWrapper>
      <VersionManager />
      {!isDegradedMode && (
        <LazyPageWrapper>
          <CookieConsent />
        </LazyPageWrapper>
      )}
      {isMobile && (
        <LazyPageWrapper>
          <MobileOptimizer />
          <MobileForceRefresh />
          <MobileDebugPanel />
          <MobileRefreshButton />
        </LazyPageWrapper>
      )}
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DegradedModeProvider>
            <AuthProvider>
        {/* Temporarily disabled CSS optimizer */}
        <div>
                <BrowserRouter>
                  <ResourcePreloader />
                  <DNSPrefetcher />
                  <IdlePrefetcher />
                  {/* Temporarily disabled ResponsiveCSS */}
                  <ConditionalFeatures />
                  <Toaster />
                  <Sonner />
                  <BookNowButton />
                  <SkipToContent />
                  <Routes>
                  {/* Critical pages - no lazy loading */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/approval-status" element={<UserApprovalStatus />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  
                  {/* Lazy loaded pages */}
                  <Route path="/blog" element={
                    <LazyPageWrapper>
                      <Blog />
                    </LazyPageWrapper>
                  } />
                  <Route path="/blog/:slug" element={
                    <LazyPageWrapper>
                      <BlogPost />
                    </LazyPageWrapper>
                  } />
                  <Route path="/models" element={
                    <LazyPageWrapper>
                      <Models />
                    </LazyPageWrapper>
                  } />
                  <Route path="/models/:id" element={
                    <LazyPageWrapper>
                      <ModelProfile />
                    </LazyPageWrapper>
                  } />
                  <Route path="/membership" element={
                    <LazyPageWrapper>
                      <Membership />
                    </LazyPageWrapper>
                  } />
                  <Route path="/members" element={
                    <LazyPageWrapper>
                      <Members />
                    </LazyPageWrapper>
                  } />
                  <Route path="/payment-success" element={
                    <LazyPageWrapper>
                      <PaymentSuccess />
                    </LazyPageWrapper>
                  } />
                  <Route path="/locations" element={
                    <LazyPageWrapper>
                      <Locations />
                    </LazyPageWrapper>
                  } />
                  <Route path="/locations/:locationSlug" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  
                  {/* SEO location routes - lazy loaded */}
                  <Route path="/escorts-in-mayfair" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-knightsbridge" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-chelsea" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-belgravia" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-kensington" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-canary-wharf" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-notting-hill" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-paddington" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-st-johns-wood" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-westminster" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-city-of-london" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-kings-cross" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-islington" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-hammersmith" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-fulham" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-clapham" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-greenwich" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-richmond" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-wimbledon" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-battersea" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-bermondsey" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/escorts-in-blackfriars" element={
                    <LazyPageWrapper>
                      <LocationDetail />
                    </LazyPageWrapper>
                  } />
                  
                  <Route path="/characteristics" element={
                    <LazyPageWrapper>
                      <Characteristics />
                    </LazyPageWrapper>
                  } />
                  <Route path="/characteristics/:characteristicSlug" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  
                  {/* SEO characteristic routes - lazy loaded */}
                  <Route path="/blonde-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/brunette-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/busty-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/petite-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/curvy-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/slim-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/english-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/international-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/young-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/mature-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/vip-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/gfe-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/redhead-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/asian-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/european-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/ebony-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/tall-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/natural-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/brazilian-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/russian-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/middle-eastern-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/latina-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/iranian-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/vip-elite-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/party-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/adventurous-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/open-minded-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/exclusive-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/high-class-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/dinner-date-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/domination-fetish-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/bisexual-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/couples-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  <Route path="/outcalls-escorts-london" element={
                    <LazyPageWrapper>
                      <CharacteristicDetail />
                    </LazyPageWrapper>
                  } />
                  
                  <Route path="/london-escort-guide" element={
                    <LazyPageWrapper>
                      <LondonEscortGuide />
                    </LazyPageWrapper>
                  } />
                  <Route path="/reviews" element={
                    <LazyPageWrapper>
                      <Reviews />
                    </LazyPageWrapper>
                  } />
                  <Route path="/join-us" element={
                    <LazyPageWrapper>
                      <JoinUs />
                    </LazyPageWrapper>
                  } />
                  
                  {/* Admin Panel Routes - All lazy loaded */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <AdminDashboard />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/dashboard" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <AdminDashboard />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* SEO Management */}
                  <Route path="/admin/seo/global" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <GlobalSEO />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/seo/meta-tags" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <MetaTagsManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/seo/structured-data" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <StructuredDataManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/seo/technical" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <TechnicalSEO />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/seo/performance" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <PerformanceAnalytics />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* Content Management */}
                  <Route path="/admin/content" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content/homepage" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content/blog" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content/site" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content/faq" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/content/gallery" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ContentManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* Models & Services */}
                  <Route path="/admin/models" element={<Navigate to="/admin/models/list" replace />} />
                  <Route path="/admin/models/list" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ModelsListManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/new" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ModelFormPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/edit/:id" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ModelFormPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/applications" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ApplicationsManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/characteristics" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <CharacteristicsManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/services" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ServicesManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/models/reviews" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ReviewsManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* Locations & Geo */}
                  <Route path="/admin/locations/list" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <LocationsManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/locations/seo" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <LocalSEOManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* System Settings */}
                  <Route path="/admin/settings/theme" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <ThemeManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/settings/categories" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <CategoriesManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/settings/legal" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <LegalPagesManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* User Management */}
                  <Route path="/admin/users/list" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <UsersManager />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/users/permissions" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <PermissionsManagerPage />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  {/* System Settings */}
                  <Route path="/admin/system" element={
                    <AdminProtectedRoute>
                      <LazyAdminWrapper>
                        <SystemSettings />
                      </LazyAdminWrapper>
                    </AdminProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </AuthProvider>
        </DegradedModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
</ErrorBoundary>
);

export default App;