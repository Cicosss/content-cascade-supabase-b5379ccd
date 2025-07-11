
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#EF4444" stroke="white" stroke-width="3"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(24, 24),
      anchor: new window.google.maps.Point(12, 12),
    };
  }, [isGoogleMapsLoaded]);

  return { poiIcon, userIcon };
};
