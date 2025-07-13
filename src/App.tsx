
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MyPassport from './pages/MyPassport';
import Events from './pages/Events';
import Favorites from './pages/Favorites';
import Itineraries from './pages/Itineraries';
import Webcams from './pages/Webcams';
import Partner from './pages/Partner';
import ChiSiamo from './pages/ChiSiamo';
import Auth from './pages/Auth';
import AdminModerationPage from './pages/AdminModerationPage';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';
import TerritoryPromoter from '@/pages/TerritoryPromoter';
import RespiroDelMare from '@/pages/RespiroDelMare';
import OggiInRomagna from '@/pages/OggiInRomagna';
import POIDetail from "@/pages/POIDetail";
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Restaurants from '@/pages/Restaurants';
import Experiences from '@/pages/Experiences';
import Family from '@/pages/Family';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <Router>
          <ScrollToTop />
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
            <Route path="/admin" element={<AdminModerationPage />} />
            <Route path="/promotore-territorio" element={<TerritoryPromoter />} />
            <Route path="/respiro-del-mare" element={<RespiroDelMare />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/family" element={<Family />} />
            <Route path="/poi/:id" element={<POIDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
