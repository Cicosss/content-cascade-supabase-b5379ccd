
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import FilterPanel from '@/components/dashboard/FilterPanel';
import AdvancedFilters from '@/components/dashboard/AdvancedFilters';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import { Card } from '@/components/ui/card';
import { MapPin, Filter } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);
  const [mapLocation, setMapLocation] = useState<{lat: number; lng: number} | null>(null);

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
    <Layout showSidebar={true}>
      {/* Dashboard Header */}
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
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filtri Base</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Map and Advanced Filters */}
          <div className="xl:col-span-2 space-y-6">
            {/* Interactive Map */}
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
                <InteractiveMap 
                  filters={filters} 
                  onLocationChange={setMapLocation}
                />
              </div>
            </Card>

            {/* Advanced Filters */}
            <AdvancedFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Right Column - Weather */}
          <div className="space-y-6">
            <PersonalizedWeather gpsLocation={mapLocation} />
          </div>
        </div>

        {/* Personalized Content Carousels */}
        <div className="mt-12">
          <PersonalizedContent filters={filters} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
