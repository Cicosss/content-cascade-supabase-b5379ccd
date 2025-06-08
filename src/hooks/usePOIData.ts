
import { useState, useCallback } from 'react';

interface POI {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  target_audience: string;
}

interface Filters {
  activityTypes: string[];
}

export const usePOIData = () => {
  const [pois, setPois] = useState<POI[]>([]);

  const fetchPOIs = useCallback(async (filters: Filters) => {
    console.log('🗺️ Caricamento POI...');
    
    // Per ora uso dati fallback, poi si può collegare al database
    const fallbackData = [
      {
        id: '1',
        name: 'Osteria del Borgo Antico',
        description: 'Tradizione Culinaria Romagnola',
        poi_type: 'restaurant',
        category: 'cibo',
        latitude: 44.0646,
        longitude: 12.5736,
        address: 'Centro Storico di Rimini',
        target_audience: 'everyone'
      },
      {
        id: '2',
        name: 'Tempio Malatestiano',
        description: 'Capolavoro Rinascimentale',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0587,
        longitude: 12.5684,
        address: 'Via IV Novembre, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '3',
        name: 'Spiaggia di Riccione',
        description: 'Relax sul mare adriatico',
        poi_type: 'beach',
        category: 'parchi e natura',
        latitude: 44.0139,
        longitude: 12.6578,
        address: 'Lungomare di Riccione',
        target_audience: 'everyone'
      },
      {
        id: '4',
        name: 'Ponte di Tiberio',
        description: 'Ponte Romano storico',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0632,
        longitude: 12.5645,
        address: 'Corso d\'Augusto, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '5',
        name: 'Parco Federico Fellini',
        description: 'Verde pubblico nel centro',
        poi_type: 'park',
        category: 'parchi e natura',
        latitude: 44.0598,
        longitude: 12.5712,
        address: 'Rimini Centro',
        target_audience: 'everyone'
      }
    ];
    
    setPois(fallbackData);
  }, []);

  return {
    pois,
    fetchPOIs
  };
};
