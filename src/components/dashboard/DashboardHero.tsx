
import React from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHero = () => {
  const { user } = useAuth();
  const { profile } = useProfileData();

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
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl" 
            style={{ textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
          Ciao, {getUserName()}!
        </h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto drop-shadow-lg"
           style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
          Iniziamo? Esplora la mappa o applica i filtri per scoprire la tua Romagna.
        </p>
      </div>
    </div>
  );
};

export default DashboardHero;
