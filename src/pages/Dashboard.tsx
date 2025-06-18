
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import ExperienceFilters from '@/components/dashboard/ExperienceFilters';
import MapSection from '@/components/dashboard/MapSection';
import { DateRange } from 'react-day-picker';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    categories: ['tutte'],
    zone: 'tuttalromagna',
    period: undefined as DateRange | undefined,
    timeSlots: [],
    budgets: [],
    specialPreferences: []
  });

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Colonna sinistra - Filtri */}
            <div className="xl:col-span-1">
              <ExperienceFilters filters={filters} setFilters={setFilters} />
            </div>
            
            {/* Colonna centrale - Contenuto personalizzato */}
            <div className="xl:col-span-2 space-y-8">
              <PersonalizedContent filters={filters} onUpdateFilters={setFilters} />
            </div>
            
            {/* Colonna destra - Meteo e Mappa */}
            <div className="xl:col-span-1 space-y-8">
              <PersonalizedWeather />
              <MapSection filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
