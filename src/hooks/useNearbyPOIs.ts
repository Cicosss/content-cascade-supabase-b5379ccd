
import { useState, useEffect } from 'react';
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

export const useNearbyPOIs = (currentPOI: { id: string; latitude: number; longitude: number }) => {
  const [nearbyPOIs, setNearbyPOIs] = useState<NearbyPOI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNearbyPOIs = async () => {
      if (!currentPOI.latitude || !currentPOI.longitude) return;
      
      setIsLoading(true);
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
          return;
        }

        if (!pois || pois.length === 0) {
          console.log('ℹ️ Nessun POI trovato nel database');
          setNearbyPOIs([]);
          return;
        }

        // Calculate distances and filter POIs within 2km
        const poisWithDistance: NearbyPOI[] = pois
          .map(poi => ({
            ...poi,
            distance: calculateDistance(
              { latitude: currentPOI.latitude, longitude: currentPOI.longitude },
              { latitude: poi.latitude || 0, longitude: poi.longitude || 0 }
            )
          }))
          .filter(poi => poi.distance <= 2) // Within 2km
          .sort((a, b) => a.distance - b.distance) // Sort by distance
          .slice(0, 3); // Take only first 3

        console.log(`✅ Trovati ${poisWithDistance.length} POI nei dintorni (entro 2km)`);
        setNearbyPOIs(poisWithDistance);

      } catch (error) {
        console.error('❌ Errore inaspettato:', error);
        setNearbyPOIs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyPOIs();
  }, [currentPOI.id, currentPOI.latitude, currentPOI.longitude]);

  return { nearbyPOIs, isLoading };
};
