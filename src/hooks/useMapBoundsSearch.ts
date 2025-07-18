
// This hook has been deprecated and replaced by useBoundsStabilizer
// to prevent infinite loops in map bounds management.
// 
// The new architecture separates:
// - Bounds stabilization (useBoundsStabilizer)
// - POI fetch management (usePOIFetchManager) 
// - Circuit breaker logic for performance protection
//
// This prevents the circular dependency that was causing infinite POI fetches.

export const useMapBoundsSearch = () => {
  console.warn('useMapBoundsSearch is deprecated. Use useBoundsStabilizer instead.');
  
  return {
    isSearching: false,
    showSearchButton: false,
    triggerBoundsSearch: () => {},
    initializeMapListeners: () => () => {},
    getCurrentBounds: () => null
  };
};
