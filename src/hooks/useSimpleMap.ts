import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useSmartPOIFetching } from '@/hooks/useSmartPOIFetching';
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
  
  const boundsTimeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const stabilizationTimeoutRef = useRef<NodeJS.Timeout>();
  const lastBoundsRef = useRef<string>('');

  const { userLocation, getCurrentLocation, isLoadingLocation } = useLocation();
  const { isLoaded, error } = useGoogleMapsLoader();

  // Initialize marker icons
  const { userIcon } = useMarkerIcons(isLoaded);

  // Prepare POI filters with proper type casting
  const poiFilters: POIFilters = {
    activityTypes: filters.activityTypes?.length > 0 && !filters.activityTypes.includes('tutto') 
      ? filters.activityTypes 
      : [],
    withChildren: (filters.withChildren === 'si' ? 'si' : 'no') as 'si' | 'no',
    bounds: mapBounds
  };

  // Use smart POI fetching with geographic cache
  const { pois, fetchPOIs, isLoading: isLoadingPOIs, getCacheStats } = useSmartPOIFetching({
    userLocation,
    filters: poiFilters
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
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [isLoaded, userLocation, mapInstance]);

  // Optimized bounds change handler with enhanced stabilization
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

    // Create a bounds signature to prevent duplicate calls
    const boundsSignature = `${newBounds.north},${newBounds.south},${newBounds.east},${newBounds.west}`;
    
    // Skip if bounds haven't actually changed
    if (boundsSignature === lastBoundsRef.current) {
      return;
    }
    
    lastBoundsRef.current = boundsSignature;

    // Clear existing timeouts
    if (boundsTimeoutRef.current) clearTimeout(boundsTimeoutRef.current);
    if (stabilizationTimeoutRef.current) clearTimeout(stabilizationTimeoutRef.current);

    // Immediate cache check with reduced timing
    boundsTimeoutRef.current = setTimeout(() => {
      console.log('🗺️ Cache check for bounds:', newBounds);
      setMapBounds(newBounds);
    }, 100);

    // Stabilized fetch (for fresh data if needed) with reduced delay
    stabilizationTimeoutRef.current = setTimeout(() => {
      console.log('🔄 Stabilized bounds change:', newBounds);
      fetchPOIs(newBounds);
    }, 300); // Reduced from 3000ms to 300ms
  }, [mapInstance, fetchPOIs]);

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
      if (stabilizationTimeoutRef.current) clearTimeout(stabilizationTimeoutRef.current);
    };
  }, [mapInstance, handleBoundsChange, handleInteractionStart, handleInteractionEnd]);

  // Trigger initial load when bounds are set
  useEffect(() => {
    if (mapBounds && pois.length === 0) {
      fetchPOIs(mapBounds);
    }
  }, [mapBounds, fetchPOIs, pois.length]);

  // Marker management with optimized pooling
  const { clearAllMarkers, validPOICount } = useOptimizedMarkerPool({
    map: mapInstance,
    pois,
    userLocation,
    onPOISelect: setSelectedPOI,
    isGoogleMapsLoaded: isLoaded
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
    cacheStats: getCacheStats()
  };
};
