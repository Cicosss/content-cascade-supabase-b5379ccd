
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomepageLayout from '@/components/HomepageLayout';
import InteractiveHeroSection from '@/components/InteractiveHeroSection';
import ValuePropositionSection from '@/components/ValuePropositionSection';
import AppFeaturesSection from '@/components/AppFeaturesSection';
import ScrollToTop from '@/components/ui/ScrollToTop';
import PullToRefresh from '@/components/ui/PullToRefresh';

// Import the new homepage components
import TopSection from '@/components/homepage/TopSection';
import HomepageCarousels from '@/components/homepage/HomepageCarousels';
import HelpBanner from '@/components/homepage/HelpBanner';
import FamilySection from '@/components/homepage/FamilySection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = async () => {
    // Simula refresh della pagina
    window.location.reload();
  };

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  // Se l'utente è loggato, non mostrare nulla (sta per essere reindirizzato)
  if (user) {
    return null;
  }

  return (
    <HomepageLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <InteractiveHeroSection />
        <ValuePropositionSection />
        <AppFeaturesSection />
        
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-6 md:py-8 lg:py-12">
          {/* Top Section: Weather and Guest Card */}
          <TopSection />

          {/* Main Content Sections */}
          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            {/* Thematic Carousels */}
            <HomepageCarousels />

            {/* Hai bisogno di aiuto? */}
            <HelpBanner />

            {/* Sezione Family */}
            <FamilySection />
          </div>
        </div>
      </PullToRefresh>
      <ScrollToTop />
    </HomepageLayout>
  );
};

export default Index;
