
import { useRef, useEffect, useState } from 'react';

interface UseUserLocationMarkerProps {
  map: google.maps.Map | null;
  userLocation: { lat: number; lng: number } | null;
  userIcon: google.maps.Icon | null;
}

export const useUserLocationMarker = ({ map, userLocation, userIcon }: UseUserLocationMarkerProps) => {
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const markerStateRef = useRef<'creating' | 'updating' | 'idle'>('idle');
  const lastLocationRef = useRef<string>('');

  // Manage user location marker with stability controls
  useEffect(() => {
    if (!map || !window.google?.maps || !userIcon) return;

    if (userLocation) {
      const locationKey = `${userLocation.lat.toFixed(6)},${userLocation.lng.toFixed(6)}`;
      
      // Skip if location hasn't changed and we're not idle
      if (locationKey === lastLocationRef.current && markerStateRef.current !== 'idle') {
        return;
      }
      
      lastLocationRef.current = locationKey;

      if (!userMarkerRef.current) {
        // Prevent multiple marker creation attempts
        if (markerStateRef.current === 'creating') return;
        markerStateRef.current = 'creating';
        
        console.log('📍 Creating user marker at:', userLocation);
        
        // Create new marker for user
        userMarkerRef.current = new google.maps.Marker({
          position: userLocation,
          title: 'La tua posizione GPS',
          icon: userIcon,
          map: map,
          zIndex: 1000,
          animation: google.maps.Animation.DROP
        });

        // Create InfoWindow
        infoWindowRef.current = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">📍 La tua posizione</h4>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Lat: ${userLocation.lat.toFixed(6)}<br/>
                Lng: ${userLocation.lng.toFixed(6)}
              </p>
              <p style="margin: 8px 0 0 0; color: #059669; font-size: 11px;">
                ✅ GPS attivo
              </p>
            </div>
          `
        });

        // Add click listener
        userMarkerRef.current.addListener('click', () => {
          if (infoWindowRef.current && userMarkerRef.current) {
            infoWindowRef.current.open(map, userMarkerRef.current);
          }
        });

        setIsMarkerVisible(true);
        markerStateRef.current = 'idle';
        console.log('✅ User marker created successfully');
      } else {
        // Update existing marker position
        if (markerStateRef.current === 'updating') return;
        markerStateRef.current = 'updating';
        
        userMarkerRef.current.setPosition(userLocation);
        userMarkerRef.current.setMap(map);
        
        // Update InfoWindow content
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">📍 La tua posizione</h4>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Lat: ${userLocation.lat.toFixed(6)}<br/>
                Lng: ${userLocation.lng.toFixed(6)}
              </p>
              <p style="margin: 8px 0 0 0; color: #059669; font-size: 11px;">
                ✅ GPS attivo
              </p>
            </div>
          `);
        }
        
        markerStateRef.current = 'idle';
        console.log('🔄 User marker position updated');
      }
    } else if (userMarkerRef.current && markerStateRef.current === 'idle') {
      // Hide marker only when idle to prevent continuous removal
      userMarkerRef.current.setMap(null);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      setIsMarkerVisible(false);
      console.log('🫥 User marker hidden - no GPS location');
    }
  }, [map, userLocation, userIcon]);

  const clearUserMarker = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
    setIsMarkerVisible(false);
    markerStateRef.current = 'idle';
    lastLocationRef.current = '';
    console.log('🗑️ User marker completely removed');
  };

  return { 
    clearUserMarker, 
    userMarker: userMarkerRef.current,
    isMarkerVisible
  };
};
