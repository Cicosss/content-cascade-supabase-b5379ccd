
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
      <div className="relative z-10 h-full flex flex-col text-white pt-20">
        {/* Brand Section - Desktop aligned with hamburger menu, mobile centered */}
        <div className={`flex-1 flex justify-start ${isMobile ? 'items-center' : 'items-start pt-6'}`}>
          <HeroBrandSection />
        </div>
        
        {/* Key Features - Moved higher up */}
        {!isMobile && (
          <div className="absolute bottom-32 left-0 right-0 px-3 md:px-4 lg:px-6">
            <HeroFeatures />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
