
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';
import HeroOverlayNavigation from './hero/HeroOverlayNavigation';

const InteractiveHeroSection = () => {
  return (
    <div className="relative w-full h-[100svh] md:h-screen overflow-hidden">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground isHovered={false} />

      {/* Overlay Navigation - Floating over video */}
      <HeroOverlayNavigation />

      {/* Content Overlay - Restructured */}
      <div className="relative z-10 h-full flex flex-col text-white">
        {/* Brand Section - Left aligned and vertically centered */}
        <div className="flex-1 flex items-center justify-start">
          <HeroBrandSection />
        </div>
        
        {/* Key Features - Bottom */}
        <div className="pb-6 md:pb-8 lg:pb-12 px-3 md:px-4 lg:px-6">
          <HeroFeatures />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
