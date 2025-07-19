
import { useMemo } from 'react';

export const useMarkerIcons = (isGoogleMapsLoaded?: boolean) => {
  // Memoized POI icon configuration
  const poiIcon = useMemo(() => {
    if (!window.google?.maps?.Size || !isGoogleMapsLoaded) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#1e3a8a" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="5" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    };
  }, [isGoogleMapsLoaded]);

  // Memoized user location icon configuration
  const userIcon = useMemo(() => {
    if (!window.google?.maps?.Size || !isGoogleMapsLoaded) return null;
    
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Cerchio esterno blu -->
          <circle cx="16" cy="16" r="14" fill="#3B82F6" fill-opacity="0.3" stroke="#3B82F6" stroke-width="2"/>
          <!-- Cerchio principale rosso -->
          <circle cx="16" cy="16" r="10" fill="#EF4444" stroke="white" stroke-width="3"/>
          <!-- Punto centrale bianco -->
          <circle cx="16" cy="16" r="4" fill="white"/>
          <!-- Punto centrale piccolo -->
          <circle cx="16" cy="16" r="2" fill="#EF4444"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16),
    };
  }, [isGoogleMapsLoaded]);

  return { poiIcon, userIcon };
};
