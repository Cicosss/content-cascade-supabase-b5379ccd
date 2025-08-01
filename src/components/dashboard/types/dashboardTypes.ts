import { User } from '@supabase/supabase-js';

/**
 * Type Definitions per Dashboard Components
 * 
 * Definisce chiaramente le interfacce e i tipi utilizzati
 * attraverso l'albero dei componenti dashboard
 */

export interface MapFilters {
  activityTypes: string[];
  zone?: string;
  withChildren: 'si' | 'no';
}

export interface URLFilters {
  categories: string[];
  zone?: string;
  specialPreferences?: string[];
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface DashboardData {
  userName: string;
  mapFilters: MapFilters;
  filters: URLFilters;
  user?: User | null;
  profile: UserProfile;
}

export interface DashboardViewProps {
  data: DashboardData;
}

export interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface WeatherWidgetData {
  temperature?: number;
  condition?: string;
  location?: string;
  isLoading?: boolean;
  error?: string;
}

export interface CoastalStatusData {
  seaConditions?: string;
  windSpeed?: number;
  waveHeight?: number;
  isLoading?: boolean;
  error?: string;
}