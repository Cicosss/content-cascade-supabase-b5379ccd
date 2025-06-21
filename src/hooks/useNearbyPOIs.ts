
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
    console.log('🔍 Caricamento POI nei dintorni di:', currentPOI.id);

    try {
      // Fetch all POIs except the current one
      const { data: pois, error } = await supabase
        .from('points_of_interest')
        .select('id, name, description, category, latitude, longitude, address, images, target_audience')
        .neq('id', currentPOI.id)
        .eq('status', 'approved');

      if (error) {
        console.error('❌ Errore nel caricamento POI:', error);
        setError('Errore nel caricamento dei POI vicini');
        return;
      }

      if (!pois || pois.length === 0) {
        console.log('ℹ️ Nessun POI trovato nel database');
        setNearbyPOIs([]);
        return;
      }

      // Calculate distances and filter POIs within 2km
      const poisWithDistance: NearbyPOI[] = pois
        .map(poi => {
          // Validate coordinates
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
        .filter((poi): poi is NearbyPOI => poi !== null) // Filter out null values
        .filter(poi => poi.distance <= 2) // Within 2km
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .slice(0, 3); // Take only first 3

      console.log(`✅ Trovati ${poisWithDistance.length} POI nei dintorni (entro 2km)`);
      setNearbyPOIs(poisWithDistance);

    } catch (error) {
      console.error('❌ Errore inaspettato:', error);
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
