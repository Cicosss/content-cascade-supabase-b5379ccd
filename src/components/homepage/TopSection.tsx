
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WeatherWidget from '@/components/WeatherWidget';
import GuestCard from '@/components/GuestCard';

const TopSection = () => {
  const { user, loading } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Mostra WeatherWidget per utenti loggati, niente per non loggati */}
      {!loading && user && <WeatherWidget />}
      <GuestCard />
    </div>
  );
};

export default TopSection;
