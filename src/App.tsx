
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import MainNavbar from './components/navigation/MainNavbar';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for code splitting
const Index = lazy(() => import('./pages/Index'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const MyPassport = lazy(() => import('./pages/MyPassport'));
const Events = lazy(() => import('./pages/Events'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Itineraries = lazy(() => import('./pages/Itineraries'));
const Webcams = lazy(() => import('./pages/Webcams'));
const Partner = lazy(() => import('./pages/Partner'));
const ChiSiamo = lazy(() => import('./pages/ChiSiamo'));
const Auth = lazy(() => import('./pages/Auth'));
const AdminModerationPage = lazy(() => import('./pages/AdminModerationPage'));
const AdminRoles = lazy(() => import('./pages/AdminRoles'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TerritoryPromoter = lazy(() => import('@/pages/TerritoryPromoter'));
const RespiroDelMare = lazy(() => import('@/pages/RespiroDelMare'));
const OggiInRomagna = lazy(() => import('@/pages/OggiInRomagna'));
const POIDetail = lazy(() => import("@/pages/POIDetail"));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Restaurants = lazy(() => import('@/pages/Restaurants'));
const Experiences = lazy(() => import('@/pages/Experiences'));
const Family = lazy(() => import('@/pages/Family'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">Caricamento...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isHomepage = location.pathname === '/';
  const isCinematic = isHomepage || location.pathname === '/respiro-del-mare';

  return (
    <>
      <ScrollToTop />
      {/* Fixed Global Navbar - hidden only on auth page */}
      {!isAuthPage && <MainNavbar />}
      {/* Main Content with conditional top padding for fixed navbar */}
      <div className={isAuthPage ? '' : (isCinematic ? '' : 'pt-16 md:pt-20 lg:pt-24')}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-passport" element={<MyPassport />} />
            <Route path="/events" element={<Events />} />
            <Route path="/oggi" element={<OggiInRomagna />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/webcams" element={<Webcams />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-moderation" element={<AdminModerationPage />} />
            <Route path="/admin-roles" element={<AdminRoles />} />
            <Route path="/promotore-territorio" element={<TerritoryPromoter />} />
            <Route path="/respiro-del-mare" element={<RespiroDelMare />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/family" element={<Family />} />
            <Route path="/poi/:id" element={<POIDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
