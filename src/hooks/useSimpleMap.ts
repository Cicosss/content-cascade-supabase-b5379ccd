
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useOptimizedPOIData } from '@/hooks/useOptimizedPOIData';
import { useOptimizedMarkerPool } from '@/hooks/useOptimizedMarkerPool';
import { useUserLocationMarker } from '@/hooks/useUserLocationMarker';
import { useMarkerIcons } from '@/hooks/useMarkerIcons';
import { POI, POIFilters } from '@/types/poi';

interface UseSimpleMapProps {
  filters: {
    activityTypes: string[];
    withChildren: string;
    zone?: string;
    period?: any;
  };
}

export const useSimpleMap = ({ filters }: UseSimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  const lastFetchRef = useRef<string>('');
  const boundsTimeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { isLoaded, error } = useGoogleMapsLoader();
  const { pois, fetchPOIs, isLoading: isLoadingPOIs } = useOptimizedPOIData();
  
  // Initialize marker icons
  const { userIcon } = useMarkerIcons(isLoaded);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance) return;

    const center = userLocation || { lat: 44.0646, lng: 12.5736 };

    try {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: center,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      });

      setMapInstance(map);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isLoaded, userLocation, mapInstance]);

  // Simple bounds management with debounce
  const handleBoundsChange = useCallback(() => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const newBounds = {
      north: Math.round(ne.lat() * 1000) / 1000,
      south: Math.round(sw.lat() * 1000) / 1000,
      east: Math.round(ne.lng() * 1000) / 1000,
      west: Math.round(sw.lng() * 1000) / 1000
    };

    if (boundsTimeoutRef.current) {
      clearTimeout(boundsTimeoutRef.current);
    }

    boundsTimeoutRef.current = setTimeout(() => {
      console.log('🗺️ Simple map bounds changed:', newBounds);
      setMapBounds(newBounds);
    }, 1500);
  }, [mapInstance]);

  // User interaction tracking
  const handleInteractionStart = useCallback(() => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 300);
  }, []);

  // Setup map listeners
  useEffect(() => {
    if (!mapInstance) return;

    const listeners = [
      mapInstance.addListener('bounds_changed', handleBoundsChange),
      mapInstance.addListener('dragstart', handleInteractionStart),
      mapInstance.addListener('dragend', handleInteractionEnd),
      mapInstance.addListener('zoom_changed', handleInteractionStart),
    ];

    // Set initial bounds
    handleBoundsChange();

    return () => {
      listeners.forEach(listener => listener.remove());
      if (boundsTimeoutRef.current) clearTimeout(boundsTimeoutRef.current);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [mapInstance, handleBoundsChange, handleInteractionStart, handleInteractionEnd]);

  // Prepare POI filters
  const poiFilters: POIFilters = {
    activityTypes: filters.activityTypes?.length > 0 && !filters.activityTypes.includes('tutto') 
      ? filters.activityTypes 
      : [],
    withChildren: filters.withChildren || 'no',
    bounds: mapBounds
  };

  // Smart POI fetching with simple debounce
  useEffect(() => {
    if (!mapInstance || !mapBounds) return;

    const filtersKey = JSON.stringify(poiFilters);
    
    // Skip if same filters
    if (filtersKey === lastFetchRef.current) {
      console.log('🔄 Same POI filters, skipping fetch');
      return;
    }

    console.log('🔍 Simple map fetching POIs:', poiFilters);
    lastFetchRef.current = filtersKey;
    fetchPOIs(poiFilters);
  }, [mapInstance, mapBounds, poiFilters, fetchPOIs]);

  // Marker management
  const { clearAllMarkers, validPOICount } = useOptimizedMarkerPool({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect: setSelectedPOI,
    isGoogleMapsLoaded: isLoaded
  });

  // User location marker
  const { clearUserMarker, isMarkerVisible } = useUserLocationMarker({
    map: mapInstance,
    userLocation,
    userIcon
  });

  // Center on user location
  const handleCenterOnUser = useCallback(() => {
    if (userLocation && mapInstance) {
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    } else {
      getCurrentLocation();
    }
  }, [userLocation, mapInstance, getCurrentLocation]);

  // Close POI preview
  const handleClosePreview = useCallback(() => {
    setSelectedPOI(null);
  }, []);

  // Get directions
  const handleGetDirections = useCallback((poi: POI) => {
    const destination = `${poi.latitude},${poi.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(mapsUrl, '_blank');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllMarkers();
      // clearUserMarker(); // Rimosso: il marker utente ha il proprio lifecycle
    };
  }, [clearAllMarkers]);

  return {
    mapRef,
    mapInstance,
    selectedPOI,
    isLoaded,
    error,
    isLoadingPOIs,
    isLoadingLocation,
    isUserInteracting,
    validPOICount,
    isUserMarkerVisible: isMarkerVisible,
    handleCenterOnUser,
    handleClosePreview,
    handleGetDirections
  };
};
