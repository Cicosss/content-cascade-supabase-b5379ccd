
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from '@/utils/distanceCalculator';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  target_audience: string;
}

interface NearbyPOI extends POI {
  distance: number;
}

export const useNearbyPOIs = () => {
  const [nearbyPOIs, setNearbyPOIs] = useState<NearbyPOI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNearbyPOIs = useCallback(async (currentPOI: { id: string; latitude: number; longitude: number }) => {
    if (!currentPOI.latitude || !currentPOI.longitude) {
      setError('Coordinate del POI non disponibili');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { data: pois, error } = await supabase
        .from('points_of_interest')
        .select('id, name, description, category, latitude, longitude, address, images, target_audience')
        .neq('id', currentPOI.id)
        .eq('status', 'approved');

      if (error) {
        setError('Errore nel caricamento dei POI vicini');
        return;
      }

      if (!pois || pois.length === 0) {
        setNearbyPOIs([]);
        return;
      }

      const poisWithDistance: NearbyPOI[] = pois
        .map(poi => {
          if (!poi.latitude || !poi.longitude) {
            return null;
          }
          
          const distance = calculateDistance(
            { latitude: currentPOI.latitude, longitude: currentPOI.longitude },
            { latitude: poi.latitude, longitude: poi.longitude }
          );
          
          return {
            ...poi,
            images: poi.images || [],
            distance
          };
        })
        .filter((poi): poi is NearbyPOI => poi !== null)
        .filter(poi => poi.distance <= 2)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      setNearbyPOIs(poisWithDistance);

    } catch (error) {
      setError('Errore inaspettato nel caricamento');
      setNearbyPOIs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    nearbyPOIs, 
    isLoading, 
    error,
    fetchNearbyPOIs 
  };
};
