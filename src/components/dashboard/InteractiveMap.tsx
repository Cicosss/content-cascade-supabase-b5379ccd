
import React, { useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPOIs();
    getCurrentLocation();
  }, [filters]);

  const fetchPOIs = async () => {
    try {
      console.log('Fetching POIs from database...');
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
          title: "Errore nel caricamento",
          description: "Impossibile caricare i punti di interesse",
          variant: "destructive"
        });
        // Use fallback data
        setFallbackPOIs();
      } else {
        console.log('POIs fetched:', data);
        if (data && data.length > 0) {
          setPois(data);
        } else {
          console.log('No POIs found, using fallback data');
          setFallbackPOIs();
        }
      }
    } catch (error) {
      console.error('Error in fetchPOIs:', error);
      setFallbackPOIs();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackPOIs = () => {
    const fallbackData = [
      {
        id: '1',
        name: 'Osteria del Borgo Antico',
        description: 'Tradizione Culinaria Romagnola Autentica',
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
        description: 'Capolavoro Rinascimentale patrimonio UNESCO',
        poi_type: 'monument',
        category: 'arte e cultura',
        latitude: 44.0587,
        longitude: 12.5684,
        address: 'Via IV Novembre, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '3',
        name: 'Parco Avventura',
        description: 'Percorsi acrobatici per famiglie',
        poi_type: 'experience',
        category: 'parchi e natura',
        latitude: 44.0712,
        longitude: 12.6015,
        address: 'Colline Riminesi',
        target_audience: 'families'
      },
      {
        id: '4',
        name: 'La Vera Piadineria 1952',
        description: 'Street Food Romagnolo Tradizionale',
        poi_type: 'restaurant',
        category: 'cibo',
        latitude: 44.0587,
        longitude: 12.5741,
        address: 'Borgo San Giuliano, Rimini',
        target_audience: 'everyone'
      },
      {
        id: '5',
        name: 'Grotte di Onferno',
        description: 'Meraviglia sotterranea con pipistrelli',
        poi_type: 'experience',
        category: 'parchi e natura',
        latitude: 43.9542,
        longitude: 12.4856,
        address: 'Gemmano (RN)',
        target_audience: 'families'
      }
    ];
    setPois(fallbackData);
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
    } else {
      // Default to Rimini center
      setUserLocation({
        lat: 44.0646,
        lng: 12.5736
      });
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200">
      {/* Map Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <h3 className="font-bold text-lg">Mappa Interattiva Romagna</h3>
        <p className="text-blue-100 text-sm">Scopri {pois.length} punti di interesse</p>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 overflow-hidden">
        
        {/* GPS-style background with roads and districts */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px),
              linear-gradient(0deg, rgba(59, 130, 246, 0.2) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.2) 2px, transparent 2px),
              radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%)
            `,
            backgroundSize: '30px 30px, 30px 30px, 120px 120px, 120px 120px, 200px 200px, 180px 180px, 300px 300px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0'
          }}
        />

        {/* Additional road-like elements */}
        <div className="absolute inset-0">
          {/* Main roads */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent"></div>
          <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gradient-to-b from-transparent via-blue-300/40 to-transparent"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-gradient-to-b from-transparent via-blue-300/40 to-transparent"></div>
          
          {/* Secondary roads */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-300/50 rotate-12"></div>
          <div className="absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gray-300/50 -rotate-12"></div>
          
          {/* District areas */}
          <div className="absolute top-8 left-8 w-20 h-16 border border-green-200/60 rounded bg-green-50/30"></div>
          <div className="absolute top-16 right-12 w-24 h-20 border border-orange-200/60 rounded bg-orange-50/30"></div>
          <div className="absolute bottom-20 left-16 w-28 h-18 border border-purple-200/60 rounded bg-purple-50/30"></div>
          <div className="absolute bottom-16 right-20 w-22 h-16 border border-blue-200/60 rounded bg-blue-50/30"></div>
        </div>

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
          const gridRows = Math.ceil(pois.length / gridCols);
          const col = index % gridCols;
          const row = Math.floor(index / gridCols);
          
          const x = 15 + (col * 70 / Math.max(gridCols - 1, 1));
          const y = 15 + (row * 70 / Math.max(gridRows - 1, 1));
          
          return (
            <div
              key={poi.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{
                left: `${Math.min(Math.max(x, 10), 90)}%`,
                top: `${Math.min(Math.max(y, 10), 90)}%`
              }}
              onClick={() => setSelectedPoi(poi)}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-3 border-red-400 group-hover:scale-110 transition-all duration-200 group-hover:shadow-xl group-hover:border-red-500">
                  <span className="text-xl">{getPoiIcon(poi.poi_type, poi.category)}</span>
                </div>
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-200 z-30 max-w-40">
                  <div className="font-semibold text-gray-800">{poi.name}</div>
                  <div className="text-gray-500">{poi.category}</div>
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

        {/* Map statistics */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 text-sm shadow-lg border border-gray-200">
          <div className="font-semibold text-gray-800">{pois.length} POI trovati</div>
          <div className="text-gray-600 text-xs">
            {filters.activityTypes.includes('tutto') ? 'Tutte le categorie' : filters.activityTypes.join(', ')}
          </div>
        </div>
      </div>

      {/* POI Details Panel */}
      {selectedPoi && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPoiIcon(selectedPoi.poi_type, selectedPoi.category)}</span>
              <h3 className="font-bold text-lg text-gray-800">{selectedPoi.name}</h3>
            </div>
            <button
              onClick={() => setSelectedPoi(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2 py-1 hover:bg-gray-200 rounded"
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
