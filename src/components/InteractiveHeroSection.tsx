
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';

const InteractiveHeroSection = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground isHovered={false} />

      {/* Content Overlay - Centered and Optimized */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Brand Section - Main Focus */}
          <HeroBrandSection />
          
          {/* Key Features - Secondary Focus */}
          <HeroFeatures />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
