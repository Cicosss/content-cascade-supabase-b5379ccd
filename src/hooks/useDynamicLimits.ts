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

// Hook per performance monitoring dei caroselli
export const useCarouselPerformance = () => {
  const [loadTime, setLoadTime] = useState<number>(0);
  const [renderTime, setRenderTime] = useState<number>(0);

  const startTimer = () => {
    const startTime = performance.now();
    
    return {
      endLoad: () => {
        setLoadTime(performance.now() - startTime);
      },
      endRender: () => {
        setRenderTime(performance.now() - startTime);
      }
    };
  };

  // Determina se le performance sono accettabili
  const getPerformanceStatus = () => {
    if (loadTime === 0) return 'measuring';
    
    if (loadTime < 500 && renderTime < 100) return 'excellent';
    if (loadTime < 1000 && renderTime < 200) return 'good';
    if (loadTime < 2000 && renderTime < 500) return 'acceptable';
    return 'poor';
  };

  // Raccomandazioni per migliorare le performance
  const getPerformanceRecommendations = () => {
    const status = getPerformanceStatus();
    const recommendations: string[] = [];

    if (status === 'poor') {
      if (loadTime > 2000) {
        recommendations.push('Considera di ridurre il numero di elementi caricati');
        recommendations.push('Implementa lazy loading per le immagini');
      }
      if (renderTime > 500) {
        recommendations.push('Ottimizza il rendering delle card');
        recommendations.push('Usa memoization per componenti pesanti');
      }
    }

    return recommendations;
  };

  return {
    loadTime,
    renderTime,
    startTimer,
    performanceStatus: getPerformanceStatus(),
    recommendations: getPerformanceRecommendations()
  };
};