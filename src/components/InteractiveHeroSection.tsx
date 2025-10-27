
import React, { useEffect } from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRealViewportHeight } from '@/hooks/useRealViewportHeight';

const InteractiveHeroSection = () => {
  const isMobile = useIsMobile();
  const viewportHeight = useRealViewportHeight();

  // Set CSS custom property for real viewport height
  useEffect(() => {
    if (viewportHeight) {
      document.documentElement.style.setProperty('--real-vh', `${viewportHeight * 0.01}px`);
    }
  }, [viewportHeight]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-slate-900"
      style={{
        height: isMobile ? `${viewportHeight}px` : '100vh',
        minHeight: isMobile ? `${viewportHeight}px` : '100vh',
        maxHeight: isMobile ? `${viewportHeight}px` : '100vh'
      }}
    >
      {/* Dynamic Background with Video/Image */}
      <HeroBackground />

      {/* Content Overlay - Restructured */}
      <div 
        className="relative z-10 h-full flex flex-col text-white"
        style={{
          paddingTop: isMobile ? 'max(48px, env(safe-area-inset-top))' : '80px'
        }}
      >
        {/* Brand Section - Centered vertically between navbar and buttons */}
        <div className="flex-1 flex items-center justify-center">
          <HeroBrandSection />
        </div>
        
        {/* Key Features - Moved higher up */}
        {!isMobile && (
          <div className="absolute bottom-16 left-0 right-0 px-3 md:px-4 lg:px-6">
            <HeroFeatures />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
