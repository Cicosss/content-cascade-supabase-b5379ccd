import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LocationProvider } from '@/contexts/LocationContext';
import Layout from '@/components/Layout';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import AdvancedFilters from '@/components/dashboard/AdvancedFilters';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    zone: 'tutto',
    withChildren: 'no',
    activityTypes: ['tutto'],
    period: null,
    isFirstVisit: true
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <LocationProvider>
      <Layout showSidebar={true}>
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Ciao {user.user_metadata?.first_name || user.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-slate-200 text-lg">
                  Esplora la tua Romagna personalizzata
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="h-[600px] p-6 rounded-3xl border-0 shadow-xl">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-400 rounded-xl flex items-center justify-center mr-3">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Mappa Interattiva
                  </h2>
                </div>
                <div className="h-[calc(100%-4rem)]">
                  <InteractiveMap filters={filters} />
                </div>
              </Card>

              <AdvancedFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="space-y-6">
              <PersonalizedWeather />
            </div>
          </div>

          <div className="mt-12">
            <PersonalizedContent filters={filters} />
          </div>
        </div>
      </Layout>
    </LocationProvider>
  );
};

export default Dashboard;
