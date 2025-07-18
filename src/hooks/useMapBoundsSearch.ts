import { useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from './useDebounceCallback';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UseMapBoundsSearchProps {
  map: google.maps.Map | null;
  onBoundsChange: (bounds: MapBounds | null) => void;
  debounceMs?: number;
}

export const useMapBoundsSearch = ({ 
  map, 
  onBoundsChange, 
  debounceMs = 500 
}: UseMapBoundsSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const boundsHistoryRef = useRef<MapBounds[]>([]);
  const searchCountRef = useRef(0);
  const MAX_HISTORY = 5;

  const getCurrentBounds = useCallback((): MapBounds | null => {
    if (!map) return null;
    
    const bounds = map.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const newBounds: MapBounds = {
      north: Math.round(ne.lat() * 100000) / 100000, // 5 decimali precisione
      south: Math.round(sw.lat() * 100000) / 100000,
      east: Math.round(ne.lng() * 100000) / 100000,
      west: Math.round(sw.lng() * 100000) / 100000
    };

    // Cache locale per ridurre calcoli ripetuti
    const lastBounds = lastBoundsRef.current;
    if (lastBounds) {
      const threshold = 0.001; // ~100m di differenza
      const latDiff = Math.abs(newBounds.north - lastBounds.north);
      const lngDiff = Math.abs(newBounds.east - lastBounds.east);
      
      if (latDiff < threshold && lngDiff < threshold) {
        return lastBounds; // Riusa bounds cached se cambio minimo
      }
    }

    return newBounds;
  }, [map]);

  const triggerBoundsSearch = useCallback(() => {
    const bounds = getCurrentBounds();
    if (!bounds) return;

    searchCountRef.current += 1;
    setIsSearching(true);
    setShowSearchButton(false);
    
    // Aggiungi ai bounds history per analytics
    boundsHistoryRef.current.push(bounds);
    if (boundsHistoryRef.current.length > MAX_HISTORY) {
      boundsHistoryRef.current.shift();
    }
    
    console.log(`🗺️ Map bounds search #${searchCountRef.current}:`, {
      bounds,
      area: ((bounds.north - bounds.south) * (bounds.east - bounds.west)).toFixed(6)
    });
    
    onBoundsChange(bounds);
    lastBoundsRef.current = bounds;

    // Hide searching indicator after delay
    setTimeout(() => setIsSearching(false), 800);
  }, [getCurrentBounds, onBoundsChange]);

  const debouncedTriggerSearch = useDebounceCallback(triggerBoundsSearch, debounceMs);

  const handleMapMovement = useCallback(() => {
    const currentBounds = getCurrentBounds();
    if (!currentBounds) return;

    // Verifica se bounds sono cambiati significativamente (ottimizzato)
    const boundsChanged = !lastBoundsRef.current || 
      Math.abs(currentBounds.north - lastBoundsRef.current.north) > 0.005 || // Soglia ridotta per meno trigger
      Math.abs(currentBounds.south - lastBoundsRef.current.south) > 0.005 ||
      Math.abs(currentBounds.east - lastBoundsRef.current.east) > 0.005 ||
      Math.abs(currentBounds.west - lastBoundsRef.current.west) > 0.005;

    if (boundsChanged) {
      setShowSearchButton(true);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-search con debouncing più intelligente
      timeoutRef.current = setTimeout(() => {
        // Verifica finale prima del trigger per evitare ricerche inutili
        const finalBounds = getCurrentBounds();
        if (finalBounds && JSON.stringify(finalBounds) !== JSON.stringify(lastBoundsRef.current)) {
          debouncedTriggerSearch();
        }
      }, debounceMs * 2); // Tempo più lungo per auto-search
    }
  }, [getCurrentBounds, debouncedTriggerSearch, debounceMs]);

  const initializeMapListeners = useCallback(() => {
    if (!map) return;

    const boundsChangedListener = map.addListener('bounds_changed', handleMapMovement);
    const dragEndListener = map.addListener('dragend', handleMapMovement);
    const zoomChangedListener = map.addListener('zoom_changed', handleMapMovement);

    // Initial search
    triggerBoundsSearch();

    return () => {
      if (boundsChangedListener) boundsChangedListener.remove();
      if (dragEndListener) dragEndListener.remove();
      if (zoomChangedListener) zoomChangedListener.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [map, handleMapMovement, triggerBoundsSearch]);

  return {
    isSearching,
    showSearchButton,
    triggerBoundsSearch,
    initializeMapListeners,
    getCurrentBounds
  };
};