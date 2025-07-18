import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';
import InteractiveMap from '@/components/dashboard/map/InteractiveMap';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { APIHealthMonitor } from '@/components/dashboard/APIHealthMonitor';
import CarouselMetrics from '@/components/dashboard/CarouselMetrics';

import { useURLFilters } from '@/hooks/useURLFilters';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardErrorBoundary } from '@/components/dashboard/error-boundaries/DashboardErrorBoundary';
import { MapErrorBoundary } from '@/components/dashboard/error-boundaries/MapErrorBoundary';
import { WeatherErrorBoundary } from '@/components/dashboard/error-boundaries/WeatherErrorBoundary';
import { ErrorRecoveryMonitor } from '@/components/dashboard/ErrorRecoveryMonitor';

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
    <DashboardErrorBoundary>
      <Layout>
        <div className="min-h-screen bg-white">
          {/* Sezione Superiore - Area di Controllo Scura */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
            <div className="container mx-auto px-4 py-8 space-y-8">
              {/* Intestazione Fluttuante Elegante Premium */}
              <div className="text-center space-y-6 py-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
                  Ciao, {getUserName()}!
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed tracking-wide">
                  Iniziamo? Esplora la mappa o applica i filtri per scoprire la tua Romagna.
                </p>
                <div className="flex justify-center">
                  <div className="w-36 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-600 rounded-full"></div>
                </div>
              </div>

              {/* Sezione principale: Mappa + Meteo + Stato Costa */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
                {/* Colonna principale - Mappa Interattiva */}
                <div className="lg:col-span-3">
                  <div className="h-full rounded-3xl overflow-hidden shadow-xl">
                    <MapErrorBoundary filters={mapFilters}>
                      <InteractiveMap filters={mapFilters} />
                    </MapErrorBoundary>
                  </div>
                </div>
                
                {/* Colonna laterale - Meteo e Stato Costa con flexbox */}
                <div className="lg:col-span-1 flex flex-col gap-3 h-full">
                  <div className="flex-1">
                    <WeatherErrorBoundary>
                      <PersonalizedWeather />
                    </WeatherErrorBoundary>
                  </div>
                  <div className="flex-1">
                    <APIErrorBoundary>
                      <CoastalStatusWidget />
                    </APIErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sezione Inferiore - Contenuti con Sfondo Chiaro */}
          <div className="bg-slate-50">
            <div className="container mx-auto px-4 py-8">
              <APIErrorBoundary>
                <PersonalizedContent />
              </APIErrorBoundary>
            </div>
          </div>
        </div>
        
        <APIHealthMonitor />
        <ErrorRecoveryMonitor />
        
        {/* Sistema di monitoraggio performance ottimizzato */}
        <CarouselMetrics 
          metrics={{
            responseTime: 120,
            cacheHit: true,
            retryCount: 0,
            hitRate: 92,
            staleData: false
          }}
          carouselType="dashboard"
        />
      </Layout>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
