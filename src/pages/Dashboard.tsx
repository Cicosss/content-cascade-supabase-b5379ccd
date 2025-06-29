
import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';
import GoogleMap from '@/components/dashboard/GoogleMap';
import { Separator } from '@/components/ui/separator';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { filters } = useURLFilters();
  const { user } = useAuth();
  const { profile } = useProfileData();

  // Convert URL filters to map filters format
  const mapFilters = {
    activityTypes: filters.categories,
    zone: filters.zone,
    withChildren: filters.specialPreferences?.includes('famiglia') ? 'si' : 'no'
  };

  const getUserName = () => {
    if (profile.first_name) {
      return profile.first_name;
    } else if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Esploratore';
  };

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen bg-white">
        {/* Sezione Superiore - Area di Controllo Scura */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Intestazione Fluttuante Elegante */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Ciao, {getUserName()}!
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Iniziamo? Esplora la mappa o applica i filtri per scoprire la tua Romagna.
              </p>
              <div className="flex justify-center">
                <Separator className="w-4/5 max-w-md bg-white/20" />
              </div>
            </div>

            {/* Sezione principale: Mappa + Meteo + Stato Costa */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
              {/* Colonna principale - Mappa Interattiva */}
              <div className="lg:col-span-3">
                <div className="h-full rounded-3xl overflow-hidden shadow-xl">
                  <GoogleMap filters={mapFilters} />
                </div>
              </div>
              
              {/* Colonna laterale - Meteo e Stato Costa con flexbox */}
              <div className="lg:col-span-1 flex flex-col gap-3 h-full">
                <div className="flex-1">
                  <PersonalizedWeather />
                </div>
                <div className="flex-1">
                  <CoastalStatusWidget />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sezione Inferiore - Contenuti con Sfondo Chiaro */}
        <div className="bg-slate-50">
          <div className="container mx-auto px-4 py-8">
            <PersonalizedContent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
