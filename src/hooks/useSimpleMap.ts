import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useSimplifiedPOIData } from '@/hooks/useSimplifiedPOIData';
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
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMapInstanceReady, setIsMapInstanceReady] = useState(false);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const lastBoundsRef = useRef<string>('');

  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { isLoaded, error } = useGoogleMapsLoader();

  // Initialize marker icons
  const { userIcon, poiIcon } = useMarkerIcons(isLoaded);

  // Prepare POI filters with proper type casting and bounds logic
  const isAllCategories = !filters.activityTypes?.length ||
    filters.activityTypes.includes('tutte') ||
    filters.activityTypes.includes('tutto');
  const poiFilters: POIFilters = {
    activityTypes: isAllCategories ? [] : filters.activityTypes,
    withChildren: (filters.withChildren === 'si' ? 'si' : 'no') as 'si' | 'no',
    bounds: null
  };

  // Use simplified POI fetching without geographic cache
  const { pois, fetchPOIs, isLoading: isLoadingPOIs, getCacheStats } = useSimplifiedPOIData({
    initialFilters: poiFilters
  });

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
        fullscreenControl: false, // Disabled on mobile 
        zoomControl: false, // Disabled on mobile for touch gestures
        panControl: false, // Disabled pan control
        rotateControl: false, // Disabled rotate control 
        scaleControl: false, // Disabled scale control
        gestureHandling: 'greedy', // Enable all touch gestures
        disableDefaultUI: true, // Disable all default UI controls
      });

      setMapInstance(map);
      
      // Wait for map to be fully ready before enabling markers
      setTimeout(() => {
        console.log('🗺️ Map instance is now ready for markers');
        setIsMapInstanceReady(true);
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isLoaded, userLocation, mapInstance]);

  // Optimized map idle handler with single debounced fetch
  const handleMapIdle = useCallback(() => {
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

    // Create a bounds signature to prevent duplicate calls
    const boundsSignature = `${newBounds.north},${newBounds.south},${newBounds.east},${newBounds.west}`;

    // Skip if bounds haven't actually changed
    if (boundsSignature === lastBoundsRef.current) {
      return;
    }

    lastBoundsRef.current = boundsSignature;

    // Debounced fetch based on stabilized bounds
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      const updatedFilters: POIFilters = {
        activityTypes: isAllCategories ? [] : filters.activityTypes,
        withChildren: (filters.withChildren === 'si' ? 'si' : 'no') as 'si' | 'no',
        bounds: isAllCategories ? newBounds : null,
      };
      fetchPOIs(updatedFilters);
    }, 300);
  }, [mapInstance, fetchPOIs, filters.activityTypes, filters.withChildren, isAllCategories]);

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
    }, 500);
  }, []);

  // Setup map listeners
  useEffect(() => {
    if (!mapInstance) return;

    const listeners = [
      mapInstance.addListener('idle', handleMapIdle),
      mapInstance.addListener('dragstart', handleInteractionStart),
      mapInstance.addListener('dragend', handleInteractionEnd),
      mapInstance.addListener('zoom_changed', handleInteractionStart),
    ];

    // Set initial fetch on first idle
    handleMapIdle();

    return () => {
      listeners.forEach(listener => listener.remove());
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [mapInstance, handleMapIdle, handleInteractionStart, handleInteractionEnd]);


  // Marker management with optimized pooling - only when map is ready
  const { clearAllMarkers, validPOICount } = useOptimizedMarkerPool({
    map: isMapInstanceReady ? mapInstance : null,
    pois: isMapInstanceReady ? pois : [],
    onPOISelect: setSelectedPOI,
    poiIcon
  });

  // User location marker
  const { isMarkerVisible } = useUserLocationMarker({
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

  // Debug cache stats
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = getCacheStats();
      console.log('📊 Cache Stats:', stats);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [getCacheStats]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllMarkers();
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
    handleGetDirections,
    cacheStats: {
      ...getCacheStats(),
      totalTiles: 0,
      freshTiles: 0,
      staleTiles: 0,
      maxPOIs: 1000,
      maxTiles: 0
    }
  };
};
