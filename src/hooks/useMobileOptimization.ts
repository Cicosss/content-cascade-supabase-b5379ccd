import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationConfig {
  // Layout settings
  mobileHeaderHeight: string;
  mobileContainerPadding: string;
  mobileTouchTargetSize: string;
  
  // Carousel settings
  mobileCarouselItemsPerView: number;
  mobileCarouselSpacing: string;
  
  // Typography settings
  mobileFontScale: number;
  mobileLineHeight: number;
}

const defaultConfig: MobileOptimizationConfig = {
  mobileHeaderHeight: '4rem', // 64px
  mobileContainerPadding: '0.75rem', // 12px
  mobileTouchTargetSize: '44px',
  mobileCarouselItemsPerView: 1.2,
  mobileCarouselSpacing: '0.75rem',
  mobileFontScale: 0.9,
  mobileLineHeight: 1.4,
};

export const useMobileOptimization = (customConfig?: Partial<MobileOptimizationConfig>) => {
  const isMobile = useIsMobile();
  const [config] = useState<MobileOptimizationConfig>({
    ...defaultConfig,
    ...customConfig,
  });

  // Mobile-first responsive classes generator
  const getResponsiveClasses = (mobileClass: string, desktopClass: string) => {
    return `${mobileClass} md:${desktopClass}`;
  };

  // Touch-friendly sizing
  const getTouchTargetClasses = () => {
    return isMobile ? 'min-h-[44px] min-w-[44px] p-3' : 'min-h-[40px] min-w-[40px] p-2';
  };

  // Container padding based on screen size
  const getContainerPadding = () => {
    return isMobile ? 'px-3 py-2' : 'px-4 py-3 lg:px-6 lg:py-4';
  };

  // Typography scale for mobile
  const getMobileTypography = (baseSize: string) => {
    if (!isMobile) return baseSize;
    
    const sizeMap: Record<string, string> = {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-sm',
      'text-lg': 'text-base',
      'text-xl': 'text-lg',
      'text-2xl': 'text-xl',
      'text-3xl': 'text-2xl',
      'text-4xl': 'text-3xl',
    };
    
    return sizeMap[baseSize] || baseSize;
  };

  // Carousel configuration for mobile
  const getCarouselConfig = () => {
    return {
      itemsPerView: isMobile ? config.mobileCarouselItemsPerView : 'auto',
      spacing: isMobile ? config.mobileCarouselSpacing : '1rem',
      showArrows: !isMobile,
      enableTouch: true,
    };
  };

  return {
    isMobile,
    config,
    getResponsiveClasses,
    getTouchTargetClasses,
    getContainerPadding,
    getMobileTypography,
    getCarouselConfig,
  };
};