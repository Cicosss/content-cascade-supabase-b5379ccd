
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
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
import GustoSapori from '@/pages/GustvSapori';
import CulturaTerritorio from '@/pages/CulturaTerritorio';
import EventiSpettacoli from '@/pages/EventiSpettacoli';
import DivertimentoFamiglia from '@/pages/DivertimentoFamiglia';
import TerritoryPromoter from '@/pages/TerritoryPromoter';
import RespiroDelMare from '@/pages/RespiroDelMare';
import OggiInRomagna from '@/pages/OggiInRomagna';

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
            <Route path="/events" element={<Events />} />
            <Route path="/oggi" element={<OggiInRomagna />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/webcams" element={<Webcams />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminModerationPage />} />
            <Route path="/gusto-sapori" element={<GustoSapori />} />
            <Route path="/cultura-territorio" element={<CulturaTerritorio />} />
            <Route path="/eventi-spettacoli" element={<EventiSpettacoli />} />
            <Route path="/divertimento-famiglia" element={<DivertimentoFamiglia />} />
            <Route path="/promotore-territorio" element={<TerritoryPromoter />} />
            <Route path="/respiro-del-mare" element={<RespiroDelMare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
