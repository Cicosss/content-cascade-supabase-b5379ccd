
import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import GoogleMap from '@/components/dashboard/GoogleMap';
import ExperienceFilters from '@/components/dashboard/ExperienceFilters';
import { useURLFilters } from '@/hooks/useURLFilters';

const Dashboard = () => {
  const { filters, updateFilters } = useURLFilters();

  // Convert URL filters to map filters format
  const mapFilters = {
    activityTypes: filters.categories,
    zone: filters.zone,
    withChildren: filters.specialPreferences?.includes('famiglia') ? 'si' : 'no'
  };

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Sezione principale: Mappa + Meteo */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
            {/* Colonna principale - Mappa Interattiva */}
            <div className="lg:col-span-3">
              <div className="h-full rounded-3xl overflow-hidden shadow-xl">
                <GoogleMap filters={mapFilters} />
              </div>
            </div>
            
            {/* Colonna laterale - Meteo */}
            <div className="lg:col-span-1">
              <PersonalizedWeather />
            </div>
          </div>

          {/* Pannello Filtri */}
          <ExperienceFilters 
            filters={filters}
            setFilters={updateFilters}
          />

          {/* Contenuti personalizzati */}
          <PersonalizedContent />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
