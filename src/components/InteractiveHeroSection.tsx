
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroCategories } from './hero/heroCategories';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';
import HeroNavigation from './hero/HeroNavigation';

const InteractiveHeroSection = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleCategoryHover = () => {
    setIsHovered(true);
  };

  const handleCategoryLeave = () => {
    setIsHovered(false);
  };

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground isHovered={isHovered} />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Content */}
        <div className="flex-1 flex items-center justify-center text-white text-center px-4">
          <div className="max-w-5xl mx-auto">
            {/* Brand Section */}
            <HeroBrandSection />
            

            {/* Key features */}
            <HeroFeatures />
          </div>
        </div>

        {/* Interactive Navigation Bar - Bottom Center */}
        <div onMouseLeave={handleCategoryLeave}>
          <HeroNavigation 
            categories={heroCategories}
            onCategoryHover={handleCategoryHover}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
