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

  const getCurrentBounds = useCallback((): MapBounds | null => {
    if (!map) return null;
    
    const bounds = map.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    return {
      north: ne.lat(),
      south: sw.lat(),
      east: ne.lng(),
      west: sw.lng()
    };
  }, [map]);

  const triggerBoundsSearch = useCallback(() => {
    const bounds = getCurrentBounds();
    if (!bounds) return;

    setIsSearching(true);
    setShowSearchButton(false);
    
    onBoundsChange(bounds);
    lastBoundsRef.current = bounds;

    // Hide searching indicator after a delay
    setTimeout(() => setIsSearching(false), 1000);
  }, [getCurrentBounds, onBoundsChange]);

  const debouncedTriggerSearch = useDebounceCallback(triggerBoundsSearch, debounceMs);

  const handleMapMovement = useCallback(() => {
    const currentBounds = getCurrentBounds();
    if (!currentBounds) return;

    // Check if bounds changed significantly
    const boundsChanged = !lastBoundsRef.current || 
      Math.abs(currentBounds.north - lastBoundsRef.current.north) > 0.01 ||
      Math.abs(currentBounds.south - lastBoundsRef.current.south) > 0.01 ||
      Math.abs(currentBounds.east - lastBoundsRef.current.east) > 0.01 ||
      Math.abs(currentBounds.west - lastBoundsRef.current.west) > 0.01;

    if (boundsChanged) {
      setShowSearchButton(true);
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-search after user stops moving
      timeoutRef.current = setTimeout(() => {
        debouncedTriggerSearch();
      }, 1500);
    }
  }, [getCurrentBounds, debouncedTriggerSearch]);

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