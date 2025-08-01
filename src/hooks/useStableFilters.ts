// Simplified stable filters for backward compatibility
export function useStableFilters<T extends Record<string, any>>(
  filters: T,
  debounceMs: number = 0
) {
  return {
    stableFilters: filters,
    hasChanged: false,
    hash: JSON.stringify(filters),
    isDebouncing: false
  };
}

export function useCarouselFilters<T extends Record<string, any>>(
  filters: T,
  carouselType: string
) {
  return filters;
}

export function useMapFilters<T extends Record<string, any>>(
  filters: T,
  bounds?: any
) {
  return {
    ...filters,
    bounds: bounds ? {
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west
    } : null
  };
}