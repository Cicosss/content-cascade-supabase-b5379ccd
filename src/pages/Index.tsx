
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InteractiveHeroSection from '@/components/InteractiveHeroSection';
import ValuePropositionSection from '@/components/ValuePropositionSection';
import AppFeaturesSection from '@/components/AppFeaturesSection';

// Import the new homepage components
import TopSection from '@/components/homepage/TopSection';
import RestaurantsSection from '@/components/homepage/RestaurantsSection';
import ServicesSection from '@/components/homepage/ServicesSection';
import ExperiencesSection from '@/components/homepage/ExperiencesSection';
import SeaBulletinWidget from '@/components/homepage/SeaBulletinWidget';
import EventsSection from '@/components/homepage/EventsSection';
import HelpBanner from '@/components/homepage/HelpBanner';
import FamilySection from '@/components/homepage/FamilySection';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
    <Layout showSidebar={true}>
      <InteractiveHeroSection />
      <ValuePropositionSection />
      <AppFeaturesSection />
      
      <div className="container mx-auto px-4 py-12">
        {/* Top Section: Weather and Guest Card */}
        <TopSection />

        {/* Main Content Sections */}
        <div className="space-y-16">
          {/* Tradizione Culinaria */}
          <RestaurantsSection />

          {/* Servizi Vicini */}
          <ServicesSection />

          {/* Esperienze del Territorio */}
          <ExperiencesSection />

          {/* Bollettino del Mare */}
          <SeaBulletinWidget />

          {/* Eventi Speciali */}
          <EventsSection />

          {/* Hai bisogno di aiuto? */}
          <HelpBanner />

          {/* Sezione Family */}
          <FamilySection />
        </div>

      </div>
    </Layout>
  );
};

export default Index;
