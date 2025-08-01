import React from 'react';
import { useURLFilters } from '@/hooks/useURLFilters';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDashboardView from './MobileDashboardView';
import DesktopDashboardView from './DesktopDashboardView';
import { DashboardData } from '../types/dashboardTypes';

/**
 * Container Component (Smart) - Gestisce stato e logica
 * 
 * Responsabilità:
 * - Fetching dati utente e filtri
 * - Trasformazione dati per i componenti presentazionali
 * - Gestione stato loading/error
 * - Coordinamento tra componenti figli
 */
const MobileDashboardContainer: React.FC = () => {
  const { filters } = useURLFilters();
  const { user } = useAuth();
  const { profile } = useProfileData();
  const isMobile = useIsMobile();

  // Transform URL filters to map filters format
  const mapFilters = {
    activityTypes: filters.categories,
    zone: filters.zone,
    withChildren: (filters.specialPreferences?.includes('famiglia') ? 'si' : 'no') as 'si' | 'no'
  };

  // Extract user name with fallback hierarchy
  const getUserName = (): string => {
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

  // Prepare dashboard data object
  const dashboardData: DashboardData = {
    userName: getUserName(),
    mapFilters,
    filters,
    user,
    profile
  };

  // Render appropriate view based on device
  return isMobile ? (
    <MobileDashboardView data={dashboardData} />
  ) : (
    <DesktopDashboardView data={dashboardData} />
  );
};

export default MobileDashboardContainer;