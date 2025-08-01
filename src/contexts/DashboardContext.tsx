import React, { createContext, useContext, useMemo } from 'react';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardContextType {
  user: any;
  profile: any;
  mapFilters: {
    activityTypes: string[];
    zone: string;
    withChildren: string;
  };
  userName: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { filters } = useURLFilters();
  const { user } = useAuth();
  const { profile } = useProfileData();

  const mapFilters = useMemo(() => ({
    activityTypes: filters.categories,
    zone: filters.zone,
    withChildren: filters.specialPreferences?.includes('famiglia') ? 'si' : 'no'
  }), [filters]);

  const userName = useMemo(() => {
    if (profile.first_name) {
      return profile.first_name;
    } else if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Esploratore';
  }, [profile, user]);

  const value = useMemo(() => ({
    user,
    profile,
    mapFilters,
    userName
  }), [user, profile, mapFilters, userName]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};