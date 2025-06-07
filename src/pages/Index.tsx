
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import AppFeaturesSection from '@/components/AppFeaturesSection';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">
              Benvenuto nella tua Romagna! 🌿
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Esplora la bellezza e le tradizioni della Romagna con la tua guida personalizzata.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/dashboard')} size="lg">
                Vai alla Dashboard
              </Button>
              <Button onClick={() => navigate('/experiences')} variant="outline" size="lg">
                Esplora Esperienze
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <HeroSection />
      <ServicesSection />
      <AppFeaturesSection />
      
      <div className="text-center py-16">
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/auth')} size="lg">
            Accedi
          </Button>
          <Button onClick={() => navigate('/auth')} variant="outline" size="lg">
            Registrati
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
