
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WeatherWidget from '@/components/WeatherWidget';
import WeatherTeaser from '@/components/WeatherTeaser';
import GuestCard from '@/components/GuestCard';

const TopSection = () => {
  const { user, loading } = useAuth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Mostra WeatherWidget per utenti loggati, WeatherTeaser per non loggati */}
      {!loading && user ? <WeatherWidget /> : <WeatherTeaser />}
      <GuestCard />
    </div>
  );
};

export default TopSection;
