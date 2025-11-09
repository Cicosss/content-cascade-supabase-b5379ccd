
import React, { useEffect, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import HomepageLayout from '@/components/HomepageLayout';
import InteractiveHeroSection from '@/components/InteractiveHeroSection';
import ValuePropositionSection from '@/components/ValuePropositionSection';
import ScrollToTop from '@/components/ui/ScrollToTop';
import PullToRefresh from '@/components/ui/PullToRefresh';

// Import above-the-fold components immediately
import TopSection from '@/components/homepage/TopSection';
import HelpBanner from '@/components/homepage/HelpBanner';
import FamilySection from '@/components/homepage/FamilySection';
import FirstCarouselSection from '@/components/homepage/sections/FirstCarouselSection';

// Lazy load below-the-fold components
const AppFeaturesSection = lazy(() => import('@/components/AppFeaturesSection'));
const SecondCarouselSection = lazy(() => import('@/components/homepage/sections/SecondCarouselSection'));
const ThirdCarouselSection = lazy(() => import('@/components/homepage/sections/ThirdCarouselSection'));
const FourthCarouselSection = lazy(() => import('@/components/homepage/sections/FourthCarouselSection'));
const PassportTeaserWidget = lazy(() => import('@/components/homepage/PassportTeaserWidget'));
const RespiroDelMareTeaser = lazy(() => import('@/components/homepage/RespiroDelMareTeaser'));

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
        <div className="typography-h4 text-white">Caricamento...</div>
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
        
        {/* Value Proposition e Prima sezione caroselli raggruppate */}
        <ValuePropositionSection />
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-6 md:py-8">
          <FirstCarouselSection />
        </div>
        
        {/* Lazy loaded sections below the fold */}
        <Suspense fallback={<div className="h-20" />}>
          {/* Seconda sezione caroselli */}
          <div className="container mx-auto px-3 md:px-4 lg:px-6 py-6 md:py-8">
            <SecondCarouselSection />
          </div>
          
          <AppFeaturesSection />
          
          {/* Passport Teaser Widget - positioned after features */}
          <PassportTeaserWidget />
          
          <div className="container mx-auto px-3 md:px-4 lg:px-6 py-6 md:py-8 lg:py-12">
            {/* Top Section: Weather and Guest Card */}
            <TopSection />

            {/* Terza sezione caroselli dopo top section */}
            <div className="py-8 md:py-12">
              <ThirdCarouselSection />
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8 md:space-y-12 lg:space-y-16">
              {/* Hai bisogno di aiuto? */}
              <HelpBanner />

              {/* Quarta sezione caroselli dopo help banner */}
              <FourthCarouselSection />

              {/* Sezione Family */}
              <FamilySection />
            </div>
          </div>

          {/* Respiro del Mare Teaser - positioned before footer */}
          <RespiroDelMareTeaser />
        </Suspense>
      </PullToRefresh>
      <ScrollToTop />
    </HomepageLayout>
  );
};

export default Index;
