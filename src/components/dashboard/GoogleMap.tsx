
import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { usePOIData } from '@/hooks/usePOIData';
import { Loader2 } from 'lucide-react';
import POIPreviewCard from './POIPreviewCard';
import MapControls from './MapControls';
import MapLoadingIndicator from './MapLoadingIndicator';
import { useGoogleMapsInit } from '@/hooks/useGoogleMapsInit';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import { useGoogleMapMarkers } from '@/hooks/useGoogleMapMarkers';

interface GoogleMapProps {
  filters: {
    activityTypes: string[];
    zone: string;
    withChildren: string;
  };
}

const GoogleMap: React.FC<GoogleMapProps> = ({ filters }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPOI, setSelectedPOI] = useState<any>(null);
  
  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { pois, fetchPOIs, isLoading: isLoadingPOIs } = usePOIData();
  const { isLoaded } = useGoogleMapsInit();
  const mapInstance = useGoogleMapInstance({ isLoaded, mapRef, userLocation });

  useGoogleMapMarkers({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect: setSelectedPOI
  });

  // Load POIs when map is ready or filters change
  useEffect(() => {
    if (!mapInstance) return;
    fetchPOIs(filters);
  }, [mapInstance, filters, fetchPOIs]);

  const handleCenterOnUser = () => {
    if (userLocation && mapInstance) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    } else {
      getCurrentLocation();
    }
  };

  const handleGetDirections = (poi: any) => {
    const destination = `${poi.latitude},${poi.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  };

  const handleClosePreview = () => {
    setSelectedPOI(null);
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      <MapLoadingIndicator isLoadingPOIs={isLoadingPOIs} />
      
      <MapControls 
        onCenterOnUser={handleCenterOnUser}
        isLoadingLocation={isLoadingLocation}
      />

      {selectedPOI && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <POIPreviewCard
            poi={selectedPOI}
            onClose={handleClosePreview}
            onGetDirections={handleGetDirections}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
