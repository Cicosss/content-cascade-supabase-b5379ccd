
import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import CoastalStatusWidget from '@/components/dashboard/CoastalStatusWidget';
import SimpleInteractiveMap from '@/components/dashboard/SimpleInteractiveMap';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';
import { APIHealthMonitor } from '@/components/dashboard/APIHealthMonitor';
import CarouselMetrics from '@/components/dashboard/CarouselMetrics';

import { useURLFilters } from '@/hooks/useURLFilters';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardErrorBoundary } from '@/components/dashboard/error-boundaries/DashboardErrorBoundary';
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
            <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
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

              {/* Sezione principale: Mappa + Meteo + Stato Costa - Mobile First */}
              <div className="space-y-8 lg:space-y-0">
                {/* Mobile: Mappa a tutto schermo, Desktop: Grid layout */}
                <div className="lg:grid lg:grid-cols-4 lg:gap-6 lg:h-[500px]">
                  {/* Mappa - Mobile: altezza grande, Desktop: 3/4 della griglia */}
                  <div className="h-[60vh] min-h-[400px] lg:h-full lg:col-span-3">
                    <div className="h-full rounded-3xl overflow-hidden shadow-xl">
                      <APIErrorBoundary>
                        <SimpleInteractiveMap filters={mapFilters} />
                      </APIErrorBoundary>
                    </div>
                  </div>
                  
                  {/* Meteo e Stato Costa - Mobile: sotto mappa, Desktop: sidebar */}
                  <div className="lg:col-span-1 lg:flex lg:flex-col lg:gap-3 lg:h-full">
                    {/* Mobile: grid orizzontale, Desktop: stack verticale */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-3 lg:h-full">
                      <div className="lg:flex-1">
                        <WeatherErrorBoundary>
                          <PersonalizedWeather />
                        </WeatherErrorBoundary>
                      </div>
                      <div className="lg:flex-1">
                        <APIErrorBoundary>
                          <CoastalStatusWidget />
                        </APIErrorBoundary>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sezione Inferiore - Contenuti con Sfondo Chiaro */}
          <div className="bg-slate-50">
            <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
              <APIErrorBoundary>
                <PersonalizedContent />
              </APIErrorBoundary>
            </div>
          </div>
        </div>
        
        {/* Debug components - Hidden on mobile */}
        <div className="hidden lg:block">
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
        </div>
      </Layout>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
