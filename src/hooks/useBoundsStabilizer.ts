
import { useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from './useDebounceCallback';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UseBoundsStabilizerProps {
  map: google.maps.Map | null;
  onStableBoundsChange: (bounds: MapBounds) => void;
  stabilizationDelay?: number;
}

export const useBoundsStabilizer = ({ 
  map, 
  onStableBoundsChange, 
  stabilizationDelay = 2000 
}: UseBoundsStabilizerProps) => {
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastBoundsRef = useRef<MapBounds | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const stabilizationTimeoutRef = useRef<NodeJS.Timeout>();
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const getCurrentBounds = useCallback((): MapBounds | null => {
    if (!map) return null;
    
    const bounds = map.getBounds();
    if (!bounds) return null;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    return {
      north: Math.round(ne.lat() * 100000) / 100000,
      south: Math.round(sw.lat() * 100000) / 100000,
      east: Math.round(ne.lng() * 100000) / 100000,
      west: Math.round(sw.lng() * 100000) / 100000
    };
  }, [map]);

  const areBoundsSignificantlyDifferent = useCallback((bounds1: MapBounds, bounds2: MapBounds): boolean => {
    const threshold = 0.01; // Soglia più alta per evitare micro-cambiamenti
    return (
      Math.abs(bounds1.north - bounds2.north) > threshold ||
      Math.abs(bounds1.south - bounds2.south) > threshold ||
      Math.abs(bounds1.east - bounds2.east) > threshold ||
      Math.abs(bounds1.west - bounds2.west) > threshold
    );
  }, []);

  const handleStableBoundsChange = useDebounceCallback(() => {
    const currentBounds = getCurrentBounds();
    if (!currentBounds) return;

    const lastBounds = lastBoundsRef.current;
    
    // Solo se i bounds sono significativamente diversi
    if (!lastBounds || areBoundsSignificantlyDifferent(currentBounds, lastBounds)) {
      console.log('🎯 Stable bounds change detected:', currentBounds);
      onStableBoundsChange(currentBounds);
      lastBoundsRef.current = currentBounds;
    }
  }, stabilizationDelay);

  const handleUserInteractionStart = useCallback(() => {
    setIsUserInteracting(true);
    
    // Clear existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  }, []);

  const handleUserInteractionEnd = useCallback(() => {
    // Debounced end of interaction
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
      
      // Trigger bounds check after interaction ends
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
      }
      
      stabilizationTimeoutRef.current = setTimeout(() => {
        handleStableBoundsChange();
      }, 500); // Breve delay dopo la fine dell'interazione
      
    }, 300);
  }, [handleStableBoundsChange]);

  const initializeListeners = useCallback(() => {
    if (!map) return () => {};

    // Clear existing listeners
    listenersRef.current.forEach(listener => listener.remove());
    listenersRef.current = [];

    // User interaction listeners
    const dragStartListener = map.addListener('dragstart', handleUserInteractionStart);
    const dragEndListener = map.addListener('dragend', handleUserInteractionEnd);
    const zoomStartListener = map.addListener('zoom_changed', handleUserInteractionStart);
    
    // Mouse/touch interaction listeners
    const mouseDownListener = map.addListener('mousedown', handleUserInteractionStart);
    const mouseUpListener = map.addListener('mouseup', handleUserInteractionEnd);
    const touchStartListener = map.addListener('touchstart', handleUserInteractionStart);
    const touchEndListener = map.addListener('touchend', handleUserInteractionEnd);

    listenersRef.current = [
      dragStartListener,
      dragEndListener,
      zoomStartListener,
      mouseDownListener,
      mouseUpListener,
      touchStartListener,
      touchEndListener
    ];

    // Initial bounds setting (only once)
    const initialBounds = getCurrentBounds();
    if (initialBounds) {
      console.log('🎯 Setting initial bounds:', initialBounds);
      onStableBoundsChange(initialBounds);
      lastBoundsRef.current = initialBounds;
    }

    return () => {
      listenersRef.current.forEach(listener => listener.remove());
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
      if (stabilizationTimeoutRef.current) clearTimeout(stabilizationTimeoutRef.current);
    };
  }, [map, handleUserInteractionStart, handleUserInteractionEnd, getCurrentBounds, onStableBoundsChange]);

  return {
    isUserInteracting,
    initializeListeners,
    getCurrentBounds
  };
};
