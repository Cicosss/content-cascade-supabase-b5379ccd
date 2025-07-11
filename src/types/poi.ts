
import { DateRange } from 'react-day-picker';

export interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
  images?: string[];
  price_info?: string;
  avg_rating?: number;
}

export interface POIFilters {
  activityTypes: string[];
  withChildren: string;
  period?: DateRange;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
