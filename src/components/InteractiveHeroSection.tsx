
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';
import { useIsMobile } from '@/hooks/use-mobile';

const InteractiveHeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-[100svh] md:h-screen overflow-hidden bg-slate-900">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground />

      {/* Content Overlay - Restructured */}
      <div className="relative z-10 h-full flex flex-col text-white pt-16 md:pt-20 lg:pt-24">
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
