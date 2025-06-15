
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import ScrollToTop from "./components/ScrollToTop";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Restaurants from "./pages/Restaurants";
import Events from "./pages/Events";
import Experiences from "./pages/Experiences";
import Itineraries from "./pages/Itineraries";
import Family from "./pages/Family";
import Partner from "./pages/Partner";
import TerritoryPromoter from "./pages/TerritoryPromoter";
import AdminModerationPage from "./pages/AdminModerationPage";
import Webcams from "./pages/Webcams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <LocationProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/events" element={<Events />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/itineraries" element={<Itineraries />} />
              <Route path="/family" element={<Family />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/promotore-territorio" element={<TerritoryPromoter />} />
              <Route path="/admin/moderazione" element={<AdminModerationPage />} />
              <Route path="/webcams" element={<Webcams />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
