
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';

const InteractiveHeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground isHovered={false} />

      {/* Content Overlay - Restructured */}
      <div className="relative z-10 h-full flex flex-col text-white px-4">
        {/* Brand Section - Center */}
        <div className="flex-1 flex items-center justify-center">
          <HeroBrandSection />
        </div>
        
        {/* Key Features - Bottom */}
        <div className="pb-8 lg:pb-12">
          <HeroFeatures />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
