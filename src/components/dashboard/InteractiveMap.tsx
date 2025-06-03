
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

  // Fixed map style with proper height
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden">
      {/* Map container with fixed height */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 border-2 border-blue-100">
        
        {/* Grid overlay for better visual structure */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* User location indicator */}
        {userLocation && (
          <div 
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                La tua posizione
              </div>
            </div>
          </div>
        )}

        {/* POI markers distributed across the map */}
        {pois.map((poi, index) => {
          // Better distribution algorithm
          const gridCols = 4;
          const gridRows = 3;
          const col = index % gridCols;
          const row = Math.floor(index / gridCols) % gridRows;
          
          const x = 15 + (col * 70 / (gridCols - 1));
          const y = 15 + (row * 70 / (gridRows - 1));
          
          return (
            <div
              key={poi.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{
                left: `${x}%`,
                top: `${y}%`
              }}
              onClick={() => setSelectedPoi(poi)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-400 group-hover:scale-110 transition-all duration-200 group-hover:shadow-xl">
                  <span className="text-lg">{getPoiIcon(poi.poi_type, poi.category)}</span>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-200 z-30">
                  {poi.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 hover:bg-white shadow-lg"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 text-xs shadow-lg border border-gray-200">
          <div className="font-semibold mb-3 text-gray-800">Legenda</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-lg">🍽️</span> <span className="text-gray-700">Ristoranti</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🏛️</span> <span className="text-gray-700">Monumenti</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🌳</span> <span className="text-gray-700">Natura</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🎭</span> <span className="text-gray-700">Intrattenimento</span>
            </div>
          </div>
        </div>

        {/* Map info overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 text-sm shadow-lg border border-gray-200">
          <div className="font-semibold text-gray-800">Mappa Interattiva</div>
          <div className="text-gray-600">Clicca sui punti per i dettagli</div>
        </div>
      </div>

      {/* POI Details Panel */}
      {selectedPoi && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800">{selectedPoi.name}</h3>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedPoi.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {selectedPoi.address || 'Romagna'}
            </div>
            <Button
              size="sm"
              onClick={() => getDirections(selectedPoi)}
              className="bg-blue-500 hover:bg-blue-600 shadow-md"
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
