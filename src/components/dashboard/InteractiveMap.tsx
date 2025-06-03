
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Navigation, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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

interface InteractiveMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters }) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPOIs();
    getCurrentLocation();
  }, [filters]);

  const fetchPOIs = async () => {
    let query = supabase.from('points_of_interest').select('*');

    // Apply filters
    if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
      query = query.in('category', filters.activityTypes);
    }

    if (filters.withChildren === 'sì') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone');
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching POIs:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i punti di interesse",
        variant: "destructive"
      });
    } else {
      setPois(data || []);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Rimini center
          setUserLocation({
            lat: 44.0646,
            lng: 12.5736
          });
        }
      );
    }
  };

  const getDirections = (poi: POI) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`;
    window.open(url, '_blank');
  };

  const getPoiIcon = (type: string, category: string) => {
    if (type === 'restaurant' || category === 'cibo') return '🍽️';
    if (type === 'monument' || category === 'arte e cultura') return '🏛️';
    if (category === 'sport') return '⚽';
    if (category === 'musica') return '🎵';
    if (category === 'parchi e natura') return '🌳';
    if (category === 'vita notturna') return '🌙';
    if (category === 'intrattenimento') return '🎭';
    return '📍';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map placeholder with POIs visualization */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl relative overflow-hidden">
        
        {/* User location indicator */}
        {userLocation && (
          <div 
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              La tua posizione
            </div>
          </div>
        )}

        {/* POI markers */}
        {pois.map((poi, index) => {
          const randomX = 20 + (index * 15) % 60;
          const randomY = 20 + (index * 20) % 60;
          
          return (
            <div
              key={poi.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${randomX}%`,
                top: `${randomY}%`
              }}
              onClick={() => setSelectedPoi(poi)}
            >
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-400 group-hover:scale-110 transition-transform">
                <span className="text-sm">{getPoiIcon(poi.poi_type, poi.category)}</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {poi.name}
              </div>
            </div>
          );
        })}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Map legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="font-semibold mb-2">Legenda</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span>🍽️</span> <span>Ristoranti</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏛️</span> <span>Monumenti</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌳</span> <span>Natura</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎭</span> <span>Intrattenimento</span>
            </div>
          </div>
        </div>
      </div>

      {/* POI Details Panel */}
      {selectedPoi && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{selectedPoi.name}</h3>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedPoi.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              📍 {selectedPoi.address}
            </div>
            <Button
              size="sm"
              onClick={() => getDirections(selectedPoi)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Car className="h-4 w-4 mr-1" />
              Indicazioni
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
