
import React from 'react';
import WeatherWidget from '@/components/WeatherWidget';
import GuestCard from '@/components/GuestCard';

const TopSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <WeatherWidget />
      <GuestCard />
    </div>
  );
};

export default TopSection;
