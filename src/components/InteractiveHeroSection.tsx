
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { heroCategories } from './hero/heroCategories';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import UserGreeting from './hero/UserGreeting';
import HeroFeatures from './hero/HeroFeatures';
import HeroNavigation from './hero/HeroNavigation';

const InteractiveHeroSection = () => {
  const navigate = useNavigate();
  const [activeBackground, setActiveBackground] = useState('gusto-sapori');

  const handleCategoryHover = (categoryId: string) => {
    setActiveBackground(categoryId);
  };

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background Layers */}
      <HeroBackground categories={heroCategories} activeBackground={activeBackground} />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Content */}
        <div className="flex-1 flex items-center justify-center text-white text-center px-4">
          <div className="max-w-5xl mx-auto">
            {/* Brand Section */}
            <HeroBrandSection />
            
            <div className="space-y-8 mb-12">
              <UserGreeting />
              <p className="typography-body-large text-slate-100 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
              </p>
              <p className="typography-story-intro text-slate-50 max-w-3xl mx-auto drop-shadow-lg">
                Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
                Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
              </p>
            </div>

            {/* Key features */}
            <HeroFeatures />
          </div>
        </div>

        {/* Interactive Navigation Bar - Bottom Center */}
        <HeroNavigation 
          categories={heroCategories}
          activeBackground={activeBackground}
          onCategoryHover={handleCategoryHover}
          onCategoryClick={handleCategoryClick}
        />
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
