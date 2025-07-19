import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface DynamicLimitConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  min: number;
  max: number;
}

// Configurazioni default per diversi tipi di caroselli
const DEFAULT_LIMITS: Record<string, DynamicLimitConfig> = {
  homepage: {
    mobile: 4,
    tablet: 6,
    desktop: 8,
    min: 3,
    max: 12
  },
  dashboard: {
    mobile: 3,
    tablet: 6,
    desktop: 8,
    min: 3,
    max: 10
  },
  featured: {
    mobile: 2,
    tablet: 4,
    desktop: 6,
    min: 2,
    max: 8
  }
};

export const useDynamicLimits = (
  carouselType: keyof typeof DEFAULT_LIMITS = 'homepage',
  availableItems?: number,
  customConfig?: Partial<DynamicLimitConfig>
) => {
  const isMobile = useIsMobile();
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Rileva la dimensione dello schermo
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calcola il limite dinamico
  const calculateLimit = () => {
    const config = { ...DEFAULT_LIMITS[carouselType], ...customConfig };
    
    // Limite base per la dimensione dello schermo
    let baseLimit = config[screenSize];
    
    // Limita il numero basandosi sui contenuti disponibili
    if (availableItems !== undefined) {
      baseLimit = Math.min(baseLimit, availableItems);
    }
    
    // Applica i limiti min/max
    const finalLimit = Math.max(config.min, Math.min(config.max, baseLimit));
    
    return finalLimit;
  };

  // Calcola se dovrebbe mostrare paginazione/caricamento lazy
  const shouldShowPagination = () => {
    if (!availableItems) return false;
    return availableItems > calculateLimit();
  };

  // Calcola il numero di elementi rimanenti
  const getRemainingItems = () => {
    if (!availableItems) return 0;
    return Math.max(0, availableItems - calculateLimit());
  };

  // Ottieni le informazioni sul layout consigliato
  const getLayoutInfo = () => {
    const limit = calculateLimit();
    
    return {
      limit,
      screenSize,
      itemsPerRow: screenSize === 'mobile' ? 1 : screenSize === 'tablet' ? 2 : 4,
      shouldUseCompactView: screenSize === 'mobile',
      shouldShowNavigation: limit > (screenSize === 'mobile' ? 2 : 3),
      recommendedHeight: screenSize === 'mobile' ? '300px' : '350px'
    };
  };

  return {
    limit: calculateLimit(),
    screenSize,
    shouldShowPagination: shouldShowPagination(),
    remainingItems: getRemainingItems(),
    layoutInfo: getLayoutInfo(),
    isMobile
  };
};