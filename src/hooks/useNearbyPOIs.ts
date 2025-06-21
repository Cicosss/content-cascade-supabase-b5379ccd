
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
    console.log('🗺️ [NearbyPOIs] Inizio ricerca POI vicini per:', currentPOI);
    
    if (!currentPOI.latitude || !currentPOI.longitude) {
      console.error('❌ [NearbyPOIs] Coordinate del POI non disponibili:', currentPOI);
      setError('Coordinate del POI non disponibili');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both standard POIs and approved submissions
      const [standardResult, approvedResult] = await Promise.all([
        supabase
          .from('points_of_interest')
          .select('id, name, description, category, latitude, longitude, address, images, target_audience')
          .neq('id', currentPOI.id)
          .eq('status', 'approved'),
        
        supabase
          .from('poi_submissions')
          .select('id, name, description, category, latitude, longitude, address, images, target_audience')
          .neq('id', currentPOI.id)
          .eq('status', 'approved')
      ]);

      if (standardResult.error) {
        console.error('❌ [NearbyPOIs] Errore caricamento POI standard:', standardResult.error);
      }
      
      if (approvedResult.error) {
        console.error('❌ [NearbyPOIs] Errore caricamento POI approvate:', approvedResult.error);
      }

      // Combine all POIs
      const allPois = [
        ...(standardResult.data || []),
        ...(approvedResult.data || [])
      ];

      console.log(`📊 [NearbyPOIs] POI totali caricati: ${allPois.length}`, {
        standard: standardResult.data?.length || 0,
        approved: approvedResult.data?.length || 0
      });

      if (allPois.length === 0) {
        console.log('⚠️ [NearbyPOIs] Nessun POI trovato nel database');
        setNearbyPOIs([]);
        return;
      }

      // Calculate distances and filter by radius (increased to 5km for better results)
      const poisWithDistance: NearbyPOI[] = allPois
        .map(poi => {
          if (!poi.latitude || !poi.longitude) {
            console.log(`⚠️ [NearbyPOIs] POI senza coordinate valide: ${poi.name}`, { lat: poi.latitude, lng: poi.longitude });
            return null;
          }
          
          const distance = calculateDistance(
            { latitude: currentPOI.latitude, longitude: currentPOI.longitude },
            { latitude: poi.latitude, longitude: poi.longitude }
          );
          
          console.log(`📏 [NearbyPOIs] Distanza per ${poi.name}: ${distance.toFixed(2)} km`);
          
          return {
            ...poi,
            images: poi.images || [],
            distance
          };
        })
        .filter((poi): poi is NearbyPOI => poi !== null)
        .filter(poi => poi.distance <= 5) // Increased radius to 5km
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6); // Show more results

      console.log(`✅ [NearbyPOIs] POI vicini trovati nel raggio di 5km: ${poisWithDistance.length}`);
      console.log('📍 [NearbyPOIs] Dettagli POI trovati:', poisWithDistance.map(p => ({ 
        name: p.name, 
        distance: `${p.distance.toFixed(2)}km`,
        category: p.category
      })));

      setNearbyPOIs(poisWithDistance);

    } catch (error) {
      console.error('❌ [NearbyPOIs] Errore inaspettato:', error);
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
